import type { INodeProperties } from 'n8n-workflow';

export const reactionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Add a reaction to a comment',
        action: 'Create a reaction',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Remove a reaction from a comment',
        action: 'Delete a reaction',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get all reactions for a comment',
        action: 'Get many reactions',
      },
    ],
    default: 'getMany',
  },
];

export const reactionFields: INodeProperties[] = [
  // ----------------------------------
  //         reaction: common - board
  // ----------------------------------
  {
    displayName: 'Board',
    name: 'boardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
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
  //         reaction: common - card
  // ----------------------------------
  {
    displayName: 'Card',
    name: 'cardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
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
    description: 'The card the comment belongs to',
  },

  // ----------------------------------
  //         reaction: common - comment
  // ----------------------------------
  {
    displayName: 'Comment',
    name: 'commentId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['reaction'],
      },
    },
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a comment...',
        typeOptions: {
          searchListMethod: 'searchComments',
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
    description: 'The comment to add a reaction to',
  },

  // ----------------------------------
  //         reaction: create
  // ----------------------------------
  {
    displayName: 'Emoji',
    name: 'emoji',
    type: 'string',
    required: true,
    default: '👍',
    displayOptions: {
      show: {
        resource: ['reaction'],
        operation: ['create'],
      },
    },
    description: 'The emoji to use as a reaction',
  },

  // ----------------------------------
  //         reaction: delete
  // ----------------------------------
  {
    displayName: 'Reaction ID',
    name: 'reactionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['reaction'],
        operation: ['delete'],
      },
    },
    description: 'The ID of the reaction to delete',
  },
];
