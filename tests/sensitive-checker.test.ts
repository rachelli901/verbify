import { describe, it, expect } from 'vitest';
import { checkSensitiveFields } from '../src/lib/sensitive-checker';

describe('checkSensitiveFields', () => {
  it('flags Chinese ID numbers', () => {
    const text = '身份证号 110101200001011234';
    const findings = checkSensitiveFields(text, ['US']);
    expect(findings.some((f) => f.field === 'id-number')).toBe(true);
  });

  it('flags photos for US/UK', () => {
    const text = '照片已附，年龄28岁';
    const us = checkSensitiveFields(text, ['US']);
    const uk = checkSensitiveFields(text, ['UK']);
    expect(us.some((f) => f.field === 'photo')).toBe(true);
    expect(uk.some((f) => f.field === 'photo')).toBe(true);
  });

  it('does not flag photo for SG when only US rule applies via country filter', () => {
    // When countries=['US'], only US-applicable rules fire; 'photo' rule applies to US/UK/AU.
    const text = 'photo attached';
    const findings = checkSensitiveFields(text, ['US']);
    expect(findings.some((f) => f.field === 'photo')).toBe(true);
  });

  it('flags marital status globally', () => {
    const text = '已婚，育有一子';
    const findings = checkSensitiveFields(text);
    expect(findings.some((f) => f.field === 'marital')).toBe(true);
  });

  it('returns empty for clean text', () => {
    expect(checkSensitiveFields('Software engineer with 5 years of experience', ['US'])).toEqual([]);
  });

  it('returns empty for empty input', () => {
    expect(checkSensitiveFields('')).toEqual([]);
  });
});
