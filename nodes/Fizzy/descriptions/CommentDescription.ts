import type { INodeProperties } from 'n8n-workflow';

export const commentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['comment'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new comment on a card',
        action: 'Create a comment',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a comment',
        action: 'Delete a comment',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a comment by ID',
        action: 'Get a comment',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get all comments for a card',
        action: 'Get many comments',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a comment',
        action: 'Update a comment',
      },
    ],
    default: 'getMany',
  },
];

export const commentFields: INodeProperties[] = [
  // ----------------------------------
  //         comment: common - board
  // ----------------------------------
  {
    displayName: 'Board',
    name: 'boardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['comment'],
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
  //         comment: common - card
  // ----------------------------------
  {
    displayName: 'Card',
    name: 'cardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['comment'],
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
    ],
    description: 'The card to add the comment to',
  },

  // ----------------------------------
  //         comment: get, update, delete
  // ----------------------------------
  {
    displayName: 'Comment ID',
    name: 'commentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['comment'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The ID of the comment',
  },

  // ----------------------------------
  //         comment: create
  // ----------------------------------
  {
    displayName: 'Content',
    name: 'content',
    type: 'string',
    typeOptions: {
      editor: 'htmlEditor',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['comment'],
        operation: ['create'],
      },
    },
    description: 'The content of the comment (supports HTML)',
  },

  // ----------------------------------
  //         comment: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['comment'],
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
        resource: ['comment'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         comment: update
  // ----------------------------------
  {
    displayName: 'Content',
    name: 'content',
    type: 'string',
    typeOptions: {
      editor: 'htmlEditor',
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['comment'],
        operation: ['update'],
      },
    },
    description: 'The new content of the comment (supports HTML)',
  },
];
