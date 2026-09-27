import { describe, it, expect } from 'vitest';
import { generateVerbSuggestions } from '../src/lib/verb-suggester';

describe('generateVerbSuggestions', () => {
  it('returns suggestions for recognised Chinese verbs', () => {
    const resume = '负责项目对接，优化系统性能，参与产品设计';
    const result = generateVerbSuggestions(resume);
    const verbs = result.map((r) => r.suggestedText);
    expect(verbs).toContain('Spearheaded');
    expect(verbs).toContain('Streamlined');
    expect(verbs).toContain('Contributed to');
  });

  it('returns empty array for empty input', () => {
    expect(generateVerbSuggestions('')).toEqual([]);
    expect(generateVerbSuggestions('   ')).toEqual([]);
  });

  it('does not fabricate verbs for unrecognised text', () => {
    const resume = 'This is already in English with no Chinese verbs.';
    const result = generateVerbSuggestions(resume);
    expect(result).toEqual([]);
  });

  it('provides a reason for every suggestion', () => {
    const resume = '负责项目开发';
    const result = generateVerbSuggestions(resume);
    expect(result.length).toBeGreaterThan(0);
    for (const r of result) {
      expect(r.reason).toContain(r.suggestedText);
      expect(r.reason.length).toBeGreaterThan(10);
    }
  });

  it('marks suggestions as verified (rule-based, not model output)', () => {
    const resume = '负责项目';
    const result = generateVerbSuggestions(resume);
    expect(result.every((r) => r.reviewStatus === 'verified')).toBe(true);
    expect(result.every((r) => r.confidence === 'high')).toBe(true);
  });
});
