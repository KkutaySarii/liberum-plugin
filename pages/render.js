document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const domain = params.get("domain");

  if (!domain) {
    redirectToError("fetch-error", "");
    return;
  }

  document.title = `${domain} - Libereum`;

  console.log(`📡 Fetching content for: ${domain}`);

  try {
    const content = await getLiberumContent(domain);

    if (!content || content.includes("❌")) {
      redirectToError("no-minted", domain);
      return;
    }

    updateVisit(domain);

    document.getElementById("liberum-content").innerHTML = content;
    document.getElementById("liberum-content").style.display = "block";
    document.querySelector(".loading-screen").style.display = "none";
  } catch (error) {
    console.error("⚠️ Error loading Libereum content:", error);
    redirectToError("fetch-error", "");
  }
});

async function getLiberumContent(domain) {
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

  try {
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
        const content = await HTML_CONTRACT.GET("");
        return content || "❌ No content found";
      }
    }
  } catch (error) {
    return "❌ Error fetching content";
  }

  return "❌ Error: No data";
}

function redirectToError(type, domain) {
  let sendDomain = domain || "";
  const errorPage = chrome.runtime.getURL(
    `pages/error.html?pageType=${encodeURIComponent(
      type
    )}&domain=${encodeURIComponent(sendDomain)}`
  );
  window.location.href = errorPage;
}
