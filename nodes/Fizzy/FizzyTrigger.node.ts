import type {
  IHookFunctions,
  IWebhookFunctions,
  ILoadOptionsFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
  INodePropertyOptions,
} from 'n8n-workflow';

import {
  fizzyApiRequest,
  buildApiEndpoint,
  verifyWebhookSignature,
  getAccounts,
  getBoards,
} from './GenericFunctions';

export class FizzyTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Fizzy Trigger',
    name: 'fizzyTrigger',
    icon: 'file:fizzy.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Starts the workflow when Fizzy events occur',
    defaults: {
      name: 'Fizzy Trigger',
    },
    inputs: [],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [
      {
        name: 'fizzyApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
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
        displayName: 'Board Name or ID',
        name: 'boardId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getBoards',
          loadOptionsDependsOn: ['accountSlug'],
        },
        default: '',
        required: true,
        description: 'The board to watch for events. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          {
            name: 'Card Added',
            value: 'card_published',
            description: 'Triggered when a new card is created',
          },
          {
            name: 'Card Assigned',
            value: 'card_assigned',
            description: 'Triggered when a card is assigned to a user',
          },
          {
            name: 'Card Board Changed',
            value: 'card_board_changed',
            description: 'Triggered when a card is moved to a different board',
          },
          {
            name: 'Card Column Changed',
            value: 'card_triaged',
            description: 'Triggered when a card is moved to a column',
          },
          {
            name: 'Card Moved Back to "Maybe?"',
            value: 'card_sent_back_to_triage',
            description: 'Triggered when a card is moved back to Maybe?',
          },
          {
            name: 'Card Moved to "Done"',
            value: 'card_closed',
            description: 'Triggered when a card is moved to Done',
          },
          {
            name: 'Card Moved to "Not Now"',
            value: 'card_postponed',
            description: 'Triggered when a card is moved to Not Now',
          },
          {
            name: 'Card Moved to "Not Now" Due to Inactivity',
            value: 'card_postponed_due_to_inactivity',
            description: 'Triggered when a card is automatically moved to Not Now due to inactivity',
          },
          {
            name: 'Card Reopened',
            value: 'card_reopened',
            description: 'Triggered when a card is reopened from Done',
          },
          {
            name: 'Card Unassigned',
            value: 'card_unassigned',
            description: 'Triggered when a user is unassigned from a card',
          },
          {
            name: 'Comment Added',
            value: 'comment_created',
            description: 'Triggered when a comment is added to a card',
          },
        ],
        default: ['card_published'],
        required: true,
        description: 'The events to listen for',
      },
      {
        displayName: 'Webhook Secret',
        name: 'webhookSecret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'Optional secret for webhook signature verification (HMAC-SHA256). If provided, incoming webhooks will be validated against this secret.',
      },
    ],
  };

  methods = {
    loadOptions: {
      async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        return getAccounts.call(this);
      },

      async getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        if (!accountSlug) return [];
        return getBoards.call(this, accountSlug);
      },
    },
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const boardId = this.getNodeParameter('boardId') as string;

        const endpoint = buildApiEndpoint(accountSlug, 'boards', boardId) + '/webhooks';

        try {
          const response = await fizzyApiRequest.call(this, 'GET', endpoint);
          const webhooks = (response as IDataObject).webhooks as IDataObject[];

          for (const webhook of webhooks) {
            if (webhook.url === webhookUrl) {
              const webhookData = this.getWorkflowStaticData('node');
              webhookData.webhookId = webhook.id;
              return true;
            }
          }
        } catch {
          return false;
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const boardId = this.getNodeParameter('boardId') as string;
        const events = this.getNodeParameter('events') as string[];
        const webhookSecret = this.getNodeParameter('webhookSecret') as string;

        const endpoint = buildApiEndpoint(accountSlug, 'boards', boardId) + '/webhooks';

        const body: IDataObject = {
          url: webhookUrl,
          events,
        };

        if (webhookSecret) {
          body.secret = webhookSecret;
        }

        try {
          const response = await fizzyApiRequest.call(this, 'POST', endpoint, body);
          const webhook = (response as IDataObject).webhook as IDataObject;

          if (webhook?.id) {
            const webhookData = this.getWorkflowStaticData('node');
            webhookData.webhookId = webhook.id;
            return true;
          }
        } catch {
          return false;
        }

        return false;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const webhookId = webhookData.webhookId as string;

        if (!webhookId) {
          return true;
        }

        const accountSlug = this.getNodeParameter('accountSlug') as string;
        const boardId = this.getNodeParameter('boardId') as string;

        const endpoint = buildApiEndpoint(accountSlug, 'boards', boardId) + '/webhooks/' + webhookId;

        try {
          await fizzyApiRequest.call(this, 'DELETE', endpoint);
          delete webhookData.webhookId;
          return true;
        } catch {
          return false;
        }
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const webhookSecret = this.getNodeParameter('webhookSecret') as string;

    // Verify signature if secret is configured
    if (webhookSecret) {
      const signatureHeader = req.headers['x-webhook-signature'] as string | string[] | undefined;
      const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
      // Use raw body for signature verification to match what Fizzy signs
      const rawBody = (req as IDataObject).rawBody;
      const body = rawBody
        ? Buffer.isBuffer(rawBody)
          ? rawBody.toString('utf8')
          : String(rawBody)
        : JSON.stringify(req.body ?? {});

      if (!signature || !verifyWebhookSignature(body, signature, webhookSecret)) {
        return {
          webhookResponse: 'Signature verification failed',
        };
      }
    }

    const bodyData = this.getBodyData() as IDataObject;

    return {
      workflowData: [this.helpers.returnJsonArray(bodyData)],
    };
  }
}
