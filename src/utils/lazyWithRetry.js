import { lazy } from 'react';
import { clearChunkReloadGuard } from '@/utils/chunkErrorRecovery';

const DEFAULT_DELAYS_MS = [350, 1000];

export function isDynamicImportError(error) {
  const message = String(error?.message || error || '').toLowerCase();
  return (
    message.includes('dynamically imported module') ||
    message.includes('failed to fetch') ||
    message.includes('loading chunk') ||
    message.includes('chunkloaderror') ||
    message.includes('importing a module script failed')
  );
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function retryDynamicImport(importer, delaysMs = DEFAULT_DELAYS_MS) {
  let lastError;

  for (let attempt = 0; attempt <= delaysMs.length; attempt += 1) {
    try {
      const mod = await importer();
      // Chunk'lar sağlıklı yükleniyor → otomatik yeniden yükleme sayacını sıfırla.
      clearChunkReloadGuard();
      return mod;
    } catch (error) {
      lastError = error;
      if (!isDynamicImportError(error) || attempt === delaysMs.length) throw error;
      await wait(delaysMs[attempt]);
    }
  }

  throw lastError;
}

export function lazyWithRetry(importer, delaysMs) {
  return lazy(() => retryDynamicImport(importer, delaysMs));
}
