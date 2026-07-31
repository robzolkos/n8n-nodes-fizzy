import type { INodeProperties } from 'n8n-workflow';

export const cardOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['card'],
      },
    },
    options: [
      {
        name: 'Close',
        value: 'close',
        description: 'Close a card (move to Done)',
        action: 'Close a card',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new card',
        action: 'Create a card',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a card',
        action: 'Delete a card',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a card by ID',
        action: 'Get a card',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many cards',
        action: 'Get many cards',
      },
      {
        name: 'Move to Column',
        value: 'moveToColumn',
        description: 'Move a card to a specific column',
        action: 'Move a card to column',
      },
      {
        name: 'Move to Not Now',
        value: 'moveToNotNow',
        description: 'Move a card to Not Now',
        action: 'Move a card to not now',
      },
      {
        name: 'Reopen',
        value: 'reopen',
        description: 'Reopen a closed card',
        action: 'Reopen a card',
      },
      {
        name: 'Send to Triage',
        value: 'sendToTriage',
        description: 'Send a card back to triage (Maybe?)',
        action: 'Send a card to triage',
      },
      {
        name: 'Toggle Assignment',
        value: 'toggleAssignment',
        description: 'Assign or unassign a user from a card',
        action: 'Toggle assignment on a card',
      },
      {
        name: 'Toggle Tag',
        value: 'toggleTag',
        description: 'Add or remove a tag from a card',
        action: 'Toggle tag on a card',
      },
      {
        name: 'Unwatch',
        value: 'unwatch',
        description: 'Stop watching a card',
        action: 'Unwatch a card',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a card',
        action: 'Update a card',
      },
      {
        name: 'Watch',
        value: 'watch',
        description: 'Start watching a card',
        action: 'Watch a card',
      },
    ],
    default: 'getMany',
  },
];

export const cardFields: INodeProperties[] = [
  // ----------------------------------
  //         card: common fields
  // ----------------------------------
  {
    displayName: 'Board',
    name: 'boardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['card'],
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
    description: 'The board the card belongs to',
  },

  // ----------------------------------
  //         card: get, update, delete, etc.
  // ----------------------------------
  {
    displayName: 'Card',
    name: 'cardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['card'],
        operation: [
          'get',
          'update',
          'delete',
          'close',
          'reopen',
          'moveToColumn',
          'moveToNotNow',
          'sendToTriage',
          'toggleAssignment',
          'toggleTag',
          'watch',
          'unwatch',
        ],
      },
    },
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a card...',
        typeOptions: {
          searchListMethod: 'searchCards',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '03f25q9q7bw7t3206v9ttiy53',
      },
      {
        displayName: 'By URL',
        name: 'url',
        type: 'string',
        placeholder: 'https://app.fizzy.do/account/boards/board-id/cards/card-id',
        extractValue: {
          type: 'regex',
          regex: 'https:\\/\\/[^\\/]+\\/[^\\/]+\\/boards\\/[^\\/]+\\/cards\\/([a-z0-9]+)',
        },
      },
    ],
    description: 'The card to operate on',
  },

  // ----------------------------------
  //         card: create
  // ----------------------------------
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['card'],
        operation: ['create'],
      },
    },
    description: 'The title of the card',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['card'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          editor: 'htmlEditor',
        },
        default: '',
        description: 'The body/description of the card (supports HTML)',
      },
      {
        displayName: 'Column Name or ID',
        name: 'column_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getColumns',
          loadOptionsDependsOn: ['boardId.value'],
        },
        default: '',
        description: 'The column to place the card in. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
    ],
  },

  // ----------------------------------
  //         card: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['card'],
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
        resource: ['card'],
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
        resource: ['card'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Assignee Name or ID',
        name: 'assignee_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
          loadOptionsDependsOn: ['accountSlug'],
        },
        default: '',
        description: 'Filter by assignee. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: 'Column Name or ID',
        name: 'column_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getColumns',
          loadOptionsDependsOn: ['boardId.value'],
        },
        default: '',
        description: 'Filter by column. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Open', value: 'open' },
          { name: 'Closed', value: 'closed' },
          { name: 'All', value: 'all' },
        ],
        default: 'open',
        description: 'Filter by card status',
      },
      {
        displayName: 'Tag Name or ID',
        name: 'tag_id',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getTags',
          loadOptionsDependsOn: ['boardId.value'],
        },
        default: '',
        description: 'Filter by tag. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
    ],
  },

  // ----------------------------------
  //         card: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['card'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The new title of the card',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          editor: 'htmlEditor',
        },
        default: '',
        description: 'The new body/description of the card (supports HTML)',
      },
    ],
  },

  // ----------------------------------
  //         card: moveToColumn
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
        resource: ['card'],
        operation: ['moveToColumn'],
      },
    },
    description: 'The column to move the card to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
  },

  // ----------------------------------
  //         card: toggleAssignment
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
        resource: ['card'],
        operation: ['toggleAssignment'],
      },
    },
    description: 'The user to assign or unassign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
  },

  // ----------------------------------
  //         card: toggleTag
  // ----------------------------------
  {
    displayName: 'Tag Name or ID',
    name: 'tagId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTags',
      loadOptionsDependsOn: ['boardId.value'],
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['card'],
        operation: ['toggleTag'],
      },
    },
    description: 'The tag to add or remove. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
  },
];
