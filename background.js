console.log("🔧 Libereum Background Worker Başlatıldı!");

importScripts("js/ethers.umd.min.js");
importScripts("lib/contants.js");

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);

    if (url.protocol === "chrome:" || url.protocol === "chrome-extension:") {
      console.warn(`⚠️ Chrome dahili sayfası tespit edildi: ${url.href}`);
      return;
    }

    if (url.hostname.endsWith(".lib")) {
      try {
        let content = await getLibereumContent(url.hostname);

        let newTab = `data:text/html;charset=utf-8,${encodeURIComponent(
          content
        )}`;

        chrome.tabs.remove(tabId, () => {
          chrome.tabs.create({ url: newTab });
        });
      } catch (error) {
        console.error("Libereum içeriği alınırken hata oluştu:", error);
      }
    }
  }
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  const url = details.url;

  if (url.includes("www.google.com/search?q=")) {
    const queryMatch = url.match(/q=([^&]*)/);
    if (queryMatch) {
      const query = decodeURIComponent(queryMatch[1]);

      if (query.endsWith(".lib")) {
        let content = await getLibereumContent(query);

        let newTab = `data:text/html;charset=utf-8,${encodeURIComponent(
          content
        )}`;
        chrome.tabs.remove(details.tabId, () => {
          chrome.tabs.create({ url: newTab });
        });
      }
    }
  }
});

async function getLibereumContent(domain) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const domainContract = new ethers.Contract(
    GET_TOKEN_CONTRACT_ADDRESS,
    GET_TOKEN_ID_ABI,
    provider
  );

  try {
    const tokenID = await domainContract.getTokenIdByDomain(domain);

    if (tokenID) {
      const pageContract = new ethers.Contract(
        PAGE_LINKED_CONTRACT_ADDRESS,
        PAGE_LINKED_ABI,
        provider
      );

      const CA_HTML = await pageContract.pageLinkedDomain(tokenID);

      if (CA_HTML) {
        const HTML_CONTRACT = new ethers.Contract(CA_HTML, HTML_ABI, provider);
        const content = await HTML_CONTRACT.getContent();

        return content
          ? content
          : "<html><body><h1>Libereum İçeriği Bulunamadı</h1></body></html>";
      }
    }
  } catch (error) {
    return "<html><body><h1>Hata: İçerik Çekilemedi</h1></body></html>";
  }

  return "<html><body><h1>Hata: İçerik Çekilemedi</h1></body></html>";
}
