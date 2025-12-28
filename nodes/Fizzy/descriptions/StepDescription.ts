import type { INodeProperties } from 'n8n-workflow';

export const stepOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['step'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new step (checklist item) on a card',
        action: 'Create a step',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a step',
        action: 'Delete a step',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a step by ID',
        action: 'Get a step',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a step',
        action: 'Update a step',
      },
    ],
    default: 'create',
  },
];

export const stepFields: INodeProperties[] = [
  // ----------------------------------
  //         step: common - board
  // ----------------------------------
  {
    displayName: 'Board',
    name: 'boardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['step'],
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
  //         step: common - card
  // ----------------------------------
  {
    displayName: 'Card',
    name: 'cardId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['step'],
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
    description: 'The card to add the step to',
  },

  // ----------------------------------
  //         step: get, update, delete
  // ----------------------------------
  {
    displayName: 'Step ID',
    name: 'stepId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['step'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The ID of the step',
  },

  // ----------------------------------
  //         step: create
  // ----------------------------------
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['step'],
        operation: ['create'],
      },
    },
    description: 'The title of the step (checklist item)',
  },

  // ----------------------------------
  //         step: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['step'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The new title of the step',
      },
      {
        displayName: 'Completed',
        name: 'completed',
        type: 'boolean',
        default: false,
        description: 'Whether the step is completed',
      },
    ],
  },
];
