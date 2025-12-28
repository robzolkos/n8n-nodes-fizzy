import { describe, it, expect } from 'vitest';
import {
  buildApiEndpoint,
  verifyWebhookSignature,
  parseFizzyUrl,
} from '../nodes/Fizzy/GenericFunctions';

describe('GenericFunctions', () => {
  describe('buildApiEndpoint', () => {
    it('should build endpoint with account slug and resource', () => {
      const endpoint = buildApiEndpoint('my-account', 'boards');
      expect(endpoint).toBe('/my-account/boards');
    });

    it('should build endpoint with account slug, resource, and id', () => {
      const endpoint = buildApiEndpoint('my-account', 'boards', '03f25q9q7bw7t3206v9ttiy53');
      expect(endpoint).toBe('/my-account/boards/03f25q9q7bw7t3206v9ttiy53');
    });

    it('should handle undefined id gracefully', () => {
      const endpoint = buildApiEndpoint('account', 'cards', undefined);
      expect(endpoint).toBe('/account/cards');
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should return true for valid signature', () => {
      const body = '{"event":"card_published","card":{"id":"123"}}';
      const secret = 'my-webhook-secret';
      // Pre-computed HMAC-SHA256 of body with secret
      const crypto = require('crypto');
      const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

      const result = verifyWebhookSignature(body, expectedSignature, secret);
      expect(result).toBe(true);
    });

    it('should return false for invalid signature', () => {
      const body = '{"event":"card_published","card":{"id":"123"}}';
      const secret = 'my-webhook-secret';
      const invalidSignature = 'invalid-signature-hash';

      const result = verifyWebhookSignature(body, invalidSignature, secret);
      expect(result).toBe(false);
    });

    it('should return false when signature is empty', () => {
      const body = '{"event":"card_published"}';
      const secret = 'secret';

      const result = verifyWebhookSignature(body, '', secret);
      expect(result).toBe(false);
    });

    it('should handle different secrets correctly', () => {
      const body = '{"test":"data"}';
      const secret1 = 'secret-one';
      const secret2 = 'secret-two';

      const crypto = require('crypto');
      const signatureForSecret1 = crypto.createHmac('sha256', secret1).update(body).digest('hex');

      // Signature for secret1 should not validate with secret2
      const result = verifyWebhookSignature(body, signatureForSecret1, secret2);
      expect(result).toBe(false);
    });
  });

  describe('parseFizzyUrl', () => {
    it('should parse a full card URL', () => {
      const url = 'https://app.fizzy.do/my-account/boards/board-123/cards/card-456';
      const result = parseFizzyUrl(url);

      expect(result.accountSlug).toBe('my-account');
      expect(result.resource).toBe('boards');
      expect(result.id).toBe('board-123');
    });

    it('should parse a board URL', () => {
      const url = 'https://app.fizzy.do/my-account/boards/03f25q9q7bw7t3206v9ttiy53';
      const result = parseFizzyUrl(url);

      expect(result.accountSlug).toBe('my-account');
      expect(result.resource).toBe('boards');
      expect(result.id).toBe('03f25q9q7bw7t3206v9ttiy53');
    });

    it('should parse a URL with only account and resource', () => {
      const url = 'https://app.fizzy.do/my-account/boards';
      const result = parseFizzyUrl(url);

      expect(result.accountSlug).toBe('my-account');
      expect(result.resource).toBe('boards');
      expect(result.id).toBeUndefined();
    });

    it('should return empty object for invalid URL', () => {
      const url = 'not-a-valid-url';
      const result = parseFizzyUrl(url);

      expect(result).toEqual({});
    });

    it('should return empty object for URL with insufficient path parts', () => {
      const url = 'https://app.fizzy.do/only-one';
      const result = parseFizzyUrl(url);

      expect(result).toEqual({});
    });

    it('should handle custom domain URLs', () => {
      const url = 'https://fizzy.mycompany.com/team-account/boards/abc123';
      const result = parseFizzyUrl(url);

      expect(result.accountSlug).toBe('team-account');
      expect(result.resource).toBe('boards');
      expect(result.id).toBe('abc123');
    });
  });
});
