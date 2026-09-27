// AdSense 加载器（客户端）。
// 仅在用户同意（verbify:consent-granted）之后注入广告脚本。
// 发布商 ID 通过 import.meta.env.PUBLIC_ADSENSE_CLIENT_ID 读取 —— 零硬编码，未配置则不加载。

type WindowWithAds = Window & {
  adsbygoogle?: unknown[];
};

export function loadAdSense(): void {
  const pub = import.meta.env.PUBLIC_ADSENSE_CLIENT_ID as string | undefined;
  if (!pub) {
    // 未配置发布商 ID：保持无广告状态（申请前或 ID 缺失均安全）。
    return;
  }

  const w = window as WindowWithAds;
  // 已加载过则防重复注入。
  if (w.adsbygoogle && w.adsbygoogle.length > 0) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.dataset.adClient = pub;
  document.head.appendChild(script);

  // 触发页面中所有已渲染的广告位。脚本异步加载前 push 也会排队，加载后自动填充。
  w.adsbygoogle = w.adsbygoogle || [];
  document.querySelectorAll<HTMLElement>('.adsbygoogle').forEach(() => {
    w.adsbygoogle!.push({});
  });
}
