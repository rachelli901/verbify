<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { generateReport } from '../../lib/format-checker';
import type { AlignmentReport } from '../../lib/types';
import { downloadCSV } from '../../lib/exporter';
import { printReport } from '../../lib/print-export';
import { getStrings, type Locale } from '../../lib/i18n/strings';
import { getStoredLocale } from '../../lib/i18n/init';

const resumeText = ref('');
const jdText = ref('');
const countries = ref<string[]>([]);
const report = ref<AlignmentReport | null>(null);
const error = ref('');

const locale = ref<Locale>(getStoredLocale());
const t = ref(getStrings(locale.value));

function refreshLocale() {
  locale.value = getStoredLocale();
  t.value = getStrings(locale.value);
}

function onLocaleChange() {
  refreshLocale();
}

onMounted(() => document.addEventListener('verbify:locale-change', onLocaleChange));
onBeforeUnmount(() => document.removeEventListener('verbify:locale-change', onLocaleChange));

const countryOptions = [
  { code: 'US', label: 'United States' },
  { code: 'UK', label: 'United Kingdom' },
  { code: 'SG', label: 'Singapore' },
  { code: 'MY', label: 'Malaysia' },
  { code: 'ID', label: 'Indonesia' },
  { code: 'AU', label: 'Australia' },
];

function toggleCountry(code: string) {
  const i = countries.value.indexOf(code);
  if (i >= 0) countries.value.splice(i, 1);
  else countries.value.push(code);
}

function appliesToLabel(codes: string[]): string {
  if (!codes || codes.length === 0) return t.value.reviewer.allCountries;
  if (codes.length >= countryOptions.length) return t.value.reviewer.allCountries;
  const labels = codes.map((c) => countryOptions.find((o) => o.code === c)?.label ?? c);
  return labels.join(locale.value === 'zh' ? '、' : ', ');
}

function runReview() {
  error.value = '';
  if (!resumeText.value.trim()) {
    error.value = t.value.reviewer.errorEmpty;
    return;
  }
  report.value = generateReport({
    resumeText: resumeText.value,
    jdText: jdText.value,
    countries: countries.value,
  });
}

function onExportCSV() {
  if (!report.value) return;
  downloadCSV(report.value);
}
</script>

