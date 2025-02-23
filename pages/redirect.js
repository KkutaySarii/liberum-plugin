console.log("🔄 Libereum Redirect Çalışıyor!");

const domain = window.location.hostname;
console.log(`📡 Yönlendirme isteği: ${domain}`);

// Background.js'e mesaj gönder
chrome.runtime.sendMessage({ type: "resolveDomain", domain }, (response) => {
  if (response && response.html) {
    console.log("✅ İçerik bulundu, ekrana yazılıyor...");
    document.open();
    document.write(response.html);
    document.close();
  } else {
    console.log("❌ İçerik bulunamadı.");
    document.body.innerHTML = "<h1>404 - İçerik Bulunamadı</h1>";
  }
});
