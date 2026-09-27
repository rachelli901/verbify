/**
 * Verbify 核心数据模型
 * 全站基于规则引擎，无 AI、无后端、无数据外传
 */

export type SuggestionCategory =
  | 'verb'          // 动词化
  | 'quantify'      // 补充量化
  | 'sensitive'     // 敏感字段
  | 'format'        // 格式规范
  | 'tense'         // 时态 / 语态
  | 'clarity';      // 表述清晰度

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type ReviewStatus = 'verified' | 'draft';

export interface VerbEntry {
  /** 中文原词 */
  zh: string;
  /** 英文动词原形 */
  en: string;
  /** 适用场景：什么时候用这个动词 */
  whenToUse: string;
  /** 不适用场景：什么时候不要用 */
  avoidWhen?: string;
  /** 强度等级：发起型 / 管理型 / 协作型 */
  strength: 'initiative' | 'management' | 'collaboration';
  /** 示例 */
  example: string;
  /** 审核状态：规则均为人工审核通过 */
  reviewStatus: ReviewStatus;
}

export interface SensitiveRule {
  /** 规则 ID */
  id: string;
  /** 匹配正则（在用户文本中检测） */
  pattern: RegExp;
  /** 命中的内容类型 */
  field: 'photo' | 'age' | 'marital' | 'id-number' | 'address' | 'gender' | 'nationality';
  /** 提示文案（面向用户） */
  message: string;
  /** 建议动作 */
  suggestion: string;
  /** 适用国家：true 表示在所有国家都建议移除 */
  appliesTo: string[];
}

export interface KeywordGap {
  keyword: string;
  frequencyInJd: number;
  presentInResume: boolean;
  priority: 'required' | 'preferred';
}

export interface Suggestion {
  id: string;
  originalText: string;
  location: { block: string; index: number };
  /** 规则引擎给出的修改建议文本 */
  suggestedText: string;
  reason: string;
  category: SuggestionCategory;
  /** 规则引擎置信度：基于正则/词典命中，确定性高于模型自评 */
  confidence: ConfidenceLevel;
  /** 规则来源标识 */
  ruleId: string;
  reviewStatus: ReviewStatus;
  userAction: 'pending' | 'accept' | 'reject';
}

export interface AlignmentReport {
  /** 文本对齐度：JD 关键词在简历中命中的比例 */
  textAlignment: number;
  /** 格式可解析度：基于规则的结构完整性评分 */
  parseability: number;
  /** 招聘方适配度建议：基于敏感字段与规范符合度 */
  fitScore: number;
  /** 三个指标绝不合并为单一"通过率" */
  generatedAt: string;
  suggestions: Suggestion[];
  keywordGaps: KeywordGap[];
  sensitiveFindings: Array<{
    ruleId: string;
    field: SensitiveRule['field'];
    message: string;
    suggestion: string;
    appliesTo: string[];
  }>;
}

export interface GuideFrontmatter {
  title: string;
  description: string;
  applicableCountries: string[];
  careerStage: string[];
  lastReviewed: string;
  author: string;
  isExampleFictional: boolean;
  disclaimer: string;
}
