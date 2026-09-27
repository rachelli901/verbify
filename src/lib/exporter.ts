/**
 * 修订清单导出（客户端 CSV）
 *
 * 零服务端、零成本、不回传数据。
 */

import type { AlignmentReport } from './types';

/**
 * 将报告导出为 CSV 文本
 */
export function exportToCSV(report: AlignmentReport): string {
  const rows: string[][] = [];

  rows.push(['Verbify Revision Checklist']);
  rows.push([`Generated at: ${report.generatedAt}`]);
  rows.push([]);

  rows.push(['SECTION', 'FIELD', 'VALUE', 'PRIORITY / DETAIL']);
  rows.push(['Scores', 'Text Alignment', `${report.textAlignment}%`, 'JD keywords present in resume']);
  rows.push(['Scores', 'Parseability', `${report.parseability}%`, 'Resume structure completeness']);
  rows.push(['Scores', 'Fit Score', `${report.fitScore}%`, 'Recruiter fit (sensitive fields adjusted)']);
  rows.push([]);

  rows.push(['KEYWORD GAPS', 'Keyword', 'JD Frequency', 'Priority']);
  for (const gap of report.keywordGaps) {
    rows.push(['Keyword Gap', gap.keyword, String(gap.frequencyInJd), gap.priority]);
  }
  rows.push([]);

  rows.push(['VERB SUGGESTIONS', 'Original', 'Suggested', 'Reason']);
  for (const s of report.suggestions) {
    rows.push(['Suggestion', s.originalText, s.suggestedText, s.reason]);
  }
  rows.push([]);

  rows.push(['SENSITIVE FIELDS', 'Field', 'Message', 'Suggestion']);
  for (const f of report.sensitiveFindings) {
    rows.push(['Sensitive', f.field, f.message, f.suggestion]);
  }

  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');
}

/**
 * 触发浏览器下载
 */
export function downloadCSV(csv: string, filename = 'verbify-checklist.csv'): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
