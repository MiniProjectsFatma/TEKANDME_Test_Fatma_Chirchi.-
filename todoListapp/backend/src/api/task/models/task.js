module.exports = {
    attributes: {
      title: {
        type: 'string',
        required: true,
      },
      description: {
        type: 'text',
      },
      status: {
        type: 'enumeration',
        enum: ['pending', 'completed'],
        default: 'pending',
      },
      startDate: {
        type: 'date',
      },
      endDate: {
        type: 'date',
      },
      priority: {
        type: 'enumeration',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      isOverdue: {
        type: 'boolean',
        default: false,
      },
      user: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'plugin::users-permissions.user',
        inversedBy: 'tasks'
      }
    },
    
    // Lifecycle hooks for automatic date and status management
    lifecycles: {
      beforeCreate: async (data) => {
        // Check if end date is overdue
        if (data.endDate && new Date(data.endDate) < new Date()) {
          data.isOverdue = true;
        }
      },
      beforeUpdate: async (params, data) => {
        // Check if end date is overdue
        if (data.endDate && new Date(data.endDate) < new Date()) {
          data.isOverdue = true;
        }
      }
    }
  };