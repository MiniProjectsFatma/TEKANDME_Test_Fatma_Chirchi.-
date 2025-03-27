export default async (ctx, config, { strapi }) => {
  const user = ctx.state.user;
  if (!user) {
    return false;
  }

  // For create action, just check if user is authenticated
  if (ctx.request.method === 'POST') {
    return true;
  }

  // For other actions, check if user is the owner
  const { id } = ctx.params;
  const task = await strapi.entityService.findOne('api::task.task', id, {
    populate: ['owner']
  });

  if (!task) {
    return false;
  }

  return task.owner?.id === user.id;
};
