import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { EnvironmentSession, SessionStates } from 'src/app/models/environment-session';
import { User } from 'src/app/models/user';
import { Environment } from '../models/environment';
import { Workspace } from '../models/workspace';
import * as TESTDATA from './test-data';

// Mock interceptor based on fake-backend.ts from github.com/cornflourblue/angular-9-registration-login-example

const NO_AUTH_ENDPOINTS = ['sessions'];

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  public static AUTHENTICATION_ENABLED = true;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // unpack request to helper variables
    const {method, headers, body} = req;
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

      case (endpoint === 'environment_sessions' && apiComponents[1] !== undefined):
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
      case (endpoint === 'quota' && apiComponents[1] !== undefined):
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
        case url.endsWith('/environment_sessions') && method === 'POST':
          return createEnvironmentSession();
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
        case url.endsWith('/environment_sessions') && method === 'GET':
          return getEnvironmentSessions();
        case url.includes('/environment_sessions') && method === 'DELETE':
          return deleteEnvironmentSession();
        case url.endsWith('/workspaces') && method === 'POST':
          return createWorkspace();
        case url.includes('/join_workspace') && method === 'PUT':
          return joinWorkspace();
        case url.includes('/workspaces') && url.includes('/exit') && method === 'PUT':
          return exitWorkspace();
        case url.includes('/workspaces') && endpoint === 'workspaces' && method === 'PUT':
          return updateOwnerWorkspaces();
        case url.includes('/workspaces') && args === 'members_count=true' && method === 'GET':
          return getWorkspacesMemberCount();
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
        case url.includes('/users') && objectId && method === 'GET':
          return getUserById();
        case url.includes('/users') && method === 'GET':
          return getAllUsers();
        case url.includes('/users') && objectId && method === 'PATCH':
          // if (typeof body.is_blocked !== 'undefined') {
          if ('is_blocked' in body === true ) {
            return toggleBlockUser();
          }
          // if (typeof body.workspace_quota !== 'undefined') {
          if ('workspace_quota' in body === true ) {
            return updateWorkspaceQuotas();
          }
          break;
        case url.includes('/users') && objectId && method === 'DELETE':
          return removeUser();
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
      const {ext_id, password} = body;
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

    function removeUser() {
      database.users.map(user => {
        if ( user.id === objectId ){
          user.is_deleted = true;
        }
        return user;
      });
      return ok();
    }

    function toggleBlockUser() {
      // let updatedUser: User;
      // database.users.map(user => {
      //   if ( user.id === objectId ){
      //     user.is_blocked = !user.is_blocked;
      //     updatedUser = user;
      //   }
      //   return user;
      // });
      const user = database.users.find(i => i.id === objectId);
      user.is_blocked = !user.is_blocked;
      return ok(user);
    }

    function updateWorkspaceQuotas() {
      // console.log(body);
      // const value = getQueryValue(args, 'value');
      const user = database.users.find(i => i.id === objectId);
      user.workspace_quota = Number(body.workspace_quota);
      return ok(user);
    }

    function genPastTs(days: number): number {
      const today = new Date();
      console.log(today.getTime());
      const diff = Math.floor(Math.random() * ( today.getUTCHours() * 60 * 60 ));
      console.log(diff);
      return Math.floor((today.getTime() / 1000 + days * ( 24 * 60 * 60 ) - diff));
    }

    function getAllUsers() {
      if (database.users.length > 0) {
        const users = database.users.map( user => {
          switch (user.joining_ts) {
            case 'today':
              user.joining_ts = genPastTs(0);
              break;
            case 'yesterday':
              user.joining_ts = genPastTs(-1);
              break;
          }
          switch (user.expiry_ts) {
            case 'today':
              user.expiry_ts = genPastTs(0);
              break;
            case 'yesterday':
              user.expiry_ts = genPastTs(-1);
              break;
          }
          switch (user.last_login_ts) {
            case 'today':
              user.last_login_ts = genPastTs(0);
              break;
            case 'yesterday':
              user.last_login_ts = genPastTs(-1);
              break;
          }
          return user;
        });

        return ok(users);
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

    // mimic environment_session lifetime behavior
    function getEnvironmentSessions() {

      // environment_session states from API
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
      const accessibleSessions = getAccessibleSessions(userName);

      for (const session of accessibleSessions) {
        // filter out environment_sessions from environments user does not have access to
        if (accessibleEnvIds.indexOf(session.environment_id) < 0) {
          continue;
        }
        // filter out sessions for other users, unless the user is an admin or can manage the workspace

        // filter out deleted sessions
        if (session.state === 'deleted') {
          continue;
        }
        // assign an endpoint to session that is starting
        if (session.state === 'starting') {
          session.session_data = {endpoints: [{access: 'assets/images/jupyter_example_content.png'}]};
        }

        // assign a helper attribute for delaying state transitions
        if (!session._mockLastStateUpdateTs) {
          session._mockLastStateUpdateTs = Date.now();
        }
        // advance the transitive states
        if (transitiveStates.indexOf(session.state) >= 0) {
          // to mimic random failures, tune the probability below
          if (Math.random() < 0.0) {
            session.state = SessionStates.Failed;
            console.log('session ' + session.name + 'now in state ' + session.state);
            session._mockLastStateUpdateTs = Date.now();
            session.is_failed = true;
          } else if (Date.now() - session._mockLastStateUpdateTs > 5000) {
            session.state = states[states.indexOf(session.state) + 1];
            console.log('session ' + session.name + 'now in state ' + session.state);
            session._mockLastStateUpdateTs = Date.now();
          }
        }
        result.push(session);
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

    function createEnvironmentSession() {

      const {environment: envId} = body;
      const environment = database.environments.find(env => env.id === envId);

      // check if the environment exists
      if (!envId || !environment) {
        error('environment not found ' + envId);
      }
      // make sure there aren't existing sessions for the environment
      if (database.environment_sessions.find(es => es.environment_id === envId && es.state !== SessionStates.Deleted)) {
        error('session already running for environment ' + envId);
      }

      const sessionId = Math.random().toString(36).substring(2, 8);

      const session = new EnvironmentSession(
        sessionId,
        userId,
        'pb-random-' + sessionId,
        envId,
        SessionStates.Queueing,
        '',
        environment.maximum_lifetime,
        userName,
      );

      (session as any)._mockLastStateUpdateTs = Date.now();
      database.environment_sessions.push(session);

      return ok(session);
    }

    function deleteEnvironmentSession() {
      const session = database.environment_sessions.find((i) => {
        return (i.id === objectId);
      });

      if (session) {
        session.state = 'deleting';
        session._mockLastStateUpdateTs = Date.now();
        return ok(session);
      } else {
        return error('session not found');
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

    function getTargetWorkspace(workspaceId): Workspace {
      return database.workspaces.find(ws => {
        return ws.id === workspaceId;
      });
    }

    function getWorkspaceMember(workspace): any {
      const workspaceUserList = {
        owner: {},
        manager_users: [],
        normal_users: [],
        banned_users: []
      };
      workspaceUserList.owner = getUserByEppn(workspace.owner_ext_id);
      const workspaceUserKeys = ['manager_users', 'normal_users', 'banned_users'];
      workspaceUserKeys.forEach((key) => {
        if (workspace[key]) {
          for (const user of workspace[key]) {
            const foundUser = getUserByEppn(user);
            if (foundUser) {
              workspaceUserList[key].push(foundUser);
            }
          }
        }
      });
      return workspaceUserList;
    }

    // ---- Keep it for test
    function testMemberRefresh(): void {
      const memberId = Math.random().toString(36).substring(2, 5);
      const user = new User(
        memberId,
        `member-${memberId}@example.org`,
        `member-${memberId}@example.org`,
      );
      database.workspaces.map(ws => {
        if (ws.id === 'ws-0') {
          ws.normal_users.push(`member-${memberId}@example.org`);
        }
        return ws;
      });
      database.users.push(user);
    }

    function getWorkspacesMembers(): Observable<HttpResponse<User[]>> {
      const targetWorkspace = getTargetWorkspace(objectId);
      // ---- MEMO
      // ---- Comment out when you want to test the member's reload button
      // testMemberRefresh();
      if (targetWorkspace) {
        return ok(getWorkspaceMember(targetWorkspace));
      } else {
        return error('workspace not found');
      }
    }

    function getWorkspacesMemberCount(): Observable<HttpResponse<number>> {
      const targetWorkspace = getTargetWorkspace(objectId);
      if (targetWorkspace) {
        const workspaceUserList = getWorkspaceMember(targetWorkspace);
        const memberCount = workspaceUserList.manager_users.length
          + workspaceUserList.normal_users.length
          + workspaceUserList.banned_users.length;
        return ok(memberCount);
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

      database.workspaces = database.workspaces.filter((ws) => {
        return (ws.id !== objectId);
      });

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
        return ws.owner_ext_id === ext_id;
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

    function getAccessibleSessions(ext_id: string) {
      const user = database.users.find(u => u.ext_id === ext_id);
      if (!user) {
        return [];
      }
      const ownedWorkspaceIds = getAccessibleWorkspaces(ext_id).filter(w => w.owner_ext_id === ext_id).map(w => w.id);
      const result = [];

      for (const session of database.environment_sessions) {
        const sessionEnvironment = database.environments.find(e => e.id === session.environment_id);
        // admin gets all sessions
        if (user.is_admin) {
          result.push(session);
        }
        // pick sessions owned by the user
        else if (session.user_id === user.id) {
          result.push(session);
        }
        // pick sessions for other users, if the user owns the workspace
        else if (ownedWorkspaceIds.indexOf(sessionEnvironment.workspace_id) >= 0) {
          result.push(session);
        }
      }
      return result;
    }

    function getQueryValue(queryString: string, value: string) {
      const returns = {};
      const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
      pairs.forEach(pair => {
        const data = pair.split('=');
        returns[decodeURIComponent(data[0])] = decodeURIComponent(data[1] || '');
      });
      return returns[value];
    }
  }
}
