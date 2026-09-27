import type { VerbEntry } from '../types';

/**
 * 动词对照表 —— Verbify 的核心资产
 *
 * 每条记录均为人工审核通过（reviewStatus: 'verified'）。
 * 此表替代 AI 生成：所有动词改写建议均来自此处，
 * 确保不篡改原意、不虚构资质、不改变动作级别。
 */
export const verbTable: VerbEntry[] = [
  {
    zh: '负责',
    en: 'Spearheaded',
    whenToUse: '用于你主动发起、牵头推动的项目或行动，强调"由你启动"。区别于 Led（仅表示带领团队）',
    avoidWhen: '如果你只是接手一个已有项目并维护，用 Maintained 或 Managed 更准确',
    strength: 'initiative',
    example: 'Spearheaded the migration to a microservice architecture, reducing latency by 40%',
    reviewStatus: 'verified',
  },
  {
    zh: '负责',
    en: 'Led',
    whenToUse: '用于你带领团队完成某项工作，强调团队领导与协调',
    avoidWhen: '如果项目由他人发起，你只负责执行，用 Executed 或 Delivered',
    strength: 'management',
    example: 'Led a cross-functional team of 8 to deliver the Q3 product roadmap on schedule',
    reviewStatus: 'verified',
  },
  {
    zh: '对接',
    en: 'Liaised with',
    whenToUse: '用于你作为接口人，协调内外部多方（客户、供应商、其他部门）',
    avoidWhen: '如果是双向同步信息，用 Coordinated 更中性',
    strength: 'collaboration',
    example: 'Liaised with product, design and engineering teams to align quarterly priorities',
    reviewStatus: 'verified',
  },
  {
    zh: '优化',
    en: 'Streamlined',
    whenToUse: '用于优化流程或系统使其更高效，强调"简化并提速"',
    avoidWhen: '如果是提升性能（非流程），用 Optimized',
    strength: 'initiative',
    example: 'Streamlined the deployment pipeline, cutting release cycle from 3 days to 4 hours',
    reviewStatus: 'verified',
  },
  {
    zh: '优化',
    en: 'Optimized',
    whenToUse: '用于提升系统、算法、数据库等的性能或效率',
    avoidWhen: '如果是流程简化，用 Streamlined',
    strength: 'initiative',
    example: 'Optimized database queries, improving response time by 60%',
    reviewStatus: 'verified',
  },
  {
    zh: '参与',
    en: 'Contributed to',
    whenToUse: '用于你作为团队成员做出了可衡量的贡献，但非主导者',
    avoidWhen: '如果你主导了，用 Led 或 Spearheaded，否则低估自己',
    strength: 'collaboration',
    example: 'Contributed to the redesign of the checkout flow, lifting conversion by 12%',
    reviewStatus: 'verified',
  },
  {
    zh: '开发',
    en: 'Developed',
    whenToUse: '用于从零开发某个功能、模块或系统',
    avoidWhen: '如果是维护已有系统，用 Maintained',
    strength: 'management',
    example: 'Developed an internal tooling platform used by 200+ engineers daily',
    reviewStatus: 'verified',
  },
  {
    zh: '搭建',
    en: 'Built',
    whenToUse: '用于搭建系统、平台、框架等，语气直接、结果导向',
    avoidWhen: '如果是基于现有方案组装，用 Integrated 或 Configured',
    strength: 'initiative',
    example: 'Built a real-time analytics dashboard processing 10M events per day',
    reviewStatus: 'verified',
  },
  {
    zh: '提升',
    en: 'Improved',
    whenToUse: '通用词，用于提升某指标、体验或质量，需配量化结果',
    avoidWhen: '如果没有量化结果，补充量化；否则改为更具体的动词',
    strength: 'initiative',
    example: 'Improved onboarding completion rate from 45% to 78% within two quarters',
    reviewStatus: 'verified',
  },
  {
    zh: '实现',
    en: 'Implemented',
    whenToUse: '用于落地某个技术方案、算法或功能',
    avoidWhen: '如果是设计后再实现，可与 Designed 搭配使用',
    strength: 'management',
    example: 'Implemented a recommendation algorithm that increased click-through rate by 18%',
    reviewStatus: 'verified',
  },
  {
    zh: '设计',
    en: 'Designed',
    whenToUse: '用于你主导的设计工作（架构、系统、方案）',
    avoidWhen: '如果只是出图，用 Created；如果是交互设计，用 Prototyped',
    strength: 'initiative',
    example: 'Designed a scalable event-driven architecture supporting 5M concurrent users',
    reviewStatus: 'verified',
  },
  {
    zh: '推动',
    en: 'Drove',
    whenToUse: '用于推动某个结果达成，强调你的主动性',
    avoidWhen: '如果结果是团队自然达成，用 Supported 更诚实',
    strength: 'initiative',
    example: 'Drove the adoption of automated testing, raising coverage from 40% to 85%',
    reviewStatus: 'verified',
  },
  {
    zh: '协调',
    en: 'Coordinated',
    whenToUse: '用于协调多方资源或时间线',
    avoidWhen: '如果是正式带领团队，用 Led',
    strength: 'collaboration',
    example: 'Coordinated release schedules across 4 engineering teams',
    reviewStatus: 'verified',
  },
  {
    zh: '分析',
    en: 'Analyzed',
    whenToUse: '用于数据分析、问题诊断、调研',
    avoidWhen: '如果是做决定，用 Decided 或 Recommended',
    strength: 'collaboration',
    example: 'Analyzed user behavior data to identify drop-off points in the signup funnel',
    reviewStatus: 'verified',
  },
  {
    zh: '解决',
    en: 'Resolved',
    whenToUse: '用于解决具体问题或故障',
    avoidWhen: '如果是预防，用 Prevented',
    strength: 'management',
    example: 'Resolved critical payment gateway issues, restoring service within 30 minutes',
    reviewStatus: 'verified',
  },
  {
    zh: '制定',
    en: 'Established',
    whenToUse: '用于建立规范、流程、制度',
    avoidWhen: '如果是短期计划，用 Planned',
    strength: 'initiative',
    example: 'Established the team\'s code review standards and CI/CD workflow',
    reviewStatus: 'verified',
  },
  {
    zh: '维护',
    en: 'Maintained',
    whenToUse: '用于维护已有系统、文档、关系',
    avoidWhen: '如果是从零开发，用 Built 或 Developed',
    strength: 'management',
    example: 'Maintained a legacy billing system serving 1M+ active users with 99.9% uptime',
    reviewStatus: 'verified',
  },
  {
    zh: '协助',
    en: 'Supported',
    whenToUse: '用于支持他人或团队达成目标，定位清晰不夸大',
    avoidWhen: '如果贡献很大，用 Contributed to 或 Co-led',
    strength: 'collaboration',
    example: 'Supported the sales team in technical due diligence for enterprise deals',
    reviewStatus: 'verified',
  },
  {
    zh: '培训',
    en: 'Trained',
    whenToUse: '用于培训新人、客户或团队',
    avoidWhen: '如果是编写培训材料，用 Authored training materials',
    strength: 'management',
    example: 'Trained 15 new engineers on the internal platform within 6 months',
    reviewStatus: 'verified',
  },
  {
    zh: '降低',
    en: 'Reduced',
    whenToUse: '用于降低某项成本、风险或耗时，必须配量化',
    avoidWhen: '如果没有量化，补充；否则改为 Mitigated',
    strength: 'initiative',
    example: 'Reduced cloud infrastructure costs by 30% through resource optimization',
    reviewStatus: 'verified',
  },
];

/**
 * 高频中文动词 → 英文候选索引
 * 用于快速查找给定中文词的候选英文动词
 */
export const verbIndex: Record<string, VerbEntry[]> = verbTable.reduce((acc, entry) => {
  if (!acc[entry.zh]) acc[entry.zh] = [];
  acc[entry.zh].push(entry);
  return acc;
}, {} as Record<string, VerbEntry[]>);

/**
 * 所有英文动词（原形）集合，用于简历文本中的动词检测
 */
export const englishVerbs: string[] = Array.from(
  new Set(verbTable.map((v) => v.en.toLowerCase()))
);
