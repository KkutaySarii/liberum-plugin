console.log("🔧 Libereum Background Worker Çalışıyor!");

// İçerik çözümleme isteğini dinle
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

// Libereum Blockchain ile etkileşim fonksiyonu
async function getLibereumContent(domain) {
  console.log(`🔍 Akıllı kontrattan içerik çekme denemesi: ${domain}`);

  const provider = new ethers.providers.JsonRpcProvider("SENİN_RPC_URL");
  const contract = new ethers.Contract("KONTRAT_ADRESİ", ABI, provider);

  try {
    const content = await contract.getDomainContent(domain);
    return content
      ? content
      : "<html><body><h1>Libereum Domain İçeriği Boş</h1></body></html>";
  } catch (error) {
    console.error("❌ Akıllı kontrat hatası:", error);
    return "<html><body><h1>Hata: İçerik Çekilemedi</h1></body></html>";
  }
}
