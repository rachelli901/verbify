import { describe, it, expect } from 'vitest';
import { generateReport } from '../src/lib/format-checker';

describe('generateReport — integration', () => {
  it('produces a valid report with separated scores', () => {
    const resume = '负责项目对接，优化系统性能，参与产品设计';
    const jd = 'kafka experience required. distributed systems. must know kafka and distributed systems.';
    const report = generateReport({ resumeText: resume, jdText: jd, countries: ['US', 'SG'] });

    expect(report.textAlignment).toBeGreaterThanOrEqual(0);
    expect(report.textAlignment).toBeLessThanOrEqual(100);
    expect(report.parseability).toBeGreaterThanOrEqual(0);
    expect(report.parseability).toBeLessThanOrEqual(100);
    expect(report.fitScore).toBeGreaterThanOrEqual(0);
    expect(report.fitScore).toBeLessThanOrEqual(100);

    expect(report.suggestions.length).toBeGreaterThan(0);
    expect(report.keywordGaps.length).toBeGreaterThan(0);
    // Sensitive fields: resume has no ID/photo/age, so should be empty
    expect(report.sensitiveFindings.length).toBe(0);
  });

  it('flags ID number as sensitive', () => {
    const resume = '身份证号 110101200001011234，负责项目开发';
    const report = generateReport({ resumeText: resume, jdText: '', countries: ['US'] });
    expect(report.sensitiveFindings.some((f) => f.field === 'id-number')).toBe(true);
  });

  it('does not combine scores into a single pass/fail', () => {
    const report = generateReport({ resumeText: '负责项目', jdText: '', countries: ['US'] });
    // The three metrics must remain independent (this is a design invariant)
    expect(typeof report.textAlignment).toBe('number');
    expect(typeof report.parseability).toBe('number');
    expect(typeof report.fitScore).toBe('number');
    // No 'passRate' or 'atsScore' field should exist
    expect((report as any).passRate).toBeUndefined();
    expect((report as any).atsScore).toBeUndefined();
  });
});
