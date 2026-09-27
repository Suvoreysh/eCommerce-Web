/**
 * Simple in-memory API cache with ETag / Last-Modified support.
 * - Stores the last response data + a cache-key (etag or timestamp).
 * - On subsequent fetches the caller can compare to decide whether to
 *   re-render or skip the update.
 * - TTL-based expiry for endpoints that don't send cache headers.
 */

const store = new Map(); // key -> { data, etag, ts, ttl }

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.ttl && Date.now() > entry.ts + entry.ttl) {
    store.delete(key);
    return null;
  }
  return entry;
}

export function cacheSet(key, data, { etag = null, ttl = null } = {}) {
  store.set(key, { data, etag, ts: Date.now(), ttl });
}

export function cacheInvalidate(key) {
  store.delete(key);
}

export function cacheInvalidatePrefix(prefix) {
  for (const k of store.keys()) {
    if (k.startsWith(prefix)) store.delete(k);
  }
}

export function cacheClear() {
  store.clear();
}
