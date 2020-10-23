import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import * as TESTDATA from './test-data';
import { Instance, InstanceStates } from 'src/app/models/instance';

// Mock interceptor based on fake-backend.ts from github.com/cornflourblue/angular-9-registration-login-example

const NO_AUTH_ENDPOINTS = ['sessions'];

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  public static AUTHENTICATION_ENABLED = true;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // unpack request to helper variables
    const {url, method, headers, body} = req;
    console.log(req);
    const apiComponents = url.substring(url.lastIndexOf('api/v1/') + 7).split('/');
    const endpoint = apiComponents[0];
    let objectId = null;
    switch (true) {
      case (endpoint === 'instances' && apiComponents[1] !== undefined):
        objectId = apiComponents[1];
        break;
      case (endpoint === 'workspaces' && apiComponents[1] === 'workspace_join' && apiComponents[2] !== undefined):
        objectId = apiComponents[2];
        break;
      case (endpoint === 'workspaces' && apiComponents[1] === 'workspace_exit' && apiComponents[2] !== undefined):
        objectId = apiComponents[2];
        break;
      case (endpoint === 'users' && apiComponents[1] !== undefined):
        objectId = apiComponents[1];
        break;
      default:
        // pass through any requests not handled above
        break;
    }

    const database = loadDatabase();

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(50))
      .pipe(dematerialize());

    function handleRoute() {
      if (MockInterceptor.AUTHENTICATION_ENABLED && !isLoggedIn() && !(NO_AUTH_ENDPOINTS.includes(endpoint))) {
        return unauthorized();
      }
      switch (true) {
        // TODO : endsWith is not supported in IE 11 last version
        case url.endsWith('/sessions') && method === 'POST':
          return authenticate();
        case url.endsWith('/instances') && method === 'POST':
          return createInstance();
        case url.endsWith('/instances') && method === 'GET':
          return getInstances();
        case url.includes('/instances') && method === 'DELETE':
          return deleteInstance();
        case url.endsWith('/environments') && method === 'GET':
          return getEnvironments();
        case url.includes('/workspaces/workspace_list_exit') && method === 'GET':
          return getWorkspaces();
        case url.includes('/workspaces/workspace_join') && method === 'PUT':
          return joinWorkspace();
        case url.includes('/workspaces/workspace_exit') && method === 'PUT':
          return exitWorkspace();
        case url.endsWith('/notifications') && method === 'GET':
          return getMessages();
        case url.includes('/users') && method === 'GET':
          return getUserById();
        case method === 'GET':
          return genericGet();
        default:
          // pass through any requests not handled above
          return next.handle(req);
      }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // route functions

    function authenticate() {
      const {eppn, password} = body;
      const users = database.users;
      const user = users.find(x => x.eppn === eppn && x.password === password);
      if (!user) {
        return error('EPPN or password is incorrect');
      }
      return ok({
        user_id: user.id,
        token: 'fake-token',
        is_admin: user.is_admin,
        is_group_owner: user.is_workspace_owner,
        is_workspace_manager: user.is_workspace_manager,
      });
    }

    function genericGet() {
      const data = database[endpoint];
      if (!data) {
        return error('No such data in mock database ' + endpoint);
      }
      return ok(data);
    }

    function getUserById() {
      const account = database.users.find((i) => {
        return (i.id === objectId);
      });
      if (account) {
        return ok(account);
      } else {
        return error('account not found');
      }
    }

    // mimic instance lifetime behavior
    function getInstances() {

      // instance states from API
      const states = [
        'queueing',
        'provisioning',
        'starting',
        'running',
        'deleting',
        'deleted',
        'failed',
      ];
      const terminalStates = ['deleted', 'failed'];

      const instances = database.instances;
      const result = [];

      for (const instance of instances) {
        // filter out deleted instances
        if (terminalStates.indexOf(instance.state) >= 0) {
          continue;
        }
        // assign an endpoint to instance that is starting
        if (instance.state === 'starting') {
          instance.instance_data = {endpoints: [{access: 'assets/images/jupyter_example_content.png'}]};
        }
        // advance the transitive states
        if (instance.state !== 'running') {
          instance.state = states[states.indexOf(instance.state) + 1];
          console.log('instance ' + instance.name + 'now in state ' + instance.state);
        }
        result.push(instance);
      }
      return ok(result);
    }

    function getEnvironments() {
      const workspaces = database.workspaces;

      const workspaceIds = workspaces.map(ws => {
        // if (!workspaceIds.includes(ws.id)){
        return ws.id;
        // }
      });
      console.log(workspaceIds);
      const environments = database.environments.filter((env) => {
        return workspaceIds.includes(env.workspace_id);
      });
      return ok(environments);
      // return ok(database.environments);
    }

    function createInstance() {

      const {environment: envId} = body;
      // check if the environment exists
      if (!envId || !database.environments.find(env => env.id === envId)) {
        error('environment not found ' + envId);
      }
      // make sure there are existing instances for the environment
      if (database.instances.find(inst => inst.environment_id === envId && inst.state !== InstanceStates.Deleted)) {
        error('instance already running for environment ' + envId);
      }

      const instanceId = Math.random().toString(36).substring(2, 8);

      const instance = new Instance(
        instanceId,
        'pb-random-' + instanceId,
        envId,
        InstanceStates.Queueing,
        ''
      );
      database.instances.push(instance);

      return ok(instance);
    }

    function deleteInstance() {

      const instance = database.instances.find((i) => {
        return (i.id === objectId);
      });

      if (instance) {
        instance.state = 'deleting';

        return ok(instance);
      } else {
        return error('instance not found');
      }
    }

    function getWorkspaces() {
      const user_name = localStorage.getItem('user_name');
      const workspaces = database.workspaces.filter(ws => {
        if (ws.member_eppns.includes(user_name)) {
          return true;
        }
        // if (ws.owner_eppn === user_name){
        //   return true;
        // }
        return false;
      });
      return ok(workspaces);
    }

    function joinWorkspace() {
      const target_workspaces = database.workspaces.filter(ws => {
        return (ws.join_code === objectId);
      });
      if (target_workspaces.length > 0) {
        const user_name = localStorage.getItem('user_name');
        database.workspaces = database.workspaces.map(ws => {
          if (ws.join_code === objectId) {
            if (!ws.member_eppns.includes(user_name)) {
              ws.member_eppns.push(user_name);
            }
          }
          return ws;
        });
        return ok(objectId);
      } else {
        return error('workspace not found');
      }
    }

    function exitWorkspace() {
      const user_name = localStorage.getItem('user_name');
      database.workspaces = database.workspaces.map((ws) => {
        if (ws.id === objectId) {
          const index = ws.member_eppns.indexOf(user_name);
          ws.member_eppns.splice(index, 1);
        }
        return ws;
      });
      return ok(objectId);
    }

    // function deleteWorkspace() {
    //   const workspace = database.workspaces.find((ws) => {
    //     return (ws.id === objectId);
    //   });

    //   const workspaces = database.workspaces.filter((ws) => {
    //     return (ws.id !== objectId);
    //   });
    //   database.workspaces = workspaces;

    //   if (workspace) {
    //     return ok(workspace);
    //   } else {
    //     return error('workspace not found');
    //   }
    // }

    function getMessages() {
      const messages = database.messages;
      return ok(messages);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // helper functions

    function ok(reqBody?) {
      saveDatabase();
      return of(new HttpResponse({status: 200, body: reqBody}));
    }

    function error(message) {
      saveDatabase();
      return throwError({error: {message}});
    }

    function unauthorized() {
      return throwError(new HttpErrorResponse({status: 401, error: {message: 'Unauthorised'}}));
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Basic ZmFrZS10b2tlbjo=';
    }

    function loadDatabase() {
      if (localStorage.getItem('mock.database')) {
        return JSON.parse(localStorage.getItem('mock.database'));
      } else {
        return TESTDATA.db;
      }
    }

    function saveDatabase() {
      localStorage.setItem('mock.database', JSON.stringify(database));
    }
  }
}
