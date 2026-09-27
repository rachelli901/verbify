/**
 * JD 关键词提取引擎
 *
 * 策略：基于词频统计 + 停用词过滤 + 短语提取。
 * 无 AI、纯前端、确定性结果。
 */

const STOPWORDS = new Set([
  // 英文停用词
  'the','a','an','and','or','but','in','on','at','to','of','for','with','by',
  'is','are','was','were','be','been','being','have','has','had','do','does','did',
  'will','would','should','could','may','might','can','shall','must','need','know',
  'we','you','they','it','this','that','these','those','our','your','their','its',
  'as','if','than','then','so','such','also','more','most','other','some','any',
  'about','into','through','during','before','after','above','below','up','out',
  'from','off','over','under','again','further','once','here','there','when','where',
  'what','who','how','why','all','each','few','both','either','neither','only','own',
  'same','than','too','very','just','now','way','even','back','still','well','also',
  // 中文停用词
  '的','了','和','与','及','或','在','是','有','对','为','从','到','把','被','将',
  '我们','你','他们','这个','那个','一种','可以','需要','能够','通过','进行','作为',
  '公司','岗位','职位','负责','相关','工作','要求','职责','任职','条件','以上',
]);

const MIN_LENGTH = 2;

/**
 * 从 JD 文本中提取关键词候选
 * 返回去重后的关键词及其出现频次，按频次降序
 */
export function extractKeywords(jdText: string): Array<{ keyword: string; count: number }> {
  if (!jdText.trim()) return [];

  // 统一处理：保留字母、数字、空格与少量符号，其余按分隔符处理
  const tokens = jdText
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.一-龥]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= MIN_LENGTH && !STOPWORDS.has(t));

  // 2-gram 短语提取（捕捉如 "machine learning"、"data analysis"）
  const phrases: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    const phrase = `${tokens[i]} ${tokens[i + 1]}`;
    if (!STOPWORDS.has(tokens[i]) && !STOPWORDS.has(tokens[i + 1])) {
      phrases.push(phrase);
    }
  }

  const counts = new Map<string, number>();
  for (const t of [...tokens, ...phrases]) {
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }

  // 过滤低频噪声，保留出现 2 次以上或长度 >= 4 的 token
  return Array.from(counts.entries())
    .filter(([k, v]) => v >= 2 || k.length >= 4 || k.includes(' '))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([keyword, count]) => ({ keyword, count }));
}

/**
 * 判断关键词是否出现在简历文本中
 */
export function checkKeywordPresence(
  keywords: Array<{ keyword: string; count: number }>,
  resumeText: string
): Array<{ keyword: string; frequencyInJd: number; presentInResume: boolean }> {
  const lower = resumeText.toLowerCase();
  return keywords.map(({ keyword, count }) => ({
    keyword,
    frequencyInJd: count,
    presentInResume: lower.includes(keyword.toLowerCase()),
  }));
}
