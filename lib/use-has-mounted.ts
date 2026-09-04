import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}
function getSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

/**
 * true فقط بعد از هیدریت شدن روی کلاینت — برای خواندن state هایی که فقط در
 * مرورگر معنا دارند (localStorage از طریق zustand persist)، بدون اینکه سرور
 * و کلاینت در اولین رندر با هم ناسازگار شوند (hydration mismatch).
 * جایگزین الگوی قدیمی‌ترِ useState(false) + useEffect(() => setState(true))
 * که با قانون jsdocs react-hooks/set-state-in-effect دیگر توصیه نمی‌شود.
 */
export function useHasMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
