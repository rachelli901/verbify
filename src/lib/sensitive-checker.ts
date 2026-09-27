/**
 * 敏感字段检测引擎
 *
 * 基于规则库检测简历中应避免出现的敏感信息。
 * 规则均为人工审核通过，适用于指定国家/地区场景。
 */

import type { SensitiveRule } from './types';
import { sensitiveRules } from './rules/sensitive';

export interface SensitiveFinding {
  ruleId: string;
  field: SensitiveRule['field'];
  message: string;
  suggestion: string;
  matched: string;
  appliesTo: string[];
}

/**
 * 对简历文本执行敏感字段检测
 * @param text 简历文本
 * @param countries 目标国家列表，未指定则对所有规则检测
 */
export function checkSensitiveFields(
  text: string,
  countries?: string[]
): SensitiveFinding[] {
  if (!text.trim()) return [];

  const findings: SensitiveFinding[] = [];

  for (const rule of sensitiveRules) {
    const applicable = !countries || countries.length === 0
      ? true
      : rule.appliesTo.some((c) => countries.includes(c));

    if (!applicable) continue;

    const match = text.match(rule.pattern);
    if (match) {
      findings.push({
        ruleId: rule.id,
        field: rule.field,
        message: rule.message,
        suggestion: rule.suggestion,
        matched: match[0],
        appliesTo: rule.appliesTo,
      });
    }
  }

  return findings;
}
