// Initial state of the mock database
export let db = {
  instances: [
    {
      id: '1',
      name: 'pb-alexandria-the-great',
      environment_id: '1',
      state: 'running',
      instance_data: {endpoints: [{access: 'http://foo/1'}]},
      lifetime_left: '3000',
      maximum_lifetime:	'3600',
      user_id: '1',
      username: 'admin@example.org',
    },
    {
      id: '2',
      name: 'pb-kassandra-the-white',
      environment_id: '2',
      state: 'deleted',
      instance_data: {endpoints: [{access: 'http://foo/2'}]},
      lifetime_left: '600',
      maximum_lifetime:	'2000',
      user_id: '1',
      username: 'admin@example.org',
    },
    {
      id: '3',
      name: 'pb-kassandra-the-patient',
      environment_id: '12',
      state: 'running',
      instance_data: {endpoints: [{access: 'http://foo/3'}]},
      lifetime_left: '600',
      maximum_lifetime:	'2000',
      user_id: '101',
      username: 'owner-1@example.org',
    },
    {
      id: '4',
      name: 'pb-rick-the-shiny',
      environment_id: '1',
      state: 'provisioning',
      instance_data: {endpoints: [{access: 'http://foo/4'}]},
      lifetime_left: '6000',
      maximum_lifetime:	'6000',
      user_id: '201',
      username: 'owner-1@example.org',
    },
    {
      id: '5',
      name: 'pb-bart-the-yellow',
      environment_id: '1',
      state: 'failed',
      instance_data: {endpoints: [{access: 'http://foo/5'}]},
      lifetime_left: '2000',
      maximum_lifetime:	'2000',
      user_id: '301',
      username: 'user-1@example.org',
    },
    {
      id: '6',
      name: 'pb-maggie-the-wise',
      environment_id: '12',
      state: 'running',
      instance_data: {endpoints: [{access: 'http://foo/6'}]},
      lifetime_left: '2000',
      maximum_lifetime:	'2000',
      user_id: '301',
      username: 'user-1@example.org',
    }
  ],
  environments: [
    {
      id: '1',
      name: 'Course Introduction to Python (self-study)',
      description: 'Course environment with Jupyter and Python. To be used on <a href=\'https://github.com/csc-training/python-introduction\'>CSC Introduction to Python</a> for self study.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximum_lifetime: '18000',
      workspace_id: 'ws-0',
      thumbnail: 'jupyter',
      labels: ['csc', 'python', 'basic', 'self-study', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: true,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '2',
      name: 'Course Introduction to R (self-study)',
      description: 'Course environment with Jupyter and R. To be used on <a href=\'https://github.com/csc-training/R-for-beginners\'>R for beginners</a> for self study.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximum_lifetime: '36000',
      workspace_id: 'ws-0',
      thumbnail: 'r-studio',
      labels: ['csc', 'R-studio', 'basic', 'self-study'],
      config: {
        jupyter_interface: 'lab',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: false,
      template_id: 'et-3',
      template_name: 'RStudio Template 1'
    },
    {
      id: '3',
      name: 'Course Practical Deep Learning - 2020',
      description: 'Environment with Jupyter and Python Machine Learning libraries for Practical Deep Learning.\n\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximum_lifetime: '36000',
      workspace_id: 'ws-0',
      thumbnail: 'deep-learning',
      labels: ['csc', 'python', 'deep learning', 'machine learning', '2020', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: true,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '4',
      name: 'Course Practical Machine Learning 2019 with Jupyter Lab',
      description: 'Course environment with Jupyter and Python Machine Learning libraries. The environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximum_lifetime: '36000',
      workspace_id: 'ws-0',
      thumbnail: 'machine-learning',
      labels: ['course-ml', 'python', 'machine learning', '2019', 'jupyter'],
      config: {
        jupyter_interface: 'lab',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: false,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '5',
      name: 'Demo Vipunen API',
      description: 'Demo environment with Jupyter. Demonstrates the use of Vipunen API with Python and Pandas.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      maximum_lifetime: '18000',
      workspace_id: '3',
      thumbnail: 'jupyter',
      labels: ['csc', 'api', 'python', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: true,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '6',
      name: 'Jupyter Data Science',
      maximum_lifetime: '18000',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '4',
      thumbnail: 'data-science',
      labels: ['csc', 'data-science', 'python', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: false,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '7',
      name: 'Jupyter Machine Learning',
      maximum_lifetime: '3600',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '5',
      thumbnail: 'machine-learning',
      labels: ['course-ml', 'data-science', 'python', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: true,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '8',
      name: 'Jupyter PySpark',
      maximum_lifetime: '7200',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '6',
      thumbnail: 'jupyter',
      labels: ['csc', 'data-science', 'python', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: false,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '9',
      name: 'RStudio Server',
      maximum_lifetime: '54000',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '2',
      thumbnail: 'r-studio',
      labels: ['csc', 'data-science', 'rstudio'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: true,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '10',
      name: 'Data Science 1',
      maximum_lifetime: '3600',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '3',
      thumbnail: 'ipython',
      labels: ['course-ds', 'data-science', 'python', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: false,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '11',
      name: 'Data Science 2',
      maximum_lifetime: '10800',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '3',
      thumbnail: 'ipython',
      labels: ['course-ds', 'data-science', 'python', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: true,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '12',
      name: 'Data Science 3',
      maximum_lifetime: '14400',
      description: 'General-purpose environment with Jupyter and data science packages.\n\nThe environment is short-lived and all data is destroyed at the end of the session. Download your results!',
      workspace_id: '6',
      thumbnail: 'ipython',
      labels: ['course-ds', 'data-science', 'python', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: false,
      template_id: 'et-2',
      template_name: 'Jupyter Template 2'
    },
    {
      id: '13',
      name: 'Notebooks Basic Tutorial 2021',
      maximum_lifetime: '14400',
      description: 'Very basic environment for testing basic label',
      workspace_id: '3',
      thumbnail: 'jupyter',
      labels: ['basic', 'jupyter'],
      config: {
        jupyter_interface: 'notebook',
        download_method: 'http-get',
        download_url: 'https://raw.githubusercontent.com/csc-training/intro-to-ml/master/.notebooks-setup/get-started.bash',
        auto_execution: false,
      },
      is_enabled: true,
      template_id: 'et-1',
      template_name: 'Jupyter Template 1'
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
      eppn: 'owner-2@example.org',
      password: 'owner-2',
      id: '102',
      is_admin: false,
      is_workspace_owner: true,
      is_workspace_manager: false,
    },
    {
      eppn: 'co-owner@example.org',
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
    },
    {
      eppn: 'user-5@example.org',
      password: 'user-5',
      id: '401',
      is_admin: false,
      is_workspace_owner: false,
      is_workspace_manager: false,
    }
  ],
  workspaces: [
    {
      id: 'ws-0',
      name: 'System.default',
      join_code: 'admin-ws-join-parm0-wuuig',
      description: 'System default workspace',
      create_ts: 1616572104,
      expiry_ts: 1632124104,
      owner_eppn: 'admin@example.org',
      manager_users: [
        'admin@example.org'
      ],
      normal_users: [
        'admin@example.org',
        'admin-1@example.org',
        'admin-2@example.org',
        'owner@example.org',
        'owner-1@example.org',
        'owner-2@example.org',
        'co-owner@example.org',
        'co-owner-1@example.org',
        'user@example.org',
        'user-1@example.org',
        'user-2@example.org',
        'user-3@example.org',
        'user-4@example.org',
      ],
    },
    {
      id: '0',
      name: 'Python Basic Course 2021',
      join_code: 'admin-ws-join-parm0-wuuig',
      description: 'Jupyter Lab environments for Python Basic Course 2021',
      create_ts: 1616572105,
      expiry_ts: 1732124105,
      owner_eppn: 'admin@example.org',
      manager_users: [
        'admin@example.org'
      ],
      normal_users: [
        'manager-1@example.org',
        'user@example.org',
        'user-2@example.org',
        'user-1@example.org'
      ],
    },
    {
      id: '1',
      name: 'R Basic Course 2021',
      join_code: 'admin-ws-join-parm1-wuuig',
      description: 'R-studio environments for R basic Course 2021',
      create_ts: 1616572106,
      expiry_ts: 1832124106,
      owner_eppn: 'admin@example.org',
      manager_users: [
        'admin@example.org'
      ],
      normal_users: ['co-owner@example.org', 'user@example.org', 'user-1@example.org', 'user-2@example.org'],
      banned_users: ['user-5@example.org']
    },
    {
      id: '2',
      name: 'Deep Learning Course 2020',
      join_code: 'admin-ws-join-parm2-wuuig',
      description: 'Jupyter Lab environments for Deep Learning Course 2020',
      create_ts: 1616572107,
      expiry_ts: 1932124107,
      owner_eppn: 'admin-1@example.org',
      manager_users: [
        'admin@example.org',
        'admin-1@example.org'
      ],
      normal_users: ['manager-1@example.org', 'admin@example.org', 'user@example.org', 'user-2@example.org', 'user-3@example.org']
    },
    {
      id: '3',
      name: 'Machine Learning Course 2019',
      join_code: 'admin-ws-join-parm3-wuuig',
      description: 'R-studio environments for Machine Learning Course 2019',
      create_ts: 1616572108,
      expiry_ts: 2032124108,
      owner_eppn: 'admin-1@example.org',
      manager_users: [
        'admin@example.org',
        'admin-1@example.org'
      ],
      normal_users: ['user@example.org', 'user-2@example.org', 'user-1@example.org']
    },
    {
      id: '4',
      name: 'Data Science course 2021',
      join_code: 'admin-ws-join-parm4-wuuig',
      description: 'R-studio environments for Data Science course 2021',
      create_ts: 1616572109,
      expiry_ts: 2132124109,
      owner_eppn: 'admin@example.org',
      manager_users: [
        'admin@example.org'
      ],
      normal_users: ['owner@example.org', 'user@example.org', 'user-2@example.org', 'user-1@example.org'],
      banned_users: ['user-5@example.org']
    },
    {
      id: '5',
      name: 'Data Analytics Seminar',
      join_code: 'admin-ws-join-parm5-wuuig',
      description: 'R-studio environments for Data Analytics Seminar, CSC university',
      create_ts: 1616572114,
      expiry_ts: 2232124114,
      owner_eppn: 'owner@example.org',
      manager_users: [
        'admin@example.org',
        'owner@example.org',
      ],
      normal_users: ['user@example.org', 'user-2@example.org', 'user-1@example.org'],
      banned_users: ['user-5@example.org']
    },
    {
      id: '6',
      name: 'NLP Project',
      join_code: 'admin-ws-join-parm6-wuuig',
      description: 'IPython environments for NLP Project of Computer Engineering Department, CSC university',
      create_ts: 1616572115,
      expiry_ts: 2332124115,
      owner_eppn: 'owner-1@example.org',
      manager_users: [
        'admin@example.org',
        'owner-1@example.org'
      ],
      normal_users: ['user@example.org', 'user-2@example.org', 'user-1@example.org'],
      banned_users: ['user-5@example.org']
    }
  ],
  environment_templates: [
    {
      id: 'et-1',
      name: 'Jupyter Template 1',
      description: 'Example template for Jupyter',
      environment_type: 'jupyter',
      is_active: true,
      cluster: 'dummy cluster 1',
      base_config: {
        maximum_lifetime: '7200'
      },
    },
    {
      id: 'et-2',
      name: 'Jupyter Template 2',
      description: 'Another example template for Jupyter',
      environment_type: 'jupyter',
      is_active: true,
      cluster: 'dummy cluster 1',
      base_config: {
        maximum_lifetime: '7200'
      },
    },
    {
      id: 'et-3',
      name: 'RStudio Template 1',
      description: 'Example template for RStudio',
      environment_type: 'rstudio',
      is_active: true,
      cluster: 'dummy cluster 2',
      base_config: {
        maximum_lifetime: '7200'
      },
    },
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