<template>
  <div class="reviewer">
    <p class="notice">
      <strong>Privacy:</strong> {{ t.reviewer.privacyNotice }}
    </p>

    <div class="grid">
      <div class="inputs">
        <label class="block">
          <span>{{ t.reviewer.resumeTitle }}</span>
          <textarea
            v-model="resumeText"
            :placeholder="t.reviewer.resumePlaceholder"
            rows="10"
          ></textarea>
        </label>

        <label class="block">
          <span>{{ t.reviewer.jdTitle }} ({{ t.common.optional }})</span>
          <textarea
            v-model="jdText"
            :placeholder="t.reviewer.jdPlaceholder"
            rows="6"
          ></textarea>
        </label>

        <div class="countries">
          <span class="label">{{ t.reviewer.targetCountries }}</span>
          <div class="chips">
            <button
              v-for="c in countryOptions"
              :key="c.code"
              type="button"
              class="chip"
              :class="{ active: countries.includes(c.code) }"
              @click="toggleCountry(c.code)"
            >
              {{ c.label }}
            </button>
          </div>
          <p v-if="countries.length === 0" class="country-hint">{{ t.reviewer.countriesHint }}</p>
        </div>

        <button type="button" class="primary" @click="runReview">{{ t.reviewer.runReview }}</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <div class="results" v-if="report">
        <h2>{{ t.reviewer.results }}</h2>

        <div class="scores">
          <div class="score">
            <span class="score-label">{{ t.reviewer.scoreAlignment }}</span>
            <span class="score-value">{{ report.textAlignment }}%</span>
            <small>{{ t.reviewer.scoreAlignmentDesc }}</small>
          </div>
          <div class="score">
            <span class="score-label">{{ t.reviewer.scoreParseability }}</span>
            <span class="score-value">{{ report.parseability }}%</span>
            <small>{{ t.reviewer.scoreParseabilityDesc }}</small>
          </div>
          <div class="score">
            <span class="score-label">{{ t.reviewer.scoreFit }}</span>
            <span class="score-value">{{ report.fitScore }}%</span>
            <small>{{ t.reviewer.scoreFitDesc }}</small>
          </div>
        </div>
        <p class="disclaimer">{{ t.reviewer.metricsNote }}</p>

        <section v-if="report.suggestions.length">
          <h3>{{ t.reviewer.verbSuggestions }}</h3>
          <div v-for="s in report.suggestions" :key="s.id" class="suggestion">
            <p class="original">{{ s.originalText }}</p>
            <p class="suggested">→ {{ s.suggestedText }}</p>
            <p class="reason">{{ s.reason }}</p>
          </div>
        </section>

        <section v-if="report.keywordGaps.length">
          <h3>{{ t.reviewer.keywordGaps }}</h3>
          <ul>
            <li v-for="g in report.keywordGaps" :key="g.keyword">
              <strong>{{ g.keyword }}</strong>
              <span class="meta">{{ g.frequencyInJd }}× in JD · {{ g.priority }}</span>
            </li>
          </ul>
        </section>

        <section v-if="report.sensitiveFindings.length">
          <h3>{{ t.reviewer.sensitiveFields }}</h3>
          <div v-for="f in report.sensitiveFindings" :key="f.ruleId" class="sensitive">
            <p><strong>{{ f.field }}</strong> — {{ f.message }}</p>
            <p>{{ f.suggestion }}</p>
            <p class="applies">{{ t.reviewer.appliesTo }}: {{ appliesToLabel(f.appliesTo) }}</p>
          </div>
        </section>

        <div class="actions">
          <button type="button" class="primary" @click="onExportCSV">{{ t.reviewer.exportCsv }}</button>
          <button type="button" @click="printReport(report)">{{ t.reviewer.print }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviewer { max-width: 1000px; margin: 0 auto; }
.notice {
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;
  padding: .75rem 1rem; font-size: .9rem; color: #166534; margin-bottom: 1.5rem;
}
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
.block { display: block; margin-bottom: 1rem; }
.block span { display: block; font-weight: 600; margin-bottom: .35rem; }
textarea {
  width: 100%; padding: .65rem; border: 1px solid #d1d5db; border-radius: 6px;
  font-family: inherit; font-size: .95rem; resize: vertical; box-sizing: border-box;
}
textarea:focus { outline: 2px solid #2563eb; outline-offset: 1px; }
.countries { margin: 1rem 0; }
.countries .label { font-weight: 600; }
.chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .5rem; }
.chip {
  padding: .35rem .8rem; border: 1px solid #d1d5db; border-radius: 999px; background: #fff;
  cursor: pointer; font-size: .85rem;
}
.chip.active { background: #2563eb; color: #fff; border-color: #2563eb; }
.country-hint { font-size: .8rem; color: #b45309; margin: .6rem 0 0; }
button.primary {
  background: #2563eb; color: #fff; border: none; padding: .65rem 1.25rem; border-radius: 6px;
  cursor: pointer; font-weight: 600; font-size: .95rem;
}
button.primary:hover { background: #1d4ed8; }
button:not(.primary) {
  background: #fff; border: 1px solid #d1d5db; padding: .65rem 1.25rem; border-radius: 6px; cursor: pointer;
}
.error { color: #dc2626; margin-top: .5rem; }
.results h2 { margin-top: 0; }
.scores { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; }
.score {
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; text-align: center;
}
.score-label { display: block; font-size: .85rem; color: #64748b; }
.score-value { display: block; font-size: 2rem; font-weight: 700; color: #2563eb; }
.score small { color: #94a3b8; font-size: .7rem; }
.disclaimer { font-size: .8rem; color: #94a3b8; margin-bottom: 1.5rem; }
section { margin-bottom: 1.5rem; }
section h3 { font-size: 1rem; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: .35rem; }
.suggestion { padding: .75rem 0; border-bottom: 1px solid #f1f5f9; }
.original { margin: 0 0 .25rem; color: #64748b; font-style: italic; font-size: .9rem; }
.suggested { margin: 0 0 .25rem; font-weight: 600; color: #2563eb; }
.reason { margin: 0; font-size: .85rem; color: #475569; }
ul { padding-left: 1.25rem; }
li { margin-bottom: .5rem; }
.meta { color: #94a3b8; font-size: .85rem; }
.sensitive { background: #fef2f2; border-left: 3px solid #dc2626; padding: .75rem 1rem; margin-bottom: .5rem; border-radius: 0 4px 4px 0; font-size: .9rem; }
.sensitive p { margin: 0 0 .25rem; }
.sensitive .applies { font-size: .78rem; color: #b45309; margin-top: .35rem; }
.actions { display: flex; gap: .75rem; margin-top: 1.5rem; }
</style>
