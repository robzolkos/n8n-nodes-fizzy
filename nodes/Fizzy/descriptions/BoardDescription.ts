import type { INodeProperties } from 'n8n-workflow';

export const boardOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['board'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new board',
        action: 'Create a board',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a board',
        action: 'Delete a board',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a board by ID',
        action: 'Get a board',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many boards',
        action: 'Get many boards',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a board',
        action: 'Update a board',
      },
    ],
    default: 'getMany',
  },
];

export const boardFields: INodeProperties[] = [
  // ----------------------------------
  //         board: create
  // ----------------------------------
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['board'],
        operation: ['create'],
      },
    },
    description: 'The title of the board',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['board'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The description of the board',
      },
    ],
  },

  // ----------------------------------
  //         board: get
  // ----------------------------------
  {
    displayName: 'Board',
    name: 'boardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['board'],
        operation: ['get', 'update', 'delete'],
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
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[a-z0-9]+$',
              errorMessage: 'Board ID must be alphanumeric',
            },
          },
        ],
      },
      {
        displayName: 'By URL',
        name: 'url',
        type: 'string',
        placeholder: 'https://app.fizzy.do/account/boards/03f25q9q7bw7t3206v9ttiy53',
        extractValue: {
          type: 'regex',
          regex: 'https:\\/\\/[^\\/]+\\/[^\\/]+\\/boards\\/([a-z0-9]+)',
        },
        validation: [
          {
            type: 'regex',
            properties: {
              regex: 'https:\\/\\/[^\\/]+\\/[^\\/]+\\/boards\\/[a-z0-9]+',
              errorMessage: 'Invalid Fizzy board URL',
            },
          },
        ],
      },
    ],
    description: 'The board to operate on',
  },

  // ----------------------------------
  //         board: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['board'],
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
        resource: ['board'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         board: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['board'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The new title of the board',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'The new description of the board',
      },
    ],
  },
];
