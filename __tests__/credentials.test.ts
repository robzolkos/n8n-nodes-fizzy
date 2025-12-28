import { describe, it, expect } from 'vitest';
import { FizzyApi } from '../credentials/FizzyApi.credentials';

describe('FizzyApi Credentials', () => {
  const credentials = new FizzyApi();

  describe('name and displayName', () => {
    it('should have correct name', () => {
      expect(credentials.name).toBe('fizzyApi');
    });

    it('should have correct displayName', () => {
      expect(credentials.displayName).toBe('Fizzy API');
    });
  });

  describe('properties', () => {
    it('should have apiToken property', () => {
      const apiTokenProp = credentials.properties.find((p) => p.name === 'apiToken');
      expect(apiTokenProp).toBeDefined();
      expect(apiTokenProp?.type).toBe('string');
      expect(apiTokenProp?.required).toBe(true);
      expect(apiTokenProp?.typeOptions?.password).toBe(true);
    });

    it('should have baseUrl property with default', () => {
      const baseUrlProp = credentials.properties.find((p) => p.name === 'baseUrl');
      expect(baseUrlProp).toBeDefined();
      expect(baseUrlProp?.type).toBe('string');
      expect(baseUrlProp?.default).toBe('https://app.fizzy.do');
      expect(baseUrlProp?.required).toBe(true);
    });
  });

  describe('authenticate', () => {
    it('should use Bearer token authentication', () => {
      expect(credentials.authenticate.type).toBe('generic');
      expect(credentials.authenticate.properties.headers).toBeDefined();
      expect(credentials.authenticate.properties.headers?.Authorization).toBe(
        '=Bearer {{$credentials.apiToken}}'
      );
    });
  });

  describe('test', () => {
    it('should test connection using identity endpoint', () => {
      expect(credentials.test.request.url).toBe('/my/identity');
      expect(credentials.test.request.method).toBe('GET');
      expect(credentials.test.request.baseURL).toBe('={{$credentials.baseUrl}}');
    });
  });

  describe('documentation', () => {
    it('should have documentation URL', () => {
      expect(credentials.documentationUrl).toBe(
        'https://github.com/basecamp/fizzy/blob/main/docs/API.md'
      );
    });
  });

  describe('icon', () => {
    it('should have icon defined for light and dark modes', () => {
      expect(credentials.icon).toBeDefined();
      expect(credentials.icon).toEqual({
        light: 'file:fizzy.svg',
        dark: 'file:fizzy.svg',
      });
    });
  });
});
