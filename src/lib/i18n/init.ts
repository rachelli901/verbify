import type { Locale } from './strings';
import { getStrings } from './strings';

const STORAGE_KEY = 'verbify:locale';
const VALID: Locale[] = ['en', 'zh'];

export function getStoredLocale(): Locale {
  if (typeof localStorage === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (VALID as string[]).includes(stored)) {
      return stored as Locale;
    }
  } catch {
    // ignore
  }
  return 'en';
}

export function setStoredLocale(locale: Locale): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // storage disabled / quota exceeded — in-memory value still correct
  }
}

function getByPath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Walk the document for [data-i18n="key"] nodes and fill their textContent
 * from the active dictionary. Used both on first paint and whenever the
 * locale changes, so every .astro page localizes without per-page scripts.
 * Missing keys fall back to the node's existing text (SSR English default).
 */
export function applyI18nToDocument(locale: Locale = getStoredLocale()): void {
  if (typeof document === 'undefined') return;
  const t = getStrings(locale);
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (!key) return;
    const value = getByPath(t as unknown as Record<string, unknown>, key);
    if (typeof value === 'string') node.textContent = value;
  });
  document.documentElement.setAttribute('lang', locale === 'zh' ? 'zh-CN' : 'en');
}

/**
 * Runs inline in <head> before paint to set the html lang attribute
 * from a stored preference, avoiding a flash of the wrong language tag.
 */
export const inlineInitScript = `
(function () {
  try {
    var k = 'verbify:locale';
    var v = localStorage.getItem(k);
    var lang = 'en';
    if (v === 'zh' || v === 'en') lang = v;
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  } catch (e) {
    document.documentElement.setAttribute('lang', 'en');
  }
})();
`;
