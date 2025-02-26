document.addEventListener("DOMContentLoaded", async () => {
  const loadingScreen = document.querySelector(".loading-screen");
  const blockspaceInfo = document.querySelector(".info-container");

  const blockspaceName = document.querySelector(".blockspace-name .info-text");
  const linkedContent = document.querySelector(".linked-content .info-text");
  const owner = document.querySelector(".owner .info-text");
  const createdTime = document.querySelector(".created-time .info-text");
  const updatedTime = document.querySelector(".updated-time .info-text");

  const linkedContentLink = document.querySelector(".linked-content");
  const ownerLink = document.querySelector(".owner");

  loadingScreen.style.display = "flex";
  blockspaceInfo.style.display = "none";

  const blockspaceData = await fetchBlockspaceInfo();

  if (blockspaceData.content) {
    linkedContent.innerText = blockspaceData.content;
    linkedContentLink.setAttribute(
      "href",
      `https://explorer-mammothon-g2-testnet-4a2w8v0xqy.t.conduit.xyz/address/${blockspaceData.content}`
    );
  } else {
    console.warn("⚠️ content değeri bulunamadı.");
  }

  if (blockspaceData.owner) {
    owner.innerText = blockspaceData.owner;
    ownerLink.setAttribute(
      "href",
      `https://explorer-mammothon-g2-testnet-4a2w8v0xqy.t.conduit.xyz/address/${blockspaceData.owner}`
    );
  } else {
    console.warn("⚠️ owner değeri bulunamadı.");
  }

  blockspaceName.innerText = blockspaceData.name;
  createdTime.innerText = formatDate(blockspaceData.createdAt);
  updatedTime.innerText = formatDate(blockspaceData.updatedAt);

  loadingScreen.style.display = "none";
  blockspaceInfo.style.display = "block";
});

async function fetchBlockspaceInfo() {
  const domain = await getActiveTabDomain();

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

    if (tokenId) {
      const contentAddress = await htmlPageFactoryContract.getLinkedDomain(
        tokenId
      );

      if (contentAddress) {
        const HTML_CONTRACT = new ethers.Contract(
          contentAddress,
          HTML_ABI,
          provider
        );
        const owner = await HTML_CONTRACT.owner();

        const createdTimestamp = await HTML_CONTRACT.createdTimestamp();
        const updatedTimestamp = await HTML_CONTRACT.updatedTimestamp();

        console.log(contentAddress);

        return {
          name: domain,
          content: contentAddress,
          owner,
          createdAt: createdTimestamp.toNumber() * 1000,
          updatedAt: updatedTimestamp.toNumber() * 1000,
        };
      }
    }
  } catch (error) {
    console.error("Kontrattan içerik çekme hatası:", error);
    alert("İçerik yüklenirken hata oluştu!");
  } finally {
  }
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
          if (domain.endsWith(".lib")) {
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
