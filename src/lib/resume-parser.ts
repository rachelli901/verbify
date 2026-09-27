/**
 * 简历文本解析与字段定位
 *
 * 将用户粘贴的简历文本按段落与句子切分，为每条建议提供精确的原文定位。
 */

export interface ResumeBlock {
  block: string;
  index: number;
  sentences: string[];
}

/**
 * 将简历文本切分为段落（块），再切分为句子
 */
export function parseResume(text: string): ResumeBlock[] {
  if (!text.trim()) return [];

  return text
    .split(/\n{2,}/)                     // 按空行分段
    .map((b) => b.trim())
    .filter((b) => b.length > 0)
    .map((block, index) => ({
      block,
      index,
      sentences: splitSentences(block),
    }));
}

/**
 * 句子切分：按句号、分号、换行切分，保留有意义的片段
 */
function splitSentences(block: string): string[] {
  return block
    .split(/(?<=[。；;.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}
