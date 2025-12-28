import { describe, it, expect } from 'vitest';
import { Fizzy } from '../../nodes/Fizzy/Fizzy.node';

describe('Fizzy Node', () => {
  const node = new Fizzy();

  describe('description', () => {
    it('should have correct displayName', () => {
      expect(node.description.displayName).toBe('Fizzy');
    });

    it('should have correct name', () => {
      expect(node.description.name).toBe('fizzy');
    });

    it('should have correct group', () => {
      expect(node.description.group).toContain('transform');
    });

    it('should have version 1', () => {
      expect(node.description.version).toBe(1);
    });

    it('should have main input', () => {
      expect(node.description.inputs).toContain('main');
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

  describe('resources', () => {
    it('should have resource property', () => {
      const resourceProp = node.description.properties.find((p) => p.name === 'resource');
      expect(resourceProp).toBeDefined();
      expect(resourceProp?.type).toBe('options');
    });

    it('should support all required resources', () => {
      const resourceProp = node.description.properties.find((p) => p.name === 'resource');
      const resourceValues = resourceProp?.options?.map((o: { value: string }) => o.value);

      expect(resourceValues).toContain('board');
      expect(resourceValues).toContain('card');
      expect(resourceValues).toContain('column');
      expect(resourceValues).toContain('comment');
      expect(resourceValues).toContain('notification');
      expect(resourceValues).toContain('reaction');
      expect(resourceValues).toContain('step');
      expect(resourceValues).toContain('tag');
      expect(resourceValues).toContain('user');
    });
  });

  describe('accountSlug property', () => {
    it('should have accountSlug as first property', () => {
      const accountSlugProp = node.description.properties.find((p) => p.name === 'accountSlug');
      expect(accountSlugProp).toBeDefined();
      expect(accountSlugProp?.type).toBe('options');
      expect(accountSlugProp?.required).toBe(true);
    });

    it('should use loadOptionsMethod for accounts', () => {
      const accountSlugProp = node.description.properties.find((p) => p.name === 'accountSlug');
      expect(accountSlugProp?.typeOptions?.loadOptionsMethod).toBe('getAccounts');
    });
  });

  describe('methods', () => {
    it('should have loadOptions methods', () => {
      expect(node.methods.loadOptions).toBeDefined();
      expect(node.methods.loadOptions.getAccounts).toBeDefined();
      expect(node.methods.loadOptions.getColumns).toBeDefined();
      expect(node.methods.loadOptions.getTags).toBeDefined();
      expect(node.methods.loadOptions.getUsers).toBeDefined();
    });

    it('should have listSearch methods', () => {
      expect(node.methods.listSearch).toBeDefined();
      expect(node.methods.listSearch.searchBoards).toBeDefined();
      expect(node.methods.listSearch.searchCards).toBeDefined();
    });
  });

  describe('execute method', () => {
    it('should have execute method', () => {
      expect(node.execute).toBeDefined();
      expect(typeof node.execute).toBe('function');
    });
  });
});
