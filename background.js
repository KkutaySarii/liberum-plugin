chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("🔍 Tab Güncellendi:", tabId, changeInfo, tab);

  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);

    // Eğer `chrome://` veya `chrome-extension://` ile başlayan bir URL varsa işlemi iptal et
    if (url.protocol === "chrome:" || url.protocol === "chrome-extension:") {
      console.warn(`⚠️ Chrome dahili sayfası tespit edildi: ${url.href}`);
      return;
    }

    if (url.hostname.endsWith(".lib")) {
      console.log(`📡 .lib domain tespit edildi: ${url.hostname}`);

      try {
        // Akıllı kontrattan içeriği al
        let content = await getLibereumContent(url.hostname);
        console.log(`📡 Akıllı kontrattan alınan içerik:`, content);

        let newTab = `data:text/html;charset=utf-8,${encodeURIComponent(
          content
        )}`;
        console.log(`🆕 Yönlendirme için yeni URL:`, newTab);

        // 🛠️ DEBUG: `tabId` gerçekten var mı?
        console.log(`🔄 Güncellenecek Sekme ID'si:`, tabId);

        // Eğer `tabId` geçerli değilse yeni sekme açmayı dene
        if (tabId && tabId > 0) {
          console.log(`🔄 Mevcut sekme güncelleniyor: ${tabId}`);
          // chrome.tabs.update(tabId, { url: newTab }, () => {
          //   if (chrome.runtime.lastError) {
          //     console.error(
          //       "❌ chrome.tabs.update Hatası:",
          //       chrome.runtime.lastError
          //     );
          //   }
          // });
          chrome.tabs.create({ url: newTab });
        } else {
          console.warn("⚠️ Geçersiz tabId, yeni sekme açılıyor...");
          chrome.tabs.create({ url: newTab });
        }
      } catch (error) {
        console.error("Libereum içeriği alınırken hata oluştu:", error);
      }
    }
  }
});

// Sahte içerik dönen örnek `getLibereumContent` fonksiyonu
async function getLibereumContent(domain) {
  return `<html><body><h1>${domain} - Liberum İçeriği</h1></body></html>`;
}
