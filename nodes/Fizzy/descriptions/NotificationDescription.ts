import type { INodeProperties } from 'n8n-workflow';

export const notificationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['notification'],
      },
    },
    options: [
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get notifications',
        action: 'Get many notifications',
      },
      {
        name: 'Mark All as Read',
        value: 'markAllAsRead',
        description: 'Mark all notifications as read',
        action: 'Mark all notifications as read',
      },
      {
        name: 'Mark as Read',
        value: 'markAsRead',
        description: 'Mark a notification as read',
        action: 'Mark a notification as read',
      },
      {
        name: 'Mark as Unread',
        value: 'markAsUnread',
        description: 'Mark a notification as unread',
        action: 'Mark a notification as unread',
      },
    ],
    default: 'getMany',
  },
];

export const notificationFields: INodeProperties[] = [
  // ----------------------------------
  //         notification: markAsRead, markAsUnread
  // ----------------------------------
  {
    displayName: 'Notification ID',
    name: 'notificationId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['markAsRead', 'markAsUnread'],
      },
    },
    description: 'The ID of the notification',
  },

  // ----------------------------------
  //         notification: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['getMany'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
    },
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['notification'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Read Status',
        name: 'read',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Read', value: 'true' },
          { name: 'Unread', value: 'false' },
        ],
        default: 'all',
        description: 'Filter by read status',
      },
    ],
  },
];
