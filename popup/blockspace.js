document.addEventListener("DOMContentLoaded", async () => {
  const loadingScreen = document.querySelector(".loading-screen");
  const blockspaceInfo = document.querySelector(".info-container");
  const errorScreen = document.querySelector(".error-screen");

  loadingScreen.style.display = "flex";
  blockspaceInfo.style.display = "none";
  errorScreen.style.display = "none";

  const domain = await getActiveTabDomain();
  if (!domain) {
    showError();
    return;
  }

  chrome.storage.local.get([domain], async (result) => {
    if (result[domain]) {
      console.log("📂 Cache’den Veri Alındı:", result[domain]);
      updateUI(result[domain]);
    } else {
      console.log("🔄 Kontrattan Yeni Veri Çekiliyor...");
      const blockspaceData = await fetchBlockspaceInfo(domain);

      if (!blockspaceData) {
        showError();
        return;
      }

      chrome.storage.local.set({ [domain]: blockspaceData });
      updateUI(blockspaceData);
    }
  });
});

async function fetchBlockspaceInfo(domain) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const domainContract = new ethers.Contract(
      domainContractAddress,
      domainContractABI,
      provider
    );

    const htmlPageFactoryContract = new ethers.Contract(
      htmlPageFactoryAddress,
      htmlPageFactoryABI,
      provider
    );

    const tokenId = await domainContract.getTokenIdByDomain(domain);
    if (!tokenId) return null;

    const contentAddress = await htmlPageFactoryContract.getLinkedDomain(
      tokenId
    );
    if (!contentAddress) return null;

    const HTML_CONTRACT = new ethers.Contract(
      contentAddress,
      HTML_ABI,
      provider
    );
    const owner = await HTML_CONTRACT.owner();
    const createdTimestamp = await HTML_CONTRACT.createdTimestamp();
    const updatedTimestamp = await HTML_CONTRACT.updatedTimestamp();

    return {
      name: domain,
      content: contentAddress,
      owner,
      createdAt: createdTimestamp.toNumber() * 1000,
      updatedAt: updatedTimestamp.toNumber() * 1000,
    };
  } catch (error) {
    console.error("Kontrattan içerik çekme hatası:", error);
    return null;
  }
}

function updateUI(blockspaceData) {
  document.querySelector(".loading-screen").style.display = "none";
  document.querySelector(".info-container").style.display = "block";
  document.querySelector(".error-screen").style.display = "none";

  document.querySelector(".blockspace-name .info-text").innerText =
    blockspaceData.name;
  document.querySelector(".linked-content .info-text").innerText =
    blockspaceData.content;
  document
    .querySelector(".linked-content")
    .setAttribute(
      "href",
      `https://explorer-mammothon-g2-testnet-4a2w8v0xqy.t.conduit.xyz/address/${blockspaceData.content}`
    );
  document.querySelector(".owner .info-text").innerText = blockspaceData.owner;
  document
    .querySelector(".owner")
    .setAttribute(
      "href",
      `https://explorer-mammothon-g2-testnet-4a2w8v0xqy.t.conduit.xyz/address/${blockspaceData.owner}`
    );
  document.querySelector(".created-time .info-text").innerText = formatDate(
    blockspaceData.createdAt
  );
  document.querySelector(".updated-time .info-text").innerText = formatDate(
    blockspaceData.updatedAt
  );
}

function showError() {
  document.querySelector(".loading-screen").style.display = "none";
  document.querySelector(".info-container").style.display = "none";
  document.querySelector(".error-screen").style.display = "flex";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("tr-TR");
}

async function getActiveTabDomain() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        try {
          const currentUrl = new URL(tabs[0].url);
          const domain = currentUrl.search.split("domain=")[1];
          if (domain && domain.endsWith(".lib")) {
            resolve(domain);
            return;
          }
        } catch (error) {
          console.error("⚠️ URL işlenirken hata:", error);
        }
      }
      resolve(null);
    });
  });
}
