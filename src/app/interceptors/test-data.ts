// Initial state of the mock database
export let db = {
  instances: [
    {
      id: '11111',
      name: 'pb-alexandria-the-great',
      environment_id: '1',
      state: 'running',
      instance_data: {endpoints: [{access: 'http://foo/1'}]}
    },
    {
      id: '22222',
      name: 'pb-kassandra-the-white',
      environment_id: '2',
      state: 'deleted',
      instance_data: {endpoints: [{access: 'http://foo/2'}]}
    },
  ],
  environments: [
    {
      id: '1',
      name: 'Course Introduction to Python (self-study)',
      description: 'Course environment with Jupyter and Python. To be used on <a href=\'https://github.com/csc-training/python-introduction\'>CSC Introduction to Python</a> for self study.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximumLifetime: '5h',
      workspace_id: '0',
      thumbnail: 'python',
      color: '0',
      labels: ['csc', 'python', 'basic', 'self-study'],
    },
    {
      id: '2',
      name: 'Course Introduction to R (self-study)',
      description: 'Course environment with Jupyter and R. To be used on <a href=\'https://github.com/csc-training/R-for-beginners\'>R for beginners</a> for self study.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximumLifetime: '10h',
      workspace_id: '0',
      thumbnail: 'r-studio',
      color: '1',
      labels: ['csc', 'R-studio', 'basic', 'self-study'],
    },
    {
      id: '3',
      name: 'Course Practical Deep Learning - 2020',
      description: 'Environment with Jupyter and Python Machine Learning libraries for Practical Deep Learning.\n\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximumLifetime: '10h 0m',
      workspace_id: '1',
      thumbnail: 'python',
      color: '2',
      labels: ['csc', 'python', 'deep learning', 'machine learning', '2020'],
    },
    {
      id: '4',
      name: 'Course Practical Machine Learning 2019',
      description: 'Course environment with Jupyter and Python Machine Learning libraries. The environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximumLifetime: '10h 0m',
      workspace_id: '2',
      thumbnail: 'python',
      color: '3',
      labels: ['course-ml', 'python', 'machine learning', '2019'],
    },
    {
      id: '5',
      name: 'Demo Vipunen API',
      description: 'Demo environment with Jupyter. Demonstrates the use of Vipunen API with Python and Pandas.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximumLifetime: '5h',
      workspace_id: '3',
      thumbnail: '',
      color: '4',
      labels: ['csc', 'api', 'python'],
    },
    {
      id: '6',
      name: 'Jupyter Data Science',
      maximumLifetime: '5h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '4',
      thumbnail: '',
      color: '5',
      labels: ['csc', 'data-science', 'python'],
    },
    {
      id: '7',
      name: 'Jupyter Machine Learning',
      maximumLifetime: '10h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '5',
      thumbnail: '',
      color: '0',
      labels: ['course-ml', 'data-science', 'python'],
    },
    {
      id: '8',
      name: 'Jupyter PySpark',
      maximumLifetime: '5h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '6',
      thumbnail: '',
      color: '1',
      labels: ['csc', 'data-science', 'python'],
    },
    {
      id: '9',
      name: 'RStudio Server',
      maximumLifetime: '15h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '2',
      thumbnail: '',
      color: '2',
      labels: ['csc', 'data-science', 'r-studio'],
    },
    {
      id: '10',
      name: 'Jupyter Data Science 1',
      maximumLifetime: '1h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '3',
      thumbnail: '',
      color: '3',
      labels: ['course-ds', 'data-science', 'python'],
    },
    {
      id: '11',
      name: 'Jupyter Data Science 2',
      maximumLifetime: '3h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '3',
      thumbnail: '',
      color: '4',
      labels: ['course-ds', 'data-science', 'python'],
    },
    {
      id: '12',
      name: 'Jupyter Data Science 3',
      maximumLifetime: '4h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '3',
      thumbnail: '',
      color: '5',
      labels: ['course-ds', 'data-science', 'python'],
    },
    {
      id: '13',
      name: 'Basic',
      maximumLifetime: '4h',
      description: 'Very basic environment for testing basic label',
      workspace_id: '3',
      thumbnail: '',
      color: '5',
      labels: ['basic'],
    }
  ],
  users: [
    {
      eppn: 'admin@example.org',
      password: 'admin',
      id: '1',
      is_admin: true,
      is_workspace_owner: true,
      is_workspace_manager: true
    },
    {
      eppn: 'admin-1@example.org',
      password: 'admin-1',
      id: '001',
      is_admin: true,
      is_workspace_owner: true,
      is_workspace_manager: true
    },
    {
      eppn: 'owner@example.org',
      password: 'owner',
      id: '100',
      is_admin: false,
      is_workspace_owner: true,
      is_workspace_manager: false,
    },
    {
      eppn: 'owner-1@example.org',
      password: 'owner-1',
      id: '101',
      is_admin: false,
      is_workspace_owner: true,
      is_workspace_manager: false,
    },
    {
      eppn: 'manager@example.org',
      password: 'manager',
      id: '200',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: true,
    },
    {
      eppn: 'manager-1@example.org',
      password: 'manager-1',
      id: '201',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: true,
    },
    {
      eppn: 'user@example.org',
      password: 'user',
      id: '300',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: false,
    },
    {
      eppn: 'user-1@example.org',
      password: 'user-1',
      id: '301',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: false,
    },
    {
      eppn: 'user-2@example.org',
      password: 'user-2',
      id: '302',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: false,
    },
    {
      eppn: 'user-3@example.org',
      password: 'user-3',
      id: '303',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: false,
    },
    {
      eppn: 'user-4@example.org',
      password: 'user-4',
      id: '304',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: false,
    }
  ],
  workspaces: [
    {
      id: '0',
      name: 'admin-ws-join-parm0',
      join_code: 'admin-ws-join-parm0-wuuig',
      description: 'admin-ws-join-parm0',
      owner_eppn: 'admin@example.org',
      member_eppns: ['manager-1@example.org', 'user-2@example.org', 'user@example.org', 'user-1@example.org'],
    },
    {
      id: '1',
      name: 'admin-ws-join-parm1',
      join_code: 'admin-ws-join-parm1-wuuig',
      description: 'admin-ws-join-parm1',
      owner_eppn: 'admin@example.org',
      member_eppns: ['manager@example.org', 'user@example.org', 'user-1@example.org', 'user-2@example.org'],
    },
    {
      id: '2',
      name: 'admin-ws-join-parm2',
      join_code: 'admin-ws-join-parm2-wuuig',
      description: null,
      owner_eppn: 'admin-1@example.org',
      member_eppns: ['manager-1@example.org', 'admin@example.org', 'user@example.org', 'user-2@example.org', 'user-3@example.org']
    },
    {
      id: '3',
      name: 'admin-ws-join-parm3',
      join_code: 'admin-ws-join-parm3-wuuig',
      description: 'admin-ws-join-parm3',
      owner_eppn: 'admin-1@example.org',
      member_eppns: ['admin@example.org', 'user@example.org', 'user-2@example.org', 'user-1@example.org']
    },
    {
      id: '4',
      name: 'admin-ws-join-parm4',
      join_code: 'admin-ws-join-parm4-wuuig',
      description: 'admin-ws-join-parm4',
      owner_eppn: 'admin@example.org',
      member_eppns: ['admin-1@example.org', 'owner@example.org', 'user@example.org', 'user-2@example.org', 'user-1@example.org']
    },
    {
      id: '5',
      name: 'admin-ws-join-parm5',
      join_code: 'admin-ws-join-parm5-wuuig',
      description: null,
      owner_eppn: 'ownre@example.org',
      member_eppns: ['admin-1@example.org', 'user@example.org', 'user-2@example.org', 'user-1@example.org']
    },
    {
      id: '6',
      name: 'admin-ws-join-parm6',
      join_code: 'admin-ws-join-parm6-wuuig',
      description: 'admin-ws-join-parm6',
      owner_eppn: 'owner@example.org',
      member_eppns: ['admin-1@example.org', 'user@example.org', 'user-2@example.org', 'user-1@example.org']
    }
  ],

  environment_categories: [
    {
      name: 'Machine Learning',
      labels: ['machine learning', 'tensorflow', 'keras']
    },
    {
      name: 'Data Analytics',
      labels: ['analytics', 'statistics']
    },
    {
      name: 'Python',
      labels: ['python']
    },
    {
      name: 'RStudio',
      labels: ['r-studio']
    },
  ],
  notifications: [
    {
      id: 'n12345',
      subject: 'Environment State',
      message: 'Your test environment is ready to use.',
      broadcasted: '10.5.2020',
    },
    {
      id: 'n98765',
      subject: 'Environment State',
      message: 'Your test environment is deleted.',
      broadcasted: '10.5.2020',
    },
  ],
  messages: [
    {
      id: 'm12345',
      subject: 'Renewal Open',
      message: 'The Notebooks end-user interface has been renewed. We appreciate any type of feedback from your.',
      broadcasted: '2020-09-15T11:09:04.889550',
    },
    {
      id: 'm98765',
      subject: 'Announcement: Accessibility improvement',
      message: 'We have been improved interface accessibility. If you want to know the detail, visit accessibility policy of CSC.',
      broadcasted: '2020-09-16T11:09:04.889550',
    },
    {
      id: 'm00000',
      subject: 'This is Important Announcement: Change your password',
      message: 'For the security, Please change your account password of Notebooks.',
      broadcasted: '2020-09-17T11:09:04.889550',
      is_checked: true,
      is_important: true,
    },
    {
      id: 'm00011',
      subject: 'Announcement: Computing Resources limited',
      message: 'Your instance runs slower than usual.',
      broadcasted: '2020-09-10T11:09:04.889550',
      is_checked: false,
      is_important: false,
    },
  ],
  folders: [
    {
      id: '1',
      workspace_id: 'ed032a37692847b591080789d61c9e90',
      name: 'photo-1',
      capacity: '49',
      created_by: 'admin@example.org'
    },
    {
      id: '11',
      workspace_id: 'ed032a37692847b591080789d61c9e90',
      name: 'dataset',
      capacity: '4',
      created_by: 'admin@example.org'
    },
    {
      id: '2',
      workspace_id: 'ed032a37692847b591080789d61c9e90',
      name: 'photo-2',
      capacity: '75',
      created_by: 'admin@example.org'
    },
    {
      id: '13',
      workspace_id: 'ed032a37692847b591080789d61c9e90',
      name: 'dataset2',
      capacity: '54',
      created_by: 'admin@example.org'
    },
    {
      id: '3',
      workspace_id: '3',
      name: 'photo-3',
      capacity: '134',
      created_by: 'admin@example.org'
    },
    {
      id: '13',
      workspace_id: '0',
      name: 'dataset',
      capacity: '54',
      created_by: 'admin@example.org'
    },
    {
      id: '4',
      workspace_id: '0',
      name: 'photo-4',
      capacity: '378',
      created_by: 'admin@example.org'
    },
    {
      id: '14',
      workspace_id: '1',
      name: 'dataset',
      capacity: '43',
      created_by: 'admin@example.org'
    },
    {
      id: '5',
      workspace_id: '1',
      name: 'photo-5',
      capacity: '120',
      created_by: 'admin@example.org'
    },
    {
      id: '5',
      workspace_id: '2',
      name: 'dataset',
      capacity: '432',
      created_by: 'admin@example.org'
    },
    {
      id: '6',
      workspace_id: '2',
      name: 'photo-6',
      capacity: '240',
      created_by: 'admin@example.org'
    },
    {
      id: '16',
      workspace_id: '3',
      name: 'dataset',
      capacity: '234',
      created_by: 'admin@example.org'
    }
  ],
};
