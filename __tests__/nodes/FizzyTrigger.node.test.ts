import { describe, it, expect } from 'vitest';
import { FizzyTrigger } from '../../nodes/Fizzy/FizzyTrigger.node';

describe('FizzyTrigger Node', () => {
  const node = new FizzyTrigger();

  describe('description', () => {
    it('should have correct displayName', () => {
      expect(node.description.displayName).toBe('Fizzy Trigger');
    });

    it('should have correct name', () => {
      expect(node.description.name).toBe('fizzyTrigger');
    });

    it('should be in trigger group', () => {
      expect(node.description.group).toContain('trigger');
    });

    it('should have version 1', () => {
      expect(node.description.version).toBe(1);
    });

    it('should have no inputs (trigger node)', () => {
      expect(node.description.inputs).toEqual([]);
    });

    it('should have main output', () => {
      expect(node.description.outputs).toContain('main');
    });

    it('should require fizzyApi credentials', () => {
      const credentialRequirement = node.description.credentials?.find(
        (c) => c.name === 'fizzyApi'
      );
      expect(credentialRequirement).toBeDefined();
      expect(credentialRequirement?.required).toBe(true);
    });

    it('should have icon file reference', () => {
      expect(node.description.icon).toBe('file:fizzy.svg');
    });

    it('should be usable as AI tool', () => {
      expect(node.description.usableAsTool).toBe(true);
    });
  });

  describe('webhook configuration', () => {
    it('should have webhook defined', () => {
      expect(node.description.webhooks).toBeDefined();
      expect(node.description.webhooks?.length).toBeGreaterThan(0);
    });

    it('should use POST method', () => {
      const webhook = node.description.webhooks?.[0];
      expect(webhook?.httpMethod).toBe('POST');
    });

    it('should use webhook path', () => {
      const webhook = node.description.webhooks?.[0];
      expect(webhook?.path).toBe('webhook');
    });

    it('should respond on received', () => {
      const webhook = node.description.webhooks?.[0];
      expect(webhook?.responseMode).toBe('onReceived');
    });
  });

  describe('properties', () => {
    it('should have accountSlug property', () => {
      const prop = node.description.properties.find((p) => p.name === 'accountSlug');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('options');
      expect(prop?.required).toBe(true);
    });

    it('should have boardId property', () => {
      const prop = node.description.properties.find((p) => p.name === 'boardId');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('options');
      expect(prop?.required).toBe(true);
    });

    it('should have events property', () => {
      const prop = node.description.properties.find((p) => p.name === 'events');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('multiOptions');
      expect(prop?.required).toBe(true);
    });

    it('should have webhookSecret property', () => {
      const prop = node.description.properties.find((p) => p.name === 'webhookSecret');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('string');
      expect(prop?.typeOptions?.password).toBe(true);
    });
  });

  describe('supported events', () => {
    it('should support all Fizzy webhook events', () => {
      const eventsProp = node.description.properties.find((p) => p.name === 'events');
      const eventValues = eventsProp?.options?.map((o: { value: string }) => o.value);

      const expectedEvents = [
        'card_published',
        'card_triaged',
        'card_assigned',
        'card_unassigned',
        'card_closed',
        'card_reopened',
        'card_postponed',
        'card_sent_back_to_triage',
        'card_board_changed',
        'comment_created',
      ];

      expectedEvents.forEach((event) => {
        expect(eventValues).toContain(event);
      });
    });

    it('should have card_published as default event', () => {
      const eventsProp = node.description.properties.find((p) => p.name === 'events');
      expect(eventsProp?.default).toContain('card_published');
    });
  });

  describe('webhookMethods', () => {
    it('should have checkExists method', () => {
      expect(node.webhookMethods.default.checkExists).toBeDefined();
      expect(typeof node.webhookMethods.default.checkExists).toBe('function');
    });

    it('should have create method', () => {
      expect(node.webhookMethods.default.create).toBeDefined();
      expect(typeof node.webhookMethods.default.create).toBe('function');
    });

    it('should have delete method', () => {
      expect(node.webhookMethods.default.delete).toBeDefined();
      expect(typeof node.webhookMethods.default.delete).toBe('function');
    });
  });

  describe('webhook handler', () => {
    it('should have webhook method', () => {
      expect(node.webhook).toBeDefined();
      expect(typeof node.webhook).toBe('function');
    });
  });

  describe('methods', () => {
    it('should have loadOptions methods', () => {
      expect(node.methods.loadOptions).toBeDefined();
      expect(node.methods.loadOptions.getAccounts).toBeDefined();
      expect(node.methods.loadOptions.getBoards).toBeDefined();
    });
  });
});
