document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const message = params.get("message") || "Unknown error occurred.";
  document.getElementById("error-message").innerText = message;
});
