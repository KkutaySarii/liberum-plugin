console.log("🔧 Libereum Background Worker Başlatıldı!");

chrome.webNavigation.onCommitted.addListener(async (details) => {
  chrome.storage.local.get(["isActive"], async (result) => {
    if (!result.isActive) {
      console.warn("🚫 Libereum devre dışı! İşlem yapılmadı.");
      return;
    }

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
});
