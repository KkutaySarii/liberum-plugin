document.addEventListener("DOMContentLoaded", async () => {
  const toggleButton = document.getElementById("toggle");
  const connectedImg = document.getElementById("connected-img");
  const disconnectedImg = document.getElementById("disconnected-img");
  const connectText = document.getElementById("connect-text");
  const connecDesc = document.getElementById("connect-desc");

  chrome.storage.local.get(["isActive"], (result) => {
    if (result.isActive === undefined) {
      chrome.storage.local.set({ isActive: true }, () => {
        connectedImg.style.display = "block";
        disconnectedImg.style.display = "none";
        connectText.innerText = "Libereum is Connected";
        connecDesc.innerText =
          "You're now ready to explore .lib domains directly from the blockchain.";
      });
    } else if (result.isActive) {
      connectedImg.style.display = "block";
      disconnectedImg.style.display = "none";
      connectText.innerText = "Libereum is Connected";
      connecDesc.innerText =
        "You're now ready to explore .lib domains directly from the blockchain.";
    } else {
      connectedImg.style.display = "none";
      disconnectedImg.style.display = "block";
      connectText.innerText = "Libereum is Disconnected";
      connecDesc.innerText =
        "Enable Liberum to explore .lib domains from the blockchain.";
    }
  });

  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get(["isActive"], (result) => {
      const newState = !result.isActive;
      chrome.storage.local.set({ isActive: newState }, () => {
        if (newState) {
          connectedImg.style.display = "block";
          disconnectedImg.style.display = "none";
          connectText.innerText = "Libereum is Connected";
          connecDesc.innerText =
            "You're now ready to explore .lib domains directly from the blockchain.";
        } else {
          connectedImg.style.display = "none";
          disconnectedImg.style.display = "block";
          connectText.innerText = "Libereum is Disconnected";
          connecDesc.innerText =
            "Enable Liberum to explore .lib domains from the blockchain.";
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  function updateButtonOpacity() {
    if (searchInput.value.trim() === "") {
      searchButton.style.opacity = "0.5";
      searchButton.disabled = true;
    } else {
      searchButton.style.opacity = "1";
      searchButton.disabled = false;
    }
  }

  searchInput.addEventListener("input", updateButtonOpacity);

  updateButtonOpacity();
});
