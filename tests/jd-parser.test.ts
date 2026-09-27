import { describe, it, expect } from 'vitest';
import { extractKeywords, checkKeywordPresence } from '../src/lib/jd-parser';

describe('extractKeywords', () => {
  it('returns empty for empty input', () => {
    expect(extractKeywords('')).toEqual([]);
  });

  it('extracts repeated keywords with counts', () => {
    // Each occurrence stands alone (no trailing punctuation), so they are counted separately.
    const jd = 'kafka kafka kafka';
    const result = extractKeywords(jd);
    const kafka = result.find((r) => r.keyword === 'kafka');
    expect(kafka).toBeDefined();
    expect(kafka!.count).toBe(3);
  });

  it('filters stopwords', () => {
    const jd = 'the and of a to in is for with by we you they it this that these those';
    const result = extractKeywords(jd);
    expect(result).toEqual([]);
  });

  it('extracts 2-gram phrases', () => {
    const jd = 'distributed systems distributed systems distributed systems'; // 3 occurrences of phrase
    const result = extractKeywords(jd);
    const phrase = result.find((r) => r.keyword === 'distributed systems');
    expect(phrase).toBeDefined();
    expect(phrase!.count).toBe(3);
  });
});

describe('checkKeywordPresence', () => {
  it('marks present and absent keywords correctly', () => {
    const keywords = [
      { keyword: 'kafka', count: 3 },
      { keyword: 'python', count: 2 },
    ];
    const resume = 'I have experience with kafka and java.';
    const result = checkKeywordPresence(keywords, resume);
    const kafka = result.find((r) => r.keyword === 'kafka');
    const python = result.find((r) => r.keyword === 'python');
    expect(kafka!.presentInResume).toBe(true);
    expect(python!.presentInResume).toBe(false);
  });

  it('is case-insensitive', () => {
    const keywords = [{ keyword: 'kafka', count: 2 }];
    expect(checkKeywordPresence(keywords, 'KAFKA experience').map((r) => r.presentInResume)).toEqual([true]);
  });
});
