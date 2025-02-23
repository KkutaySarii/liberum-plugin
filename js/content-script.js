console.log("📝 Libereum Content Script Çalışıyor!");

// Domain adını al
const domain = window.location.hostname;

if (domain.endsWith(".lib")) {
  console.log(`🔍 Libereum için içerik kontrol ediliyor: ${domain}`);

  fetch(`https://your-api.com/fetch?domain=${domain}`)
    .then((response) => response.text())
    .then((content) => {
      document.open();
      document.write(content);
      document.close();
    })
    .catch((error) => console.error("❌ İçerik alınırken hata:", error));
}
