module.exports = {
  'api::task.task': {
    enabled: true,
    config: {
      find: {
        roles: ['authenticated'],
      },
      findOne: {
        roles: ['authenticated'],
      },
      create: {
        roles: ['authenticated'],
      },
      update: {
        roles: ['authenticated'],
      },
      delete: {
        roles: ['authenticated'],
      },
    },
  },
  'plugin::users-permissions.auth': {
    enabled: true,
    config: {
      register: {
        roles: ['public'],
      },
      login: {
        roles: ['public'],
      },
    },
  },
};
