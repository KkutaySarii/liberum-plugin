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
