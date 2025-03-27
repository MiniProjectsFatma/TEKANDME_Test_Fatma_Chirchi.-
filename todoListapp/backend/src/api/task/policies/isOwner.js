'use strict';

/**
 * `isOwner` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;
  
  // No user, no access
  if (!user) {
    return false;
  }

  // For create action, just check if user is authenticated
  if (policyContext.request.method === 'POST') {
    return true;
  }

  // For find action, let the controller handle filtering
  if (policyContext.request.method === 'GET' && !policyContext.params.id) {
    return true;
  }

  // For other actions, check if user is the owner
  const { id } = policyContext.params;
  const task = await strapi.entityService.findOne('api::task.task', id, {
    populate: ['owner']
  });

  if (!task) {
    return false;
  }

  return task.owner.id === user.id;
};
