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
      labels: ['aalto-ml', 'python', 'machine learning', '2019'],
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
      labels: ['aalto-ml', 'data-science', 'python'],
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
      labels: ['helsinki-ds', 'data-science', 'python'],
    },
    {
      id: '11',
      name: 'Jupyter Data Science 2',
      maximumLifetime: '3h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '3',
      thumbnail: '',
      color: '4',
      labels: ['helsinki-ds', 'data-science', 'python'],
    },
    {
      id: '12',
      name: 'Jupyter Data Science 3',
      maximumLifetime: '4h',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '3',
      thumbnail: '',
      color: '5',
      labels: ['helsinki-ds', 'data-science', 'python'],
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
      is_admin: 'true',
      is_workspace_owner: 'true',
      is_workspace_manager: 'true'
    },
    {
      eppn: 'user@example.org',
      password: 'user',
      id: '2',
      is_admin: 'false',
      is_workspace_owner: 'false',
      is_workspace_manager: 'false',
    },
    {
      eppn: 'owner@example.org',
      password: 'owner',
      id: '3',
      is_admin: 'false',
      is_workspace_owner: 'true',
      is_workspace_manager: 'false',
    },
    {
      eppn: 'workspace-owner-1@example.org',
      password: 'workspace-owner-1',
      id: '101'
    },
    {
      eppn: 'user-1@example.org',
      password: 'user-1',
      id: '102'
    },
    {
      eppn: 'ai.nakajima@csc.fi',
      password: 'user-3',
      id: '103'
    },
    {
      eppn: 'csc.user4@csc.fi',
      password: 'user-4',
      id: '104'
    }
  ],
  profiles: [
    {
      id: '1',
      email: 'admin@example.org',
      thumbnail: 'user-1.placeholder.png',
      name: 'Tieteen Tietotekniikan'
    },
    {
      id: '101',
      email: 'csc.user1@csc.fi',
      thumbnail: 'user-101.placeholder.png',
      name: 'Aalto University Data Analytics'
    },
    {
      id: '102',
      email: 'csc.user2@csc.fi',
      thumbnail: 'user-102.placeholder.png',
      name: 'Helsinki University Deep Learning'
    },
    {
      id: '103',
      email: 'csc.user3@csc.fi',
      thumbnail: 'user-103.placeholder.png',
      name: 'Ai Chang Nakajima'
    },
    {
      id: '104',
      email: 'csc.user4@csc.fi',
      thumbnail: 'user-104.placeholder.png',
      name: 'Ai Keskisaari Tmp'
    }
  ],
  workspaces: [
    {
      id: '0',
      name: 'admin-ws-join-parm0',
      join_code: 'admin-ws-join-parm0-wuuig',
      description: 'admin-ws-join-parm0',
      owner_eppn: 'user-0@example.org',
      member_eppns: ['admin@example.org'],
    },
    {
      id: '1',
      name: 'admin-ws-join-parm1',
      join_code: 'admin-ws-join-parm1-wuuig',
      description: 'admin-ws-join-parm1',
      owner_eppn: 'user-1@example.org',
      member_eppns: ['admin@example.org'],
    },
    {
      id: '2',
      name: 'admin-ws-join-parm2',
      join_code: 'admin-ws-join-parm2-wuuig',
      description: null,
      owner_eppn: 'user-1@example.org',
      member_eppns: []
    },
    {
      id: '3',
      name: 'admin-ws-join-parm3',
      join_code: 'admin-ws-join-parm3-wuuig',
      description: 'admin-ws-join-parm3',
      owner_eppn: 'admin3@example.org',
      member_eppns: ['admin@example.org']
    },
    {
      id: '4',
      name: 'admin-ws-join-parm4',
      join_code: 'admin-ws-join-parm4-wuuig',
      description: 'admin-ws-join-parm4',
      owner_eppn: 'csc.user4@csc.fi',
      member_eppns: []
    },
    {
      id: '5',
      name: 'admin-ws-join-parm5',
      join_code: 'admin-ws-join-parm5-wuuig',
      description: null,
      owner_eppn: 'admin5@example.org',
      member_eppns: ['admin@example.org']
    },
    {
      id: '6',
      name: 'admin-ws-join-parm6',
      join_code: 'admin-ws-join-parm6-wuuig',
      description: 'admin-ws-join-parm6',
      owner_eppn: 'admin6@example.org',
      member_eppns: ['admin@example.org']
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
};
