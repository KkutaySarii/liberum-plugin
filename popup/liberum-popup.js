document.addEventListener("DOMContentLoaded", async () => {
  const toggleButton = document.getElementById("toggle");
  const connectedImg = document.getElementById("connected-img");
  const disconnectedImg = document.getElementById("disconnected-img");
  const connectText = document.getElementById("connect-text");
  const connecDesc = document.getElementById("connect-desc");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const searchButtonText = document.querySelector(".search-button-text");
  const noLibBlock = document.getElementById("no-lib-block");
  const libBlock = document.getElementById("lib-block");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url) {
      try {
        const currentUrl = new URL(tabs[0].url);

        if (currentUrl.hostname.endsWith(".lib")) {
          libBlock.style.display = "flex";
          noLibBlock.style.display = "none";

          setTimeout(() => {
            connecDesc.innerHTML = `You are currently connected to the <strong>${currentUrl.hostname}</strong> blockspace.`;
          }, 200);
        } else {
          libBlock.style.display = "none";
          noLibBlock.style.display = "flex";

          connecDesc.innerHTML =
            "Enable Liberum to explore .lib domains from the blockchain.";
        }
      } catch (error) {
        console.error("⚠️ Geçersiz URL veya hata:", error);
      }
    }
  });

  chrome.storage.local.get(["isActive"], (result) => {
    if (result.isActive === undefined) {
      chrome.storage.local.set({ isActive: true }, () => {
        setConnectedState();
      });
    } else if (result.isActive) {
      setConnectedState();
    } else {
      setDisconnectedState();
    }
  });

  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get(["isActive"], (result) => {
      const newState = !result.isActive;
      chrome.storage.local.set({ isActive: newState }, () => {
        if (newState) {
          setConnectedState();
        } else {
          setDisconnectedState();
        }
      });
    });
  });

  function setConnectedState() {
    connectedImg.style.display = "block";
    disconnectedImg.style.display = "none";
    connectText.innerText = "Liberum is Connected";
    connecDesc.innerHTML =
      "You're now ready to explore .lib domains directly from the blockchain.";

    searchButton.style.opacity = "1";
    searchButton.disabled = false;

    searchInput.disabled = false;
    searchInput.style.opacity = "1";
  }

  function setDisconnectedState() {
    connectedImg.style.display = "none";
    disconnectedImg.style.display = "block";
    connectText.innerText = "Liberum is Disconnected";
    connecDesc.innerHTML =
      "Enable Liberum to explore .lib domains from the blockchain.";

    searchButton.style.opacity = "0.5";
    searchButton.disabled = true;

    searchInput.disabled = true;
    searchInput.style.opacity = "0.5";
  }

  searchInput.addEventListener("input", updateButtonState);

  function updateButtonState() {
    if (searchInput.value.trim() === "") {
      searchButton.disabled = true;
      searchButtonText.style.opacity = "0.5";
    } else {
      searchButton.disabled = false;
      searchButtonText.style.opacity = "1";
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchButton.click();
    }
  });

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query === "") {
      return;
    }

    document.getElementById("loader").style.visibility = "visible";

    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        GET_TOKEN_CONTRACT_ADDRESS,
        GET_TOKEN_ID_ABI,
        provider
      );

      const tokenID = await contract.getTokenIdByDomain(query);

      if (tokenID) {
        const pageContract = new ethers.Contract(
          PAGE_LINKED_CONTRACT_ADDRESS,
          PAGE_LINKED_ABI,
          provider
        );

        const CA_HTML = await pageContract.pageLinkedDomain(tokenID);

        if (CA_HTML) {
          const HTML_CONTRACT = new ethers.Contract(
            CA_HTML,
            HTML_ABI,
            provider
          );
          const content = await HTML_CONTRACT.getContent();
          if (content) {
            let newTab = `data:text/html;charset=utf-8,${encodeURIComponent(
              content
            )}`;
            chrome.tabs.create({ url: newTab });
          }
        }
      }
    } catch (error) {
      console.error("Kontrattan içerik çekme hatası:", error);
      alert("İçerik yüklenirken hata oluştu!");
    } finally {
      document.getElementById("loader").style.visibility = "hidden";
    }
  });
});
