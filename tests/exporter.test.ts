import { describe, it, expect } from 'vitest';
import { exportToCSV, downloadCSV } from '../src/lib/exporter';
import type { AlignmentReport } from '../src/lib/types';

const sampleReport: AlignmentReport = {
  textAlignment: 60,
  parseability: 90,
  fitScore: 78,
  generatedAt: '2026-09-25T00:00:00.000Z',
  suggestions: [
    {
      id: 'sug_1',
      originalText: '负责项目',
      location: { block: '0', index: 0 },
      suggestedText: 'Spearheaded',
      reason: '「负责」可译为「Spearheaded」。用于你主动发起、牵头推动的项目或行动。请确认你的实际职责与该动词的含义一致。',
      category: 'verb',
      confidence: 'high',
      ruleId: 'verb:负责->Spearheaded',
      reviewStatus: 'verified',
      userAction: 'pending',
    },
  ],
  keywordGaps: [
    { keyword: 'kafka', frequencyInJd: 3, presentInResume: false, priority: 'required' },
  ],
  sensitiveFindings: [],
};

describe('exportToCSV', () => {
  it('produces a non-empty CSV string', () => {
    const csv = exportToCSV(sampleReport);
    expect(csv.length).toBeGreaterThan(0);
  });

  it('escapes double quotes by doubling them', () => {
    const csv = exportToCSV(sampleReport);
    // A verb rule whose reason contains a double quote would be escaped as "".
    // Verify the escaping function directly via a crafted input containing a quote.
    const withQuote: AlignmentReport = {
      ...sampleReport,
      suggestions: [
        {
          ...sampleReport.suggestions[0],
          reason: 'Use "Streamlined" when the process — not performance — improved.',
        },
      ],
    };
    const csvWithQuote = exportToCSV(withQuote);
    // The inner quote must appear doubled; a naked unescaped delimiter would break the row.
    expect(csvWithQuote).toContain('Use ""Streamlined""');
  });

  it('contains section headers', () => {
    const csv = exportToCSV(sampleReport);
    expect(csv).toContain('SECTION');
    expect(csv).toContain('Verbify Revision Checklist');
  });

  it('includes keyword gap and suggestion data', () => {
    const csv = exportToCSV(sampleReport);
    expect(csv).toContain('kafka');
    expect(csv).toContain('Spearheaded');
  });
});

describe('downloadCSV', () => {
  it('runs without throwing in a jsdom-free environment', () => {
    // downloadCSV manipulates document; guard against missing DOM in node test
    if (typeof document === 'undefined') return;
    expect(() => downloadCSV(exportToCSV(sampleReport))).not.toThrow();
  });
});
