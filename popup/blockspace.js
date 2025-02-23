document.addEventListener("DOMContentLoaded", async () => {
  const loadingScreen = document.querySelector(".loading-screen");
  const blockspaceInfo = document.querySelector(".info-container");

  const blockspaceName = document.querySelector(".blockspace-name .info-text");
  const linkedContent = document.querySelector(".linked-content .info-text");
  const owner = document.querySelector(".owner .info-text");
  const createdTime = document.querySelector(".created-time .info-text");
  const updatedTime = document.querySelector(".updated-time .info-text");

  loadingScreen.style.display = "flex";
  blockspaceInfo.style.display = "none";

  setTimeout(async () => {
    const blockspaceData = await fetchBlockspaceInfo();

    blockspaceName.innerText = blockspaceData.name;
    linkedContent.innerText = blockspaceData.content;
    owner.innerText = blockspaceData.owner;
    createdTime.innerText = formatDate(blockspaceData.createdAt);
    updatedTime.innerText = formatDate(blockspaceData.updatedAt);

    loadingScreen.style.display = "none";
    blockspaceInfo.style.display = "block";
  }, 1000);
});

async function fetchBlockspaceInfo() {
  // TODO: Implement this function
  return {
    name: "kerem.lib", // Burada domain kontrattan çekilecek
    content: "0x8798asdahfas8fa98...", // İçerik kontrattan çekilecek
    owner: "0x123456789abcdef...", // Sahibin adresi kontrattan çekilecek
    createdAt: 1400000000000, // Oluşturulma tarihi
    updatedAt: 1623753600000, // Güncelleme tarihi
  };
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("tr-TR");
}
