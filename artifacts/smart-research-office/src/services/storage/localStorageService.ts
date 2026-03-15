import { Reference } from '../../context/ReferencesContext';

const STORAGE_KEY = 'smart-office-references';

function serializeReferences(refs: Reference[]): string {
  return JSON.stringify(
    refs.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
}

function deserializeReferences(raw: string): Reference[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  } catch {
    return [];
  }
}

export function saveReferences(refs: Reference[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, serializeReferences(refs));
  } catch (err) {
    console.warn('[Storage] Failed to save references:', err);
  }
}

export function loadReferences(): Reference[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return deserializeReferences(raw);
  } catch {
    return [];
  }
}

export function clearReferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export const AI_SETTINGS_KEY = 'smart-office-ai-settings';

export interface AISettings {
  aiEnabled: boolean;
  aiProvider: 'openai' | 'openrouter' | 'gemini' | 'claude';
  apiKey: string;
  fallbackToLocal: boolean;
  networkAvailable: boolean;
}

const getNetworkAvailability = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

export const defaultAISettings: AISettings = {
  aiEnabled: false,
  aiProvider: 'openai',
  apiKey: '',
  fallbackToLocal: true,
  networkAvailable: getNetworkAvailability(),
};

export function saveAISettings(s: AISettings): void {
  try {
    localStorage.setItem(
      AI_SETTINGS_KEY,
      JSON.stringify({
        ...s,
        networkAvailable: getNetworkAvailability(),
      })
    );
  } catch {}
}

export function loadAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (!raw) {
      return { ...defaultAISettings, networkAvailable: getNetworkAvailability() };
    }

    return {
      ...defaultAISettings,
      ...JSON.parse(raw),
      networkAvailable: getNetworkAvailability(),
    };
  } catch {
    return { ...defaultAISettings, networkAvailable: getNetworkAvailability() };
  }
}

