/**
 * 格式检查与对齐报告
 *
 * 基于规则的结构完整性检查 + JD-简历对齐度计算。
 * 三个指标分开报告，绝不合并为单一"通过率"。
 */

import type { AlignmentReport, KeywordGap, Suggestion } from './types';
import { checkKeywordPresence, extractKeywords } from './jd-parser';
import { generateVerbSuggestions } from './verb-suggester';
import { checkSensitiveFields, type SensitiveFinding } from './sensitive-checker';

export interface GenerateReportInput {
  resumeText: string;
  jdText: string;
  countries?: string[];
}

/**
 * 生成完整的对齐报告
 * 三个指标独立计算、独立展示：
 *   - textAlignment: JD 关键词在简历中的命中比例
 *   - parseability: 简历结构完整性评分（规则驱动）
 *   - fitScore: 招聘方适配度建议（基于敏感字段与规范符合度）
 */
export function generateReport(input: GenerateReportInput): AlignmentReport {
  const { resumeText, jdText, countries } = input;

  // 1. 关键词缺口
  const keywords = extractKeywords(jdText);
  const presence = checkKeywordPresence(keywords, resumeText);

  // 2. 动词改写建议
  const suggestions = generateVerbSuggestions(resumeText);

  // 3. 敏感字段检测
  const sensitiveFindings = checkSensitiveFields(resumeText, countries);

  // 4. 三个分开的指标
  const textAlignment = calculateTextAlignment(presence);
  const parseability = calculateParseability(resumeText);
  const fitScore = calculateFitScore(sensitiveFindings, parseability);

  return {
    textAlignment,
    parseability,
    fitScore,
    generatedAt: new Date().toISOString(),
    suggestions,
    keywordGaps: buildKeywordGaps(presence),
    sensitiveFindings: sensitiveFindings.map((f) => ({
      ruleId: f.ruleId,
      field: f.field,
      message: f.message,
      suggestion: f.suggestion,
      appliesTo: f.appliesTo,
    })),
  };
}

/**
 * 文本对齐度：JD 关键词在简历中的命中比例
 */
function calculateTextAlignment(presence: ReturnType<typeof checkKeywordPresence>): number {
  if (presence.length === 0) return 0;
  const hit = presence.filter((p) => p.presentInResume).length;
  return Math.round((hit / presence.length) * 100);
}

/**
 * 格式可解析度：基于规则的结构完整性评分
 */
function calculateParseability(resumeText: string): number {
  let score = 100;
  const checks: Array<{ condition: boolean; penalty: number; reason: string }> = [
    { condition: resumeText.split(/\n{2,}/).length < 2, penalty: 15, reason: '简历似乎没有分段，建议按区块（教育/经历/技能）组织' },
    { condition: resumeText.length > 6000, penalty: 10, reason: '简历过长，英文简历建议控制在 1–2 页' },
    { condition: !/[A-Za-z]/.test(resumeText), penalty: 30, reason: '简历中未检测到英文字符' },
  ];
  for (const c of checks) {
    if (c.condition) score -= c.penalty;
  }
  return Math.max(0, score);
}

/**
 * 招聘方适配度：敏感字段扣分 + 结构加分
 */
function calculateFitScore(findings: SensitiveFinding[], parseability: number): number {
  const penalty = findings.length * 12;
  return Math.max(0, Math.min(100, parseability - penalty));
}

/**
 * 关键词缺口：分离"JD 要求但简历缺失"的项
 */
function buildKeywordGaps(
  presence: ReturnType<typeof checkKeywordPresence>
): KeywordGap[] {
  return presence
    .filter((p) => !p.presentInResume)
    .slice(0, 15)
    .map((p) => ({
      keyword: p.keyword,
      frequencyInJd: p.frequencyInJd,
      presentInResume: false,
      priority: p.frequencyInJd >= 3 ? 'required' : 'preferred',
    }));
}
