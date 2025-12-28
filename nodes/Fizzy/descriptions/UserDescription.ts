import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Deactivate',
        value: 'deactivate',
        description: 'Deactivate a user',
        action: 'Deactivate a user',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a user by ID',
        action: 'Get a user',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get all users for an account',
        action: 'Get many users',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a user',
        action: 'Update a user',
      },
    ],
    default: 'getMany',
  },
];

export const userFields: INodeProperties[] = [
  // ----------------------------------
  //         user: get, update, deactivate
  // ----------------------------------
  {
    displayName: 'User Name or ID',
    name: 'userId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getUsers',
      loadOptionsDependsOn: ['accountSlug'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'update', 'deactivate'],
      },
    },
    description: 'The user to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
  },

  // ----------------------------------
  //         user: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['user'],
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
        resource: ['user'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         user: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The new name of the user',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'The new email of the user',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Member', value: 'member' },
        ],
        default: 'member',
        description: 'The new role of the user',
      },
    ],
  },
];
