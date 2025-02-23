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
    if (tabs.length > 0) {
      const currentUrl = new URL(tabs[0].url);
      if (currentUrl.hostname.endsWith(".lib")) {
        libBlock.style.display = "flex";
        noLibBlock.style.display = "none";
      } else {
        libBlock.style.display = "none";
        noLibBlock.style.display = "flex";
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
    connectText.innerText = "Libereum is Connected";
    connecDesc.innerText =
      "You're now ready to explore .lib domains directly from the blockchain.";

    searchButton.style.opacity = "1";
    searchButton.disabled = false;

    searchInput.disabled = false;
    searchInput.style.opacity = "1";
  }

  function setDisconnectedState() {
    connectedImg.style.display = "none";
    disconnectedImg.style.display = "block";
    connectText.innerText = "Libereum is Disconnected";
    connecDesc.innerText =
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

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query === "") {
      return;
    }

    chrome.tabs.create({
      url: `https://liberum.network/search?q=${query}`,
    });
  });
});
