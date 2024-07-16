import { describe, expect, it } from 'vitest';
import { customAcvTitleCase, toPascalCase, toTitleCase } from '../src';

describe('case Conversion Utilities', () => {
  describe('toPascalCase', () => {
    it('converts a single lowercase word to PascalCase', () => {
      expect(toPascalCase('word')).toBe('Word');
    });

    it('converts a single uppercase word to PascalCase', () => {
      expect(toPascalCase('WORD')).toBe('Word');
    });

    it('converts multiple words separated by spaces to PascalCase', () => {
      expect(toPascalCase('multiple words here')).toBe('MultipleWordsHere');
    });

    it('converts multiple words with mixed cases and underscores to PascalCase', () => {
      expect(toPascalCase('some_Mixed_CASE_words')).toBe('SomeMixedCaseWords');
    });
  });

  describe('toTitleCase', () => {
    it('converts a single lowercase word to Title Case', () => {
      expect(toTitleCase('word')).toBe('Word');
    });

    it('converts a single uppercase word to Title Case', () => {
      expect(toTitleCase('WORD')).toBe('Word');
    });

    it('converts a camelCase word to Title Case', () => {
      expect(toTitleCase('camelCaseWord')).toBe('Camelcaseword');
    });

    it('converts a sentence with mixed cases to Title Case', () => {
      expect(toTitleCase('this is a Mixed case Sentence')).toBe('This Is A Mixed Case Sentence');
    });
  });

  describe('toActTitleCase', () => {
    it('converts a single lowercase word to Title Case', () => {
      expect(customAcvTitleCase('word')).toBe('Word');
    });

    it('converts a single uppercase word to Title Case', () => {
      expect(customAcvTitleCase('WORD')).toBe('W O R D');
    });

    it('converts a camelCase word to Title Case', () => {
      expect(customAcvTitleCase('camelCaseWord')).toBe('Camel Case Word');
    });

    it('converts a sentence with mixed cases to Title Case', () => {
      expect(customAcvTitleCase('this is a Mixed case Sentence')).toBe('This Is A Mixed Case Sentence');
    });

    it('converts a sentence with acv to valid format', () => {
      expect(customAcvTitleCase('AcvAccordionPanel')).toBe('Acv Accordion Panel');
    });
  });
});
