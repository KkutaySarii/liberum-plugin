document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const errorType = params.get("pageType");
  const domain = params.get("domain");

  console.log(domain);

  const NoMintedError = document.querySelector(".no-minted-error-container");
  const FetchError = document.querySelector(".fetch-error-container");

  if (errorType === "no-minted") {
    NoMintedError.style.display = "flex";
    FetchError.style.display = "none";
    if (domain) {
      document.querySelector(
        ".mint"
      ).href = `https://www.liberum.space/mint/${domain}`;
      document.querySelector(".domain-name").innerText = domain;
    } else {
      document.querySelector(".mint").href = `https://www.liberum.space/mint`;
    }
  } else {
    FetchError.style.display = "flex";
    NoMintedError.style.display = "none";
  }
});
