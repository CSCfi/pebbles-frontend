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
import { User } from 'src/app/models/user';
import { Workspace } from '../models/workspace';
import { Environment } from '../models/environment';
import { WorkspaceUserList } from '../models/workspace-user-list';

// Mock interceptor based on fake-backend.ts from github.com/cornflourblue/angular-9-registration-login-example

const NO_AUTH_ENDPOINTS = ['sessions'];

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  public static AUTHENTICATION_ENABLED = true;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // unpack request to helper variables
    const { method, headers, body } = req;
    let url = null;
    let args = null;
    console.log(req);
    if (req.url.indexOf('?') >= 0) {
      url = req.url.split('?')[0];
      args = req.url.split('?')[1];
    } else {
      url = req.url;
    }
    const apiComponents = url.substring(url.lastIndexOf('api/v1/') + 7).split('/');
    const endpoint = apiComponents[0];
    let objectId = null;
    const userName = localStorage.getItem('user_name');
    const userId = localStorage.getItem('user_id');

    switch (true) {

      case (endpoint === 'instances' && apiComponents[1] !== undefined):
        objectId = apiComponents[1];
        break;
      case (endpoint === 'environments' && apiComponents[1] === 'environment_copy'):
        objectId = apiComponents[2];
        break;
      case (endpoint === 'environments' && apiComponents[1] !== undefined):
        objectId = apiComponents[1];
        break;
      case (endpoint === 'join_workspace' && apiComponents[1] !== undefined):
        objectId = apiComponents[1];
        break;
      case (endpoint === 'workspaces' && apiComponents[1] !== undefined):
        objectId = apiComponents[1];
        break;
      case (endpoint === 'users' && apiComponents[1] !== undefined):
        objectId = apiComponents[1];
        break;
      case (endpoint === 'messages' && apiComponents[1] !== undefined):
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
        case url.endsWith('/environments') && method === 'POST':
          return createEnvironment();
        case url.includes('/environments/environment_copy') && method === 'PUT':
          return copyEnvironment();
        case url.includes('/environments') && method === 'PUT':
          return updateEnvironment();
        case url.includes('/environments') && method === 'DELETE':
          return deleteEnvironment();
        case url.endsWith('/environments') && method === 'GET':
          return getEnvironments();
        case url.endsWith('/instances') && method === 'GET':
          return getInstances();
        case url.includes('/instances') && method === 'DELETE':
          return deleteInstance();
        case url.endsWith('/workspaces') && method === 'POST':
          return createWorkspace();
        case url.includes('/join_workspace') && method === 'PUT':
          return joinWorkspace();
        case url.includes('/workspaces') && url.includes('/exit') && method === 'PUT':
          return exitWorkspace();
        case url.includes('/workspaces') && endpoint === 'workspaces' && method === 'PUT':
          return updateOwnerWorkspaces();
        case url.includes('/workspaces') && url.endsWith('/list_users') && method === 'GET':
          return getWorkspacesMembers();
        case url.includes('/workspaces') && method === 'GET':
          return getWorkspaces();
        case url.includes('/workspaces') && method === 'DELETE':
          return deleteWorkspace();
        case url.endsWith('/messages') && method === 'GET':
          return getMessages();
        case url.includes('/messages') && method === 'PATCH':
          return patchMessage();
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
      const { ext_id, password } = body;
      const users = database.users;
      const user = users.find(x => x.ext_id === ext_id && x.password === password);
      if (!user) {
        return error('Login or password is incorrect');
      }
      return ok({
        user_id: user.id,
        token: 'fake-token',
        is_admin: user.is_admin,
        is_workspace_owner: user.is_workspace_owner,
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
      const account = database.users.find((user) => {
        return (user.id === objectId);
      });
      if (account) {
        return ok(account);
      } else {
        return error('account not found');
      }
    }

    function getUserByEppn(ext_id) {
      return database.users.find((user) => {
        if (user.ext_id === ext_id) {
          return user;
        }
      });
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
      const transitiveStates = ['queueing', 'provisioning', 'starting', 'deleting'];

      const result = [];
      const accessibleEnvIds = getAccessibleEnvironments(userName).map(e => e.id);
      const accessibleInstances = getAccessibleInstances(userName);

      for (const instance of accessibleInstances) {
        // filter out instances from environments user does not have access to
        if (accessibleEnvIds.indexOf(instance.environment_id) < 0) {
          continue;
        }
        // filter out instances for other users, unless the user is an admin or can manage the workspace

        // filter out deleted instances
        if (instance.state === 'deleted') {
          continue;
        }
        // assign an endpoint to instance that is starting
        if (instance.state === 'starting') {
          instance.instance_data = { endpoints: [{ access: 'assets/images/jupyter_example_content.png' }] };
        }

        // assign a helper attribute for delaying state transitions
        if (!instance._mockLastStateUpdateTs) {
          instance._mockLastStateUpdateTs = Date.now();
        }
        // advance the transitive states
        if (transitiveStates.indexOf(instance.state) >= 0) {
          // to mimic random failures, tune the probability below
          if (Math.random() < 0.0) {
            instance.state = InstanceStates.Failed;
            console.log('instance ' + instance.name + 'now in state ' + instance.state);
            instance._mockLastStateUpdateTs = Date.now();
            instance.is_failed = true;
          }
          else if (Date.now() - instance._mockLastStateUpdateTs > 5000) {
            instance.state = states[states.indexOf(instance.state) + 1];
            console.log('instance ' + instance.name + 'now in state ' + instance.state);
            instance._mockLastStateUpdateTs = Date.now();
          }
        }
        result.push(instance);
      }
      return ok(result);
    }

    function getEnvironments() {
      const workspaces = database.workspaces;

      const workspaceIds = getAccessibleWorkspaces(localStorage.getItem('user_name')).map(ws => ws.id);
      // Environments from System.default are accessible always
      if (workspaceIds.indexOf('ws-0') < 0) {
        workspaceIds.push('ws-0');
      }
      console.log('mock.getEnvironments() workspaceIds', workspaceIds);
      let environments = database.environments.filter((env) => {
        return workspaceIds.includes(env.workspace_id);
      });
      // here we mimic the behavior of backend which populates the environment object from config
      environments = environments.map(e => {
        e.workspace_name = workspaces.find(w => e.workspace_id === w.id).name;
        return e;
      });
      return ok(environments);
    }

    function createEnvironment() {
      const envId = Math.random().toString(36).substring(2, 8);

      const environment = new Environment(
        envId,
        body.name,
        body.description,
        '1h',
        body.workspace_id,
        body.labels,
        'jupyter',
        body.is_enabled,
        body.template_id,
        body.template_name
      );

      database.environments.push(environment);
      return ok(environment);
    }

    function copyEnvironment() {
      const env = database.environments.find(i => i.id === objectId);
      const envId = Math.random().toString(36).substring(2, 8);
      const environment = new Environment(
        envId,
        `${env.name} - Copy`,
        env.description,
        '1h',
        env.workspace_id,
        env.labels,
        env.thumbnail,
        env.is_enabled
      );

      database.environments.push(environment);
      return ok();
    }

    function updateEnvironment() {
      const env = database.environments.find(i => i.id === objectId);
      env.name = body.name;
      env.description = body.description;
      env.config = body.config;
      env.is_enabled = body.is_enabled;
      return ok();
    }

    function deleteEnvironment() {
      const env = database.environments.find(i => i.id === objectId);
      database.environments = database.environments.filter(i => i.id !== objectId);
      return ok(env);
    }

    function createInstance() {

      const { environment: envId } = body;
      const environment = database.environments.find(env => env.id === envId);

      // check if the environment exists
      if (!envId || !environment) {
        error('environment not found ' + envId);
      }
      // make sure there aren't existing instances for the environment
      if (database.instances.find(inst => inst.environment_id === envId && inst.state !== InstanceStates.Deleted)) {
        error('instance already running for environment ' + envId);
      }

      const instanceId = Math.random().toString(36).substring(2, 8);

      const instance = new Instance(
        instanceId,
        userId,
        'pb-random-' + instanceId,
        envId,
        InstanceStates.Queueing,
        '',
        environment.maximum_lifetime,
        userName,
      );

      (instance as any)._mockLastStateUpdateTs = Date.now();
      database.instances.push(instance);

      return ok(instance);
    }

    function deleteInstance() {
      const instance = database.instances.find((i) => {
        return (i.id === objectId);
      });

      if (instance) {
        instance.state = 'deleting';
        instance._mockLastStateUpdateTs = Date.now();
        return ok(instance);
      } else {
        return error('instance not found');
      }
    }

    function createWorkspace() {
      const workspaceId = Math.random().toString(36).substring(2, 8);
      const currentDate = new Date();
      const createTs = Math.floor(currentDate.getTime() / 1000);
      const expiryTs = Math.floor(currentDate.setMonth(currentDate.getMonth() + 3) / 1000);

      const workspace = new Workspace(
        workspaceId,
        body.name + '-12345',
        body.name,
        body.description,
        createTs,
        expiryTs,
        userName
      );

      database.workspaces.push(workspace);
      return ok(workspace);
    }

    function getWorkspaces() {
      const user_name = localStorage.getItem('user_name');
      return ok(getAccessibleWorkspaces(user_name));
    }

    function joinWorkspace() {
      const target_workspaces = database.workspaces.filter(ws => {
        return (ws.join_code === objectId);
      });
      if (target_workspaces.length > 0) {
        const user_name = localStorage.getItem('user_name');
        database.workspaces = database.workspaces.map(ws => {
          if (ws.join_code === objectId) {
            if (!ws.normal_users.includes(user_name)) {
              ws.normal_users.push(user_name);
            }
          }
          return ws;
        });
        return ok(target_workspaces[0]);
      } else {
        return error('workspace not found');
      }
    }

    function getWorkspacesMembers(): Observable<HttpResponse<User[]>> {
      const targetWorkspace = database.workspaces.find(ws => {
        return ws.id === objectId;
      });
      if (targetWorkspace) {
        const workspaceUserList = {
          owner: {},
          manager_users: [],
          normal_users: [],
          banned_users: []
        };

        workspaceUserList.owner = getUserByEppn(targetWorkspace.owner_ext_id);
        const workspaceUserKeys = ['manager_users', 'normal_users', 'banned_users'];
        workspaceUserKeys.forEach((key) => {
          if (targetWorkspace[key]) {
            for (const user of targetWorkspace[key]) {
              const foundUser = getUserByEppn(user);
              if (foundUser) {
                workspaceUserList[key].push(foundUser);
              }
            }
          }
        });
        return ok(workspaceUserList);
      } else {
        return error('workspace not found');
      }
    }

    function updateOwnerWorkspaces(): Observable<HttpResponse<Workspace>> {
      database.workspaces = database.workspaces.map((ws: Workspace) => {
        if (ws.id === objectId) {
          ws.name = body.name;
          ws.description = body.description;
        }
        return ws;
      });
      return ok('update succeeded');
    }

    function exitWorkspace() {
      const user_name = localStorage.getItem('user_name');
      database.workspaces = database.workspaces.map((ws) => {
        if (ws.id === objectId) {
          const index = ws.normal_users.indexOf(user_name);
          ws.normal_users.splice(index, 1);
        }
        return ws;
      });
      return ok(objectId);
    }

    function deleteWorkspace() {
      const workspace = database.workspaces.find((ws) => {
        return (ws.id === objectId);
      });

      const workspaces = database.workspaces.filter((ws) => {
        return (ws.id !== objectId);
      });
      database.workspaces = workspaces;

      if (workspace) {
        return ok(workspace);
      } else {
        return error('workspace not found');
      }
    }

    function getMessages() {
      const user = database.users.find((i) => {
        return (i.id === userId);
      });
      if (!user) {
        error(`no user ${userId} found`);
      }
      const messages = database.messages.map(m => {
        m.is_read = m.broadcasted < user.latest_seen_message_ts;
        return m;
      });
      return ok(messages);
    }

    function getFaqs() {
      return ok(database.faqs);
    }

    function patchMessage() {
      // mark as read
      const user = database.users.find((i) => {
        return (i.id === userId);
      });
      user.latest_seen_message_ts = new Date().toISOString();
      return ok();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // helper functions

    function ok(reqBody?) {
      saveDatabase();
      return of(new HttpResponse({ status: 200, body: reqBody }));
    }

    function error(message) {
      saveDatabase();
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError(new HttpErrorResponse({ status: 401, error: { message: 'Unauthorised' } }));
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

    // TODO: take arguments (show_only_mine) into account
    function getAccessibleWorkspaces(ext_id: string) {
      const user = database.users.find(u => u.ext_id === ext_id);
      if (!user) {
        return [];
      }
      const isAdmin = user.is_admin;

      return database.workspaces.filter(ws => {
        if (isAdmin) {
          return true;
        }
        if (ws.name === 'System.default') {
          return false;
        }
        if (ws.normal_users && ws.normal_users.includes(ext_id)) {
          return true;
        }
        if (ws.owner_ext_id === ext_id) {
          return true;
        }
        return false;
      });
    }

    function getAccessibleEnvironments(ext_id: string) {
      const workspaceIds = getAccessibleWorkspaces(ext_id).map(ws => ws.id);
      // Environments from System.default are accessible always
      if (workspaceIds.indexOf('ws-0') < 0) {
        workspaceIds.push('ws-0');
      }
      console.log('mock.getEnvironments() workspaceIds', workspaceIds);
      return database.environments.filter((env) => {
        return workspaceIds.includes(env.workspace_id);
      });
    }

    function getAccessibleInstances(ext_id: string) {
      const user = database.users.find(u => u.ext_id === ext_id);
      if (!user) {
        return [];
      }
      const ownedWorkspaceIds = getAccessibleWorkspaces(ext_id).filter(w => w.owner_ext_id === ext_id).map(w => w.id);
      const result = [];

      for (const instance of database.instances) {
        const instanceEnvironment = database.environments.find(e => e.id === instance.environment_id);
        // admin gets all instances
        if (user.is_admin) {
          result.push(instance);
        }
        // pick instances owned by the user
        else if (instance.user_id === user.id) {
          result.push(instance);
        }
        // pick instances for other users, if the user owns the workspace
        else if (ownedWorkspaceIds.indexOf(instanceEnvironment.workspace_id) >= 0) {
          result.push(instance);
        }
      }
      return result;
    }
  }
}
