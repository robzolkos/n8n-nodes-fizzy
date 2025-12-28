import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class FizzyApi implements ICredentialType {
  name = 'fizzyApi';
  displayName = 'Fizzy API';
  icon = { light: 'file:fizzy.svg', dark: 'file:fizzy.svg' } as const;
  documentationUrl = 'https://github.com/basecamp/fizzy/blob/main/docs/API.md';

  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Fizzy API token. Generate one from your Fizzy account settings.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://app.fizzy.do',
      required: true,
      description: 'The base URL of your Fizzy instance',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/my/identity',
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  };
}
