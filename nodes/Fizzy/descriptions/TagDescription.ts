import type { INodeProperties } from 'n8n-workflow';

export const tagOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['tag'],
      },
    },
    options: [
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get all tags for a board',
        action: 'Get many tags',
      },
    ],
    default: 'getMany',
  },
];

export const tagFields: INodeProperties[] = [
  // ----------------------------------
  //         tag: common - board
  // ----------------------------------
  {
    displayName: 'Board',
    name: 'boardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
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
    description: 'The board to get tags from',
  },
];
