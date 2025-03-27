'use strict';

/**
 * task controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::task.task', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Get the user from the context
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in to create a task');
      }
      
      // Add the user to the request body
      if (!ctx.request.body.data) {
        ctx.request.body.data = {};
      }
      ctx.request.body.data.user = user.id;
      
      // Create the task
      const entity = await strapi.entityService.create('api::task.task', {
        data: ctx.request.body.data,
        populate: ['user'],
      });
      
      return this.transformResponse(entity);
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async find(ctx) {
    try {
      // Get the user from the context
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in to view tasks');
      }

      // Set up the query
      const query = {
        filters: {
          user: {
            id: {
              $eq: user.id
            }
          }
        },
        populate: ['user'],
        sort: [{ createdAt: 'desc' }]
      };

      // Find tasks
      const content = await strapi.entityService.findMany('api::task.task', query);
      
      return this.transformResponse(content);
    } catch (error) {
      console.error('Error in find:', error);
      return ctx.badRequest(error.message);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;

      // Try to find task by numeric ID first
      let task = null;
      let query = {
        populate: {
          user: {
            fields: ['id', 'username', 'email']
          }
        }
      };
      
      // Check if id is numeric
      if (!isNaN(id)) {
        task = await strapi.entityService.findOne('api::task.task', id, query);
      }
      
      // If not found by numeric ID, try to find by documentId
      if (!task) {
        const tasks = await strapi.entityService.findMany('api::task.task', {
          ...query,
          filters: {
            documentId: id,
          },
        });
        task = tasks[0];
      }
      
      if (!task) {
        return ctx.notFound('Task not found');
      }
      
      // If user is logged in, check ownership
      if (user && task.user && task.user.id !== user.id) {
        return ctx.forbidden('You do not have access to this task');
      }
      
      return this.transformResponse(task);
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized('You must be logged in to update a task');
      }

      // Try to find task by numeric ID first
      let task = null;
      let query = {
        populate: {
          user: {
            fields: ['id', 'username', 'email']
          }
        }
      };
      
      // Check if id is numeric
      if (!isNaN(id)) {
        task = await strapi.entityService.findOne('api::task.task', id, query);
      }
      
      // If not found by numeric ID, try to find by documentId
      if (!task) {
        const tasks = await strapi.entityService.findMany('api::task.task', {
          ...query,
          filters: {
            documentId: id,
          },
        });
        task = tasks[0];
        if (task) {
          ctx.params.id = task.id; // Update the id parameter for super.update
        }
      }
      
      // Check if the task exists and belongs to the user
      if (!task) {
        return ctx.notFound('Task not found');
      }
      
      if (task.user && task.user.id !== user.id) {
        return ctx.forbidden('You do not have permission to update this task');
      }
      
      // Update the task
      const updatedEntity = await strapi.entityService.update('api::task.task', task.id, {
        data: ctx.request.body.data,
        populate: ['user'],
      });
      
      return this.transformResponse(updatedEntity);
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized('You must be logged in to delete a task');
      }

      // Try to find task by numeric ID first
      let task = null;
      let query = {
        populate: {
          user: {
            fields: ['id', 'username', 'email']
          }
        }
      };
      
      // Check if id is numeric
      if (!isNaN(id)) {
        task = await strapi.entityService.findOne('api::task.task', id, query);
      }
      
      // If not found by numeric ID, try to find by documentId
      if (!task) {
        const tasks = await strapi.entityService.findMany('api::task.task', {
          ...query,
          filters: {
            documentId: id,
          },
        });
        task = tasks[0];
      }
      
      // Check if the task exists and belongs to the user
      if (!task) {
        return ctx.notFound('Task not found');
      }
      
      if (task.user && task.user.id !== user.id) {
        return ctx.forbidden('You do not have permission to delete this task');
      }
      
      // Delete the task
      const deletedEntity = await strapi.entityService.delete('api::task.task', task.id, {
        populate: ['user'],
      });
      
      return this.transformResponse(deletedEntity);
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },
}));
