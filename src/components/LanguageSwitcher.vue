<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { LOCALES, type Locale } from '../lib/i18n/strings';

const isOpen = ref(false);
const current = ref<Locale>('en');
const wrapper = ref<HTMLElement | null>(null);

function getStored(): Locale {
  if (typeof localStorage === 'undefined') return 'en';
  try {
    const v = localStorage.getItem('verbify:locale');
    return v === 'zh' || v === 'en' ? v : 'en';
  } catch {
    return 'en';
  }
}

function setStored(locale: Locale) {
  try {
    localStorage.setItem('verbify:locale', locale);
  } catch {
    // 存储被禁用时静默失败，本次会话内存中的值仍然有效
  }
}

function select(code: Locale) {
  current.value = code;
  setStored(code);
  document.documentElement.setAttribute('lang', code === 'zh' ? 'zh-CN' : 'en');
  document.dispatchEvent(new CustomEvent('verbify:locale-change'));
  isOpen.value = false;
}

function toggle() {
  isOpen.value = !isOpen.value;
}

function handleClickOutside(event: MouseEvent) {
  if (wrapper.value && !wrapper.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') isOpen.value = false;
}

onMounted(() => {
  current.value = getStored();
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="language-switcher" ref="wrapper">
    <button
      type="button"
      class="language-switcher__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      aria-label="Choose language"
      @click="toggle"
    >
      <svg
        class="language-switcher__globe"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span class="language-switcher__current">
        {{ LOCALES.find((l) => l.code === current)?.nativeLabel ?? 'English' }}
      </span>
      <svg
        class="language-switcher__chevron"
        :class="{ 'language-switcher__chevron--open': isOpen }"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <ul
      v-show="isOpen"
      class="language-switcher__menu"
      role="listbox"
      tabindex="-1"
    >
      <li
        v-for="locale in LOCALES"
        :key="locale.code"
        class="language-switcher__option"
        :class="{ 'language-switcher__option--active': locale.code === current }"
        role="option"
        :aria-selected="locale.code === current"
        tabindex="0"
        @click="select(locale.code)"
        @keydown.enter.prevent="select(locale.code)"
        @keydown.space.prevent="select(locale.code)"
      >
        <span class="language-switcher__option-label">{{ locale.nativeLabel }}</span>
        <span v-if="locale.code === current" class="language-switcher__check" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </li>
    </ul>
  </div>
</template>

<style>
.language-switcher {
  position: relative;
}

.language-switcher__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font: inherit;
  font-size: 0.875rem;
  color: var(--color-text, #1a1a1a);
  background: transparent;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.language-switcher__trigger:hover,
.language-switcher__trigger:focus-visible {
  background: var(--color-surface-hover, #f1f5f9);
  border-color: var(--color-border-strong, #cbd5e1);
  outline: none;
}

.language-switcher__trigger:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}

.language-switcher__globe {
  flex-shrink: 0;
  opacity: 0.7;
}

.language-switcher__current {
  white-space: nowrap;
}

.language-switcher__chevron {
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.language-switcher__chevron--open {
  transform: rotate(180deg);
}

.language-switcher__menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  min-width: 9rem;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  background: var(--color-bg, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.06);
  z-index: 50;
}

.language-switcher__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.625rem;
  font-size: 0.875rem;
  color: var(--color-text, #1a1a1a);
  border-radius: 0.375rem;
  cursor: pointer;
  user-select: none;
}

.language-switcher__option:hover,
.language-switcher__option:focus-visible {
  background: var(--color-surface-hover, #f1f5f9);
  outline: none;
}

.language-switcher__option--active {
  font-weight: 600;
}

.language-switcher__option-label {
  white-space: nowrap;
}

.language-switcher__check {
  display: inline-flex;
  align-items: center;
  color: var(--color-brand, #2563eb);
}

@media (max-width: 640px) {
  .language-switcher__current {
    display: none;
  }
  .language-switcher__trigger {
    padding: 0.5rem;
  }
}
</style>