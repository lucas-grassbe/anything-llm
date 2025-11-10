// Lightweight migration: copy any localStorage keys that start with
// `anythingllm_` to `vibranix_` if a `vibranix_` key does not already exist.
// This runs on app startup and is idempotent.
export default function migrateAnythingToVibranix() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;

    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (/^anythingllm_/i.test(k)) keys.push(k);
    }

    if (keys.length === 0) return;

    keys.forEach((oldKey) => {
      try {
        const newKey = oldKey.replace(/^anythingllm_/i, "vibranix_");
        // if there is already a vibranix_* key, don't overwrite it.
        if (window.localStorage.getItem(newKey) == null) {
          const val = window.localStorage.getItem(oldKey);
          if (val != null) window.localStorage.setItem(newKey, val);
        }
      } catch (e) {
        console.error("Error migrating key", oldKey, e);
      }
    });
  } catch (err) {
    // non-fatal
    // eslint-disable-next-line no-console
    console.error("localStorage migration failed:", err);
  }
}
