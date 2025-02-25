chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateContent") {
    document.open();
    document.write(request.content);
    document.close();
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "resolveDomain") {
    console.log(`📡 .lib domain tespit edildi: ${request.domain}`);

    getLibereumContent(request.domain)
      .then((htmlContent) => {
        console.log(`✅ İçerik bulundu, yönlendiriliyor: ${request.domain}`);
        sendResponse({ html: htmlContent });
      })
      .catch((error) => {
        console.error("❌ İçerik çekme hatası:", error);
        sendResponse({ html: "<h1>Hata: İçerik Çekilemedi</h1>" });
      });

    return true; // async işlemi tamamlamak için `true` dönüyoruz
  }
});
