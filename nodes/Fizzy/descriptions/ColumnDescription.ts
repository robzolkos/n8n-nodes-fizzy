import type { INodeProperties } from 'n8n-workflow';

export const columnOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['column'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new column',
        action: 'Create a column',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a column',
        action: 'Delete a column',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a column by ID',
        action: 'Get a column',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get all columns for a board',
        action: 'Get many columns',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a column',
        action: 'Update a column',
      },
    ],
    default: 'getMany',
  },
];

export const columnFields: INodeProperties[] = [
  // ----------------------------------
  //         column: common - board
  // ----------------------------------
  {
    displayName: 'Board',
    name: 'boardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['column'],
      },
    },
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a board...',
        typeOptions: {
          searchListMethod: 'searchBoards',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '03f25q9q7bw7t3206v9ttiy53',
      },
    ],
    description: 'The board the column belongs to',
  },

  // ----------------------------------
  //         column: get, update, delete
  // ----------------------------------
  {
    displayName: 'Column Name or ID',
    name: 'columnId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getColumns',
      loadOptionsDependsOn: ['boardId.value'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['column'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The column to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
  },

  // ----------------------------------
  //         column: create
  // ----------------------------------
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['column'],
        operation: ['create'],
      },
    },
    description: 'The title of the column',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['column'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Position',
        name: 'position',
        type: 'number',
        default: 0,
        description: 'The position of the column in the board',
      },
    ],
  },

  // ----------------------------------
  //         column: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['column'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The new title of the column',
      },
      {
        displayName: 'Position',
        name: 'position',
        type: 'number',
        default: 0,
        description: 'The new position of the column in the board',
      },
    ],
  },
];
