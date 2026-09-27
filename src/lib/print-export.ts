/**
 * 可打印 HTML 导出
 *
 * 用于浏览器打印生成 PDF，纯客户端、零成本。
 */

import type { AlignmentReport } from './types';

export function exportPrintableHTML(report: AlignmentReport): string {
  const rows = (label: string, value: string) => `
    <div class="print-row">
      <span class="print-label">${label}</span>
      <span class="print-value">${value}</span>
    </div>`;

  const suggestionRows = report.suggestions
    .map(
      (s) => `
    <div class="print-suggestion">
      <p class="print-original">${escapeHtml(s.originalText)}</p>
      <p class="print-suggested">→ ${escapeHtml(s.suggestedText)}</p>
      <p class="print-reason">${escapeHtml(s.reason)}</p>
    </div>`
    )
    .join('');

  const gapRows = report.keywordGaps
    .map(
      (g) => `
    <li>${escapeHtml(g.keyword)} <span class="print-meta">(${g.frequencyInJd}×, ${g.priority})</span></li>`
    )
    .join('');

  const sensitiveRows = report.sensitiveFindings
    .map(
      (f) => `
    <div class="print-sensitive">
      <p><strong>${f.field}</strong> — ${escapeHtml(f.message)}</p>
      <p>${escapeHtml(f.suggestion)}</p>
    </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Verbify Revision Checklist</title>
<style>
  body { font-family: -apple-system, "Segoe UI", sans-serif; color: #1a1a1a; max-width: 820px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.6; }
  h1 { font-size: 1.5rem; border-bottom: 2px solid #2563eb; padding-bottom: .5rem; }
  h2 { font-size: 1.1rem; margin-top: 2rem; color: #2563eb; }
  .print-row { display: flex; padding: .35rem 0; border-bottom: 1px solid #eee; }
  .print-label { width: 200px; color: #666; }
  .print-suggestion { padding: .75rem 0; border-bottom: 1px solid #eee; }
  .print-original { margin: 0 0 .25rem; color: #666; font-style: italic; }
  .print-suggested { margin: 0 0 .25rem; font-weight: 600; color: #2563eb; }
  .print-reason { margin: 0; font-size: .9rem; color: #444; }
  .print-sensitive { padding: .75rem 0; border-bottom: 1px solid #fee2e2; background: #fef2f2; padding: .75rem; border-radius: 4px; margin: .5rem 0; }
  ul { padding-left: 1.25rem; }
  .print-meta { color: #888; font-size: .85rem; }
  @page { margin: 2cm; }
</style>
</head>
<body>
  <h1>Verbify — Revision Checklist</h1>
  <p class="print-meta">Generated: ${report.generatedAt}</p>

  <h2>Scores</h2>
  ${rows('Text Alignment', report.textAlignment + '%')}
  ${rows('Parseability', report.parseability + '%')}
  ${rows('Fit Score', report.fitScore + '%')}

  <h2>Verb Suggestions</h2>
  ${suggestionRows || '<p class="print-meta">No verb suggestions generated.</p>'}

  <h2>Keyword Gaps</h2>
  ${gapRows ? `<ul>${gapRows}</ul>` : '<p class="print-meta">No keyword gaps found.</p>'}

  <h2>Sensitive Fields</h2>
  ${sensitiveRows || '<p class="print-meta">No sensitive fields detected.</p>'}

  <p style="margin-top:2rem;color:#888;font-size:.8rem;">
    Verbify provides revision suggestions only. Final content decisions are yours. This is not legal, immigration or visa advice.
  </p>
</body>
</html>`;
}

export function printReport(report: AlignmentReport): void {
  const html = exportPrintableHTML(report);
  const win = window.open('', '_blank', 'width=820,height=1000');
  if (!win) {
    alert('Please allow pop-ups to print the checklist.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
