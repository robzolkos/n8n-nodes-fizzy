import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { createHmac } from 'crypto';

/**
 * Make an authenticated request to the Fizzy API
 */
export async function fizzyApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
  const credentials = await this.getCredentials('fizzyApi');
  const baseUrl = credentials.baseUrl as string;

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    qs: query,
    json: true,
  };

  if (Object.keys(body).length > 0) {
    options.body = body;
  }

  try {
    return await this.helpers.httpRequestWithAuthentication.call(this, 'fizzyApi', options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * Make a paginated request to the Fizzy API and return all results
 */
export async function fizzyApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  propertyName: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let page = 1;
  const perPage = 100;

  let responseData: IDataObject[];

  do {
    const response = await fizzyApiRequest.call(this, method, endpoint, body, {
      ...query,
      page,
      per_page: perPage,
    });

    responseData = (response as IDataObject)[propertyName] as IDataObject[];

    if (responseData) {
      returnData.push(...responseData);
    }

    page++;
  } while (responseData && responseData.length === perPage);

  return returnData;
}

/**
 * Build the API endpoint URL with account slug
 */
export function buildApiEndpoint(accountSlug: string, resource: string, id?: string): string {
  let endpoint = `/${accountSlug}/${resource}`;
  if (id) {
    endpoint += `/${id}`;
  }
  return endpoint;
}

/**
 * Verify webhook signature using HMAC-SHA256
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  return signature === expected;
}

/**
 * Parse a Fizzy URL and extract components
 * URLs look like: https://app.fizzy.do/account-slug/boards/board-id
 */
export function parseFizzyUrl(url: string): { accountSlug?: string; resource?: string; id?: string } {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    if (pathParts.length >= 3) {
      return {
        accountSlug: pathParts[0],
        resource: pathParts[1],
        id: pathParts[2],
      };
    } else if (pathParts.length === 2) {
      return {
        accountSlug: pathParts[0],
        resource: pathParts[1],
      };
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Get accounts for dynamic dropdown
 */
export async function getAccounts(
  this: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: string }>> {
  const response = await fizzyApiRequest.call(this, 'GET', '/my/identity');
  const accounts = (response as IDataObject).accounts as IDataObject[];

  return accounts.map((account) => ({
    name: account.name as string,
    // Strip leading slash from slug if present (API returns "/6086023" but endpoints need "6086023")
    value: (account.slug as string).replace(/^\//, ''),
  }));
}

/**
 * Get boards for dynamic dropdown (requires account context)
 */
export async function getBoards(
  this: ILoadOptionsFunctions,
  accountSlug: string,
): Promise<Array<{ name: string; value: string }>> {
  const endpoint = buildApiEndpoint(accountSlug, 'boards');
  const response = await fizzyApiRequest.call(this, 'GET', endpoint);
  // API returns array directly, not wrapped in { boards: [...] }
  const boards = response as IDataObject[];

  return boards.map((board) => ({
    name: board.name as string,
    value: board.id as string,
  }));
}

/**
 * Get columns for a board (dynamic dropdown)
 */
export async function getColumns(
  this: ILoadOptionsFunctions,
  accountSlug: string,
  boardId: string,
): Promise<Array<{ name: string; value: string }>> {
  const endpoint = buildApiEndpoint(accountSlug, 'boards', boardId) + '/columns';
  const response = await fizzyApiRequest.call(this, 'GET', endpoint);
  // API returns array directly
  const columns = response as IDataObject[];

  return columns.map((column) => ({
    name: column.name as string,
    value: column.id as string,
  }));
}

/**
 * Get tags for a board (dynamic dropdown)
 */
export async function getTags(
  this: ILoadOptionsFunctions,
  accountSlug: string,
  boardId: string,
): Promise<Array<{ name: string; value: string }>> {
  const endpoint = buildApiEndpoint(accountSlug, 'boards', boardId) + '/tags';
  const response = await fizzyApiRequest.call(this, 'GET', endpoint);
  // API returns array directly
  const tags = response as IDataObject[];

  return tags.map((tag) => ({
    name: tag.name as string,
    value: tag.id as string,
  }));
}

/**
 * Get users for an account (dynamic dropdown)
 */
export async function getUsers(
  this: ILoadOptionsFunctions,
  accountSlug: string,
): Promise<Array<{ name: string; value: string }>> {
  const endpoint = buildApiEndpoint(accountSlug, 'users');
  const response = await fizzyApiRequest.call(this, 'GET', endpoint);
  // API returns array directly
  const users = response as IDataObject[];

  return users.map((user) => ({
    name: user.name as string,
    value: user.id as string,
  }));
}
