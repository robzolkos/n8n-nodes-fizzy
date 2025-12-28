import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';

import {
  fizzyApiRequest,
  buildApiEndpoint,
  getAccounts,
  getBoards,
  getColumns,
  getTags,
  getUsers,
} from './GenericFunctions';

import {
  boardOperations,
  boardFields,
  cardOperations,
  cardFields,
  columnOperations,
  columnFields,
  commentOperations,
  commentFields,
  notificationOperations,
  notificationFields,
  reactionOperations,
  reactionFields,
  stepOperations,
  stepFields,
  tagOperations,
  tagFields,
  userOperations,
  userFields,
} from './descriptions';

export class Fizzy implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Fizzy',
    name: 'fizzy',
    icon: 'file:fizzy.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Fizzy API',
    defaults: {
      name: 'Fizzy',
    },
    inputs: ['main'],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [
      {
        name: 'fizzyApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Account Name or ID',
        name: 'accountSlug',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getAccounts',
        },
        default: '',
        required: true,
        description: 'The Fizzy account to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Board', value: 'board' },
          { name: 'Card', value: 'card' },
          { name: 'Column', value: 'column' },
          { name: 'Comment', value: 'comment' },
          { name: 'Notification', value: 'notification' },
          { name: 'Reaction', value: 'reaction' },
          { name: 'Step', value: 'step' },
          { name: 'Tag', value: 'tag' },
          { name: 'User', value: 'user' },
        ],
        default: 'card',
      },
      // Operations
      ...boardOperations,
      ...cardOperations,
      ...columnOperations,
      ...commentOperations,
      ...notificationOperations,
      ...reactionOperations,
      ...stepOperations,
      ...tagOperations,
      ...userOperations,
      // Fields
      ...boardFields,
      ...cardFields,
      ...columnFields,
      ...commentFields,
      ...notificationFields,
      ...reactionFields,
      ...stepFields,
      ...tagFields,
      ...userFields,
    ],
  };

  methods = {
    loadOptions: {
      async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        return getAccounts.call(this);
      },

      async getColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const boardId = this.getNodeParameter('boardId') as IDataObject;
        const boardIdValue = (boardId.value as string) || (boardId as unknown as string);
        if (!boardIdValue) return [];
        return getColumns.call(this, accountSlug, boardIdValue);
      },

      async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const boardId = this.getNodeParameter('boardId') as IDataObject;
        const boardIdValue = (boardId.value as string) || (boardId as unknown as string);
        if (!boardIdValue) return [];
        return getTags.call(this, accountSlug, boardIdValue);
      },

      async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        return getUsers.call(this, accountSlug);
      },
    },

    listSearch: {
      async searchBoards(
        this: ILoadOptionsFunctions,
        filter?: string,
      ): Promise<INodeListSearchResult> {
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const boards = await getBoards.call(this, accountSlug);

        const results = boards
          .filter((board) => !filter || board.name.toLowerCase().includes(filter.toLowerCase()))
          .map((board) => ({
            name: board.name,
            value: board.value,
          }));

        return { results };
      },

      async searchCards(
        this: ILoadOptionsFunctions,
        filter?: string,
      ): Promise<INodeListSearchResult> {
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const boardId = this.getNodeParameter('boardId') as IDataObject;
        const boardIdValue = (boardId.value as string) || (boardId as unknown as string);

        if (!boardIdValue) {
          return { results: [] };
        }

        // Cards endpoint is /:account_slug/cards with optional board_id filter
        const endpoint = buildApiEndpoint(accountSlug, 'cards');
        const response = await fizzyApiRequest.call(this, 'GET', endpoint, {}, { board_id: boardIdValue });
        // API returns array directly
        const cards = response as IDataObject[];

        const results = cards
          .filter((card) => !filter || (card.title as string).toLowerCase().includes(filter.toLowerCase()))
          .map((card) => ({
            name: `#${card.number} - ${card.title as string}`,
            // Use card number for API calls (not id)
            value: String(card.number),
          }));

        return { results };
      },

      async searchComments(
        this: ILoadOptionsFunctions,
        filter?: string,
      ): Promise<INodeListSearchResult> {
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const cardId = this.getNodeParameter('cardId') as IDataObject;
        const cardIdValue = (cardId.value as string) || (cardId as unknown as string);

        if (!cardIdValue) {
          return { results: [] };
        }

        // Comments endpoint is /:account_slug/cards/:card_number/comments
        const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments';
        const response = await fizzyApiRequest.call(this, 'GET', endpoint);
        // API returns array directly
        const comments = response as IDataObject[];

        const results = comments
          .filter((comment) => {
            if (!filter) return true;
            const body = comment.body as IDataObject;
            const plainText = (body?.plain_text as string) || '';
            return plainText.toLowerCase().includes(filter.toLowerCase());
          })
          .map((comment) => {
            const body = comment.body as IDataObject;
            const plainText = (body?.plain_text as string) || 'No content';
            // Truncate long comments for display
            const displayText = plainText.length > 50 ? plainText.substring(0, 47) + '...' : plainText;
            return {
              name: displayText,
              value: comment.id as string,
            };
          });

        return { results };
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const accountSlug = this.getNodeParameter('accountSlug', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[];

        // ----------------------------------------
        //              Board
        // ----------------------------------------
        if (resource === 'board') {
          if (operation === 'create') {
            const title = this.getNodeParameter('title', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
            // Rails expects nested params: board: { name: "..." }
            const body: IDataObject = { board: { name: title, ...additionalFields } };
            const endpoint = buildApiEndpoint(accountSlug, 'boards');
            // POST returns 201 with Location header but no body, so we need to list boards and find the new one
            await fizzyApiRequest.call(this, 'POST', endpoint, body);
            // Get all boards and find the one we just created by name
            const boards = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
            responseData = boards.find((b) => b.name === title) || { success: true, name: title };
          } else if (operation === 'delete') {
            const boardId = this.getNodeParameter('boardId', i) as IDataObject;
            const boardIdValue = (boardId.value as string) || (boardId as unknown as string);
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue);
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'get') {
            const boardId = this.getNodeParameter('boardId', i) as IDataObject;
            const boardIdValue = (boardId.value as string) || (boardId as unknown as string);
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue);
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint);
          } else if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const endpoint = buildApiEndpoint(accountSlug, 'boards');
            if (returnAll) {
              // API returns array directly
              responseData = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const response = await fizzyApiRequest.call(this, 'GET', endpoint, {}, { per_page: limit });
              // API returns array directly
              responseData = (response as IDataObject[]).slice(0, limit);
            }
          } else if (operation === 'update') {
            const boardId = this.getNodeParameter('boardId', i) as IDataObject;
            const boardIdValue = (boardId.value as string) || (boardId as unknown as string);
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue);
            // Rails expects nested params: board: { ... }
            responseData = await fizzyApiRequest.call(this, 'PATCH', endpoint, { board: updateFields });
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              Card
        // ----------------------------------------
        else if (resource === 'card') {
          const boardId = this.getNodeParameter('boardId', i) as IDataObject;
          const boardIdValue = (boardId.value as string) || (boardId as unknown as string);

          if (operation === 'create') {
            const title = this.getNodeParameter('title', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
            // Rails expects nested params: card: { title: "...", ... }
            const body: IDataObject = { card: { title, ...additionalFields } };
            // POST to /:account_slug/boards/:board_id/cards
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/cards';
            // POST returns 201 with Location header but no body
            await fizzyApiRequest.call(this, 'POST', endpoint, body);
            // Get all cards for this board and find the one we just created by title (most recent)
            const cardsEndpoint = buildApiEndpoint(accountSlug, 'cards');
            const cards = await fizzyApiRequest.call(this, 'GET', cardsEndpoint, {}, { board_id: boardIdValue }) as IDataObject[];
            responseData = cards.find((c) => c.title === title) || { success: true, title };
          } else if (operation === 'delete') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // DELETE /:account_slug/cards/:card_number
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue);
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'get') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // GET /:account_slug/cards/:card_number
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue);
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint);
          } else if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            // GET /:account_slug/cards with board_id filter
            const endpoint = buildApiEndpoint(accountSlug, 'cards');
            const query: IDataObject = { board_id: boardIdValue, ...filters };
            if (returnAll) {
              // API returns array directly
              responseData = await fizzyApiRequest.call(this, 'GET', endpoint, {}, query) as IDataObject[];
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              query.per_page = limit;
              const response = await fizzyApiRequest.call(this, 'GET', endpoint, {}, query);
              // API returns array directly
              responseData = (response as IDataObject[]).slice(0, limit);
            }
          } else if (operation === 'update') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
            // PUT /:account_slug/cards/:card_number
            // Rails expects nested params: card: { ... }
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue);
            responseData = await fizzyApiRequest.call(this, 'PUT', endpoint, { card: updateFields });
          } else if (operation === 'close') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // POST /cards/:id/closure (create action)
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/closure';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint);
          } else if (operation === 'reopen') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // DELETE /cards/:id/closure (destroy action)
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/closure';
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'moveToColumn') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            const columnId = this.getNodeParameter('columnId', i) as string;
            // POST /cards/:id/triage with column_id param
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/triage';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint, { column_id: columnId });
          } else if (operation === 'moveToNotNow') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // POST /cards/:id/not_now
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/not_now';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint);
          } else if (operation === 'sendToTriage') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // DELETE /cards/:id/triage (destroy action sends back to triage/Maybe?)
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/triage';
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'toggleAssignment') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            const userId = this.getNodeParameter('userId', i) as string;
            // POST to /:account_slug/cards/:card_number/assignments with assignee_id in body
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/assignments';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint, { assignee_id: userId });
          } else if (operation === 'toggleTag') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            const tagId = this.getNodeParameter('tagId', i) as string;
            // POST to /:account_slug/cards/:card_number/taggings with tag_title in body
            // Need to get the tag name from the tag ID first
            const tagsEndpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/tags';
            const tags = await fizzyApiRequest.call(this, 'GET', tagsEndpoint) as IDataObject[];
            const tag = tags.find((t) => t.id === tagId);
            const tagTitle = tag?.name as string || tagId;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/taggings';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint, { tag_title: tagTitle });
          } else if (operation === 'watch') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // POST /cards/:id/watch (create action)
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/watch';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint);
          } else if (operation === 'unwatch') {
            const cardId = this.getNodeParameter('cardId', i) as IDataObject;
            const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
            // DELETE /cards/:id/watch (destroy action)
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/watch';
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              Column
        // ----------------------------------------
        else if (resource === 'column') {
          const boardId = this.getNodeParameter('boardId', i) as IDataObject;
          const boardIdValue = (boardId.value as string) || (boardId as unknown as string);

          if (operation === 'create') {
            const title = this.getNodeParameter('title', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
            // Rails expects nested params: column: { name: "...", ... }
            const body: IDataObject = { column: { name: title, ...additionalFields } };
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/columns';
            // POST returns 201 with Location header but no body
            await fizzyApiRequest.call(this, 'POST', endpoint, body);
            // Get all columns and find the one we just created by name
            const columns = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
            responseData = columns.find((c) => c.name === title) || { success: true, name: title };
          } else if (operation === 'delete') {
            const columnId = this.getNodeParameter('columnId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/columns/' + columnId;
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'get') {
            const columnId = this.getNodeParameter('columnId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/columns/' + columnId;
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint);
          } else if (operation === 'getMany') {
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/columns';
            // API returns array directly
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
          } else if (operation === 'update') {
            const columnId = this.getNodeParameter('columnId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/columns/' + columnId;
            // Rails expects nested params: column: { ... }
            responseData = await fizzyApiRequest.call(this, 'PATCH', endpoint, { column: updateFields });
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              Comment
        // ----------------------------------------
        else if (resource === 'comment') {
          // Comments endpoint is /:account_slug/cards/:card_number/comments
          const cardId = this.getNodeParameter('cardId', i) as IDataObject;
          const cardIdValue = (cardId.value as string) || (cardId as unknown as string);

          if (operation === 'create') {
            const content = this.getNodeParameter('content', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments';
            // Rails expects nested params: comment: { body: "..." }
            // POST returns 201 with Location header but no body
            await fizzyApiRequest.call(this, 'POST', endpoint, { comment: { body: content } });
            // Get all comments and find the one we just created (most recent with matching body)
            const comments = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
            responseData = comments.find((c) => {
              const body = c.body as IDataObject;
              return body?.plain_text === content;
            }) || { success: true, body: content };
          } else if (operation === 'delete') {
            const commentId = this.getNodeParameter('commentId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments/' + commentId;
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'get') {
            const commentId = this.getNodeParameter('commentId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments/' + commentId;
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint);
          } else if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments';
            if (returnAll) {
              // API returns array directly
              responseData = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const response = await fizzyApiRequest.call(this, 'GET', endpoint, {}, { per_page: limit });
              // API returns array directly
              responseData = (response as IDataObject[]).slice(0, limit);
            }
          } else if (operation === 'update') {
            const commentId = this.getNodeParameter('commentId', i) as string;
            const content = this.getNodeParameter('content', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments/' + commentId;
            // Rails expects nested params: comment: { body: "..." }
            responseData = await fizzyApiRequest.call(this, 'PATCH', endpoint, { comment: { body: content } });
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              Notification
        // ----------------------------------------
        else if (resource === 'notification') {
          if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            // GET /notifications
            const endpoint = buildApiEndpoint(accountSlug, 'notifications');
            const query: IDataObject = {};
            if (filters.read && filters.read !== 'all') {
              query.read = filters.read;
            }
            if (returnAll) {
              // API returns array directly
              responseData = await fizzyApiRequest.call(this, 'GET', endpoint, {}, query) as IDataObject[];
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              query.per_page = limit;
              const response = await fizzyApiRequest.call(this, 'GET', endpoint, {}, query);
              // API returns array directly
              responseData = (response as IDataObject[]).slice(0, limit);
            }
          } else if (operation === 'markAsRead') {
            const notificationId = this.getNodeParameter('notificationId', i) as string;
            // POST /notifications/:id/reading (create action)
            const endpoint = buildApiEndpoint(accountSlug, 'notifications', notificationId) + '/reading';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint);
          } else if (operation === 'markAsUnread') {
            const notificationId = this.getNodeParameter('notificationId', i) as string;
            // DELETE /notifications/:id/reading (destroy action)
            const endpoint = buildApiEndpoint(accountSlug, 'notifications', notificationId) + '/reading';
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'markAllAsRead') {
            // POST /notifications/bulk_reading
            const endpoint = buildApiEndpoint(accountSlug, 'notifications') + '/bulk_reading';
            responseData = await fizzyApiRequest.call(this, 'POST', endpoint);
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              Reaction
        // ----------------------------------------
        else if (resource === 'reaction') {
          // Reactions endpoint is /:account_slug/cards/:card_number/comments/:comment_id/reactions
          const cardId = this.getNodeParameter('cardId', i) as IDataObject;
          const cardIdValue = (cardId.value as string) || (cardId as unknown as string);
          const commentId = this.getNodeParameter('commentId', i) as IDataObject;
          const commentIdValue = (commentId.value as string) || (commentId as unknown as string);

          if (operation === 'create') {
            const emoji = this.getNodeParameter('emoji', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments/' + commentIdValue + '/reactions';
            // Rails expects nested params: reaction: { content: "emoji" }
            // POST returns 201 with no body or location header
            await fizzyApiRequest.call(this, 'POST', endpoint, { reaction: { content: emoji } });
            // Get all reactions and find the one we just created by emoji
            const reactions = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
            responseData = reactions.find((r) => r.content === emoji) || { success: true, content: emoji };
          } else if (operation === 'delete') {
            const reactionId = this.getNodeParameter('reactionId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments/' + commentIdValue + '/reactions/' + reactionId;
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'getMany') {
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/comments/' + commentIdValue + '/reactions';
            // API returns array directly
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              Step
        // ----------------------------------------
        else if (resource === 'step') {
          // Steps endpoint is /:account_slug/cards/:card_number/steps
          const cardId = this.getNodeParameter('cardId', i) as IDataObject;
          const cardIdValue = (cardId.value as string) || (cardId as unknown as string);

          if (operation === 'create') {
            const title = this.getNodeParameter('title', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/steps';
            // Rails expects nested params: step: { content: "..." }
            // POST returns 201 with Location header but no body
            await fizzyApiRequest.call(this, 'POST', endpoint, { step: { content: title } });
            // Steps are included in card response, so get the card and find the new step
            const cardEndpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue);
            const card = await fizzyApiRequest.call(this, 'GET', cardEndpoint) as IDataObject;
            const steps = card.steps as IDataObject[];
            responseData = steps?.find((s) => s.content === title) || { success: true, content: title };
          } else if (operation === 'delete') {
            const stepId = this.getNodeParameter('stepId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/steps/' + stepId;
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'get') {
            const stepId = this.getNodeParameter('stepId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/steps/' + stepId;
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint);
          } else if (operation === 'update') {
            const stepId = this.getNodeParameter('stepId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
            const endpoint = buildApiEndpoint(accountSlug, 'cards', cardIdValue) + '/steps/' + stepId;
            // Rails expects nested params: step: { ... }
            responseData = await fizzyApiRequest.call(this, 'PATCH', endpoint, { step: updateFields });
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              Tag
        // ----------------------------------------
        else if (resource === 'tag') {
          const boardId = this.getNodeParameter('boardId', i) as IDataObject;
          const boardIdValue = (boardId.value as string) || (boardId as unknown as string);

          if (operation === 'getMany') {
            const endpoint = buildApiEndpoint(accountSlug, 'boards', boardIdValue) + '/tags';
            // API returns array directly
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
          } else {
            responseData = {};
          }
        }

        // ----------------------------------------
        //              User
        // ----------------------------------------
        else if (resource === 'user') {
          if (operation === 'deactivate') {
            const userId = this.getNodeParameter('userId', i) as string;
            // DELETE /users/:id (destroy action deactivates user)
            const endpoint = buildApiEndpoint(accountSlug, 'users', userId);
            responseData = await fizzyApiRequest.call(this, 'DELETE', endpoint);
          } else if (operation === 'get') {
            const userId = this.getNodeParameter('userId', i) as string;
            const endpoint = buildApiEndpoint(accountSlug, 'users', userId);
            responseData = await fizzyApiRequest.call(this, 'GET', endpoint);
          } else if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const endpoint = buildApiEndpoint(accountSlug, 'users');
            if (returnAll) {
              // API returns array directly
              responseData = await fizzyApiRequest.call(this, 'GET', endpoint) as IDataObject[];
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const response = await fizzyApiRequest.call(this, 'GET', endpoint, {}, { per_page: limit });
              // API returns array directly
              responseData = (response as IDataObject[]).slice(0, limit);
            }
          } else if (operation === 'update') {
            const userId = this.getNodeParameter('userId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
            const endpoint = buildApiEndpoint(accountSlug, 'users', userId);
            // Rails expects nested params: user: { ... }
            responseData = await fizzyApiRequest.call(this, 'PATCH', endpoint, { user: updateFields });
          } else {
            responseData = {};
          }
        } else {
          responseData = {};
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
