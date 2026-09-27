/**
 * 动词改写建议引擎
 *
 * 基于动词对照表（人工审核）给出改写建议。
 * 不做翻译，只做"识别中文动词 → 给出英文候选 + 使用理由"。
 */

import type { Suggestion, SuggestionCategory } from './types';
import { verbIndex, verbTable } from './rules/verbs';
import { parseResume, type ResumeBlock } from './resume-parser';

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `sug_${Date.now()}_${idCounter}`;
}

/**
 * 对简历文本生成动词改写建议
 */
export function generateVerbSuggestions(resumeText: string): Suggestion[] {
  const blocks = parseResume(resumeText);
  const suggestions: Suggestion[] = [];

  for (const block of blocks) {
    for (const sentence of block.sentences) {
      const matches = findVerbMatches(sentence);
      for (const match of matches) {
        suggestions.push({
          id: nextId(),
          originalText: sentence,
          location: { block: String(block.index), index: 0 },
          suggestedText: match.en,
          reason: buildReason(match.zh, match.en, match.whenToUse, match.avoidWhen),
          category: 'verb',
          confidence: 'high',
          ruleId: `verb:${match.zh}->${match.en}`,
          reviewStatus: 'verified',
          userAction: 'pending',
        });
      }
    }
  }

  return suggestions;
}

/**
 * 在句子中查找匹配的中文动词
 */
function findVerbMatches(sentence: string): typeof verbTable {
  const matched: typeof verbTable = [];
  for (const zh of Object.keys(verbIndex)) {
    if (sentence.includes(zh)) {
      matched.push(...verbIndex[zh]);
    }
  }
  return matched;
}

/**
 * 构造修改理由（面向非母语者，用中文解释）
 */
function buildReason(
  zh: string,
  en: string,
  whenToUse: string,
  avoidWhen?: string
): string {
  let reason = `「${zh}」可译为「${en}」。${whenToUse}。`;
  if (avoidWhen) reason += ` ${avoidWhen}。`;
  reason += '请确认你的实际职责与该动词的含义一致，避免夸大或低估。';
  return reason;
}
