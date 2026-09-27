import type { SensitiveRule } from '../types';

/**
 * 敏感字段规则库 —— 检测简历中在英文简历场景下通常应避免的内容
 *
 * 英文简历（尤其 US/UK 场景）一般不写：照片、年龄、婚育、身份证号、详细住址、性别。
 * SG/MY 场景相对宽松，但身份证号（NRIC）仍应避免。
 *
 * 所有规则均为人工审核通过。规则仅做提示，最终决定权在用户。
 */

const ALL = ['US', 'UK', 'SG', 'MY', 'ID', 'AU'];

export const sensitiveRules: SensitiveRule[] = [
  {
    id: 'sensitive:photo',
    pattern: /(照片|头像|证件照|近照|photo|photograph)/i,
    field: 'photo',
    message: '简历中出现照片。在 US/UK 求职场景中，简历通常不放照片，以避免无意识偏见。',
    suggestion: '建议移除照片，改用纯文本简历。SG/MY 部分本地企业可能接受，但国际岗位建议不放。',
    appliesTo: ['US', 'UK', 'AU'],
  },
  {
    id: 'sensitive:age',
    pattern: /(年龄|岁|出生年月|出生日期|\bage\b|\bdob\b|\bborn\b)/i,
    field: 'age',
    message: '简历中出现年龄或出生日期信息。US/UK 简历不应包含年龄，以免年龄歧视。',
    suggestion: '建议移除年龄与出生日期。可用年份区间表达经验（如 "8+ years of experience"）。',
    appliesTo: ['US', 'UK', 'AU'],
  },
  {
    id: 'sensitive:marital',
    pattern: /(已婚|未婚|婚姻状况|配偶|marital|single|married)/i,
    field: 'marital',
    message: '简历中出现婚姻状况。这属于与工作无关的个人隐私信息。',
    suggestion: '建议移除婚姻状况。',
    appliesTo: ALL,
  },
  {
    id: 'sensitive:id-cn',
    pattern: /(\d{17}[\dXx])/,
    field: 'id-number',
    message: '简历中出现疑似中国大陆身份证号码（18 位数字）。',
    suggestion: '建议立即移除。身份证号属于高度敏感信息，不应出现在简历或上传至任何在线工具。',
    appliesTo: ALL,
  },
  {
    id: 'sensitive:id-nric',
    pattern: /(\b[A-Z]\d{6,7}[A-Z]\b)/,
    field: 'id-number',
    message: '简历中出现疑似新加坡 NRIC 号码格式。',
    suggestion: '建议移除。NRIC 属于敏感身份信息，除特定法定情形外不应在简历中出现。',
    appliesTo: ['SG'],
  },
  {
    id: 'sensitive:address',
    pattern: /(详细地址|现居|户籍|家庭住址|home address|permanent address)/i,
    field: 'address',
    message: '简历中出现详细住址或户籍信息。',
    suggestion: '建议只保留城市与国家（如 "Based in Singapore"），移除详细街道地址。',
    appliesTo: ['US', 'UK', 'AU'],
  },
  {
    id: 'sensitive:gender',
    pattern: /(性别|男|女|gender|male|female)/i,
    field: 'gender',
    message: '简历中出现性别信息。这属于与工作无关的个人隐私信息。',
    suggestion: '建议移除性别。',
    appliesTo: ALL,
  },
  {
    id: 'sensitive:nationality',
    pattern: /(国籍|民族|race|ethnicity)/i,
    field: 'nationality',
    message: '简历中出现国籍或民族信息。',
    suggestion: '除签证/工签要求外，一般不在简历中注明国籍与民族。',
    appliesTo: ['US', 'UK', 'AU'],
  },
];
