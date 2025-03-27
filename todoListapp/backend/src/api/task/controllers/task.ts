/**
 * task controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

interface TaskAttributes {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  startDate?: string;
  endDate?: string;
  priority: 'low' | 'medium' | 'high';
  isOverdue: boolean;
  owner: {
    data: {
      id: number;
      attributes: {
        username: string;
        email: string;
      };
    };
  };
}

interface TaskEntity {
  id: number;
  owner?: {
    data?: {
      id: number;
    };
  };
}

interface StrapiQuery {
  filters?: Record<string, any>;
  populate?: string | string[] | Record<string, any>;
  sort?: string | string[];
  fields?: string[];
  page?: number;
  pageSize?: number;
}

interface StrapiContext extends Omit<Context, 'query'> {
  state: {
    user: {
      id: number;
    };
  };
  query: StrapiQuery;
}

export default factories.createCoreController('api::task.task', ({ strapi }) => ({
  async create(ctx: StrapiContext) {
    try {
      // Get the user ID from the authenticated user
      const userId = ctx.state.user.id;

      // Add the owner to the task data
      ctx.request.body.data = {
        ...ctx.request.body.data,
        owner: userId
      };

      // Call the default create controller
      const { data } = await super.create(ctx);
      return { data };
    } catch (err) {
      console.error('Error creating task:', err);
      ctx.throw(400, err);
    }
  },

  async find(ctx: StrapiContext) {
    try {
      // Get the user ID from the authenticated user
      const userId = ctx.state.user.id;
      console.log('User ID:', userId);
      console.log('Original query:', ctx.query);

      // Add owner filter to the query
      const query: StrapiQuery = {
        ...ctx.query,
        filters: {
          owner: {
            id: {
              $eq: userId
            }
          }
        },
        populate: '*'
      };

      console.log('Modified query:', query);
      ctx.query = query;

      // Call the default find controller
      const { data, meta } = await super.find(ctx);
      return { data, meta };
    } catch (err) {
      console.error('Error in task find:', err);
      ctx.throw(400, 'Failed to fetch tasks');
    }
  },

  async findOne(ctx: StrapiContext) {
    try {
      // Get the user ID from the authenticated user
      const userId = ctx.state.user.id;

      // Find the task
      const entry = await strapi.db.query('api::task.task').findOne({
        where: {
          id: ctx.params.id,
          owner: {
            id: userId,
          },
        },
        populate: true,
      });

      // Check if task exists
      if (!entry) {
        return ctx.notFound();
      }

      return { data: entry };
    } catch (err) {
      ctx.throw(400, err);
    }
  },

  async update(ctx: StrapiContext) {
    try {
      // Get the user ID from the authenticated user
      const userId = ctx.state.user.id;

      // Find the task
      const entry = await strapi.db.query('api::task.task').findOne({
        where: {
          id: ctx.params.id,
          owner: {
            id: userId,
          },
        },
      });

      // Check if task exists
      if (!entry) {
        return ctx.notFound();
      }

      // Update the task
      const response = await super.update(ctx);
      return response;
    } catch (err) {
      ctx.throw(400, err);
    }
  },

  async delete(ctx: StrapiContext) {
    try {
      // Get the user ID from the authenticated user
      const userId = ctx.state.user.id;

      // Find the task
      const entry = await strapi.db.query('api::task.task').findOne({
        where: {
          id: ctx.params.id,
          owner: {
            id: userId,
          },
        },
      });

      // Check if task exists
      if (!entry) {
        return ctx.notFound();
      }

      // Delete the task
      const response = await super.delete(ctx);
      return response;
    } catch (err) {
      ctx.throw(400, err);
    }
  },
}));
