console.log("🔧 Libereum Background Worker Başlatıldı!");

importScripts("js/ethers.umd.min.js");
importScripts("lib/contants.js");

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (!details.url) return;

  const url = new URL(details.url);

  if (url.protocol === "chrome:" || url.protocol === "chrome-extension:") {
    console.warn(`⚠️ Chrome dahili sayfası tespit edildi: ${url.href}`);
    return;
  }

  if (url.hostname.endsWith(".lib")) {
    console.log(`📡 .lib domain tespit edildi: ${url.hostname}`);

    let renderPage = chrome.runtime.getURL(
      `pages/render.html?domain=${url.hostname}`
    );

    chrome.tabs.update(details.tabId, { url: renderPage });
  }
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  const url = details.url;

  if (url.includes("www.google.com/search?q=")) {
    const queryMatch = url.match(/q=([^&]*)/);
    if (queryMatch) {
      const query = decodeURIComponent(queryMatch[1]);

      if (query.endsWith(".lib")) {
        console.log(
          `🔍 Google arama üzerinden .lib domain tespit edildi: ${query}`
        );

        let renderPage = chrome.runtime.getURL(
          `pages/render.html?domain=${query}`
        );

        chrome.tabs.update(details.tabId, { url: renderPage });
      }
    }
  }
});
