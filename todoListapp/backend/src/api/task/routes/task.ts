/**
 * task router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::task.task', {
  config: {
    find: {
      auth: {
        scope: ['api::task.task.find']
      }
    },
    findOne: {
      auth: {
        scope: ['api::task.task.findOne']
      }
    },
    create: {
      auth: {
        scope: ['api::task.task.create']
      }
    },
    update: {
      auth: {
        scope: ['api::task.task.update']
      }
    },
    delete: {
      auth: {
        scope: ['api::task.task.delete']
      }
    },
  },
});
