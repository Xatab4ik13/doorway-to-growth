// Яндекс.Метрика — по счётчику на домен.
// Добавьте номера счётчиков для остальных доменов по мере их создания.
const COUNTERS: Record<string, number> = {
  "brandoors.moscow": 111216423,
  "brandoors.online": 111216525,
  "brandoors.store": 111216544,
  "brandoors.pro": 111216560,
  "brandoors.su": 111216583,
};

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
    [key: string]: unknown;
  }
}

let counterId: number | null = null;

function resolveCounter(): number | null {
  const host = window.location.hostname.replace(/^www\./, "");
  // CRM и превью не трекаем
  if (host === "crm.brandoors.su") return null;
  return COUNTERS[host] ?? null;
}

export function initMetrika() {
  if (counterId !== null) return;
  const id = resolveCounter();
  if (!id) return;
  counterId = id;

  // Официальный сниппет Метрики
  (function (m: any, e: Document, t: string, r: string, i: string) {
    m[i] =
      m[i] ||
      function (...args: unknown[]) {
        (m[i].a = m[i].a || []).push(args);
      };
    m[i].l = 1 * (new Date() as unknown as number);
    const k = e.createElement(t) as HTMLScriptElement;
    const a = e.getElementsByTagName(t)[0];
    k.async = true;
    k.src = r;
    a.parentNode?.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym?.(id, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

export function trackPageView(url: string, referrer?: string) {
  if (!counterId) return;
  window.ym?.(counterId, "hit", url, { referer: referrer });
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (!counterId) return;
  window.ym?.(counterId, "reachGoal", goal, params);
}
