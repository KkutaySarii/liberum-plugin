# Liberum Browser Extension

Liberum is a browser extension that enables users to seamlessly access decentralized .lib domains without relying on traditional DNS services. It resolves domain mappings and content directly from blockchain smart contracts, ensuring a censorship-resistant and decentralized web experience.

## Features

- **Decentralized Domain Resolution:** Fetches .lib domain content from blockchain smart contracts.
- **Integrated Search Handling:** Redirects .lib domain searches from the browser address bar and Google search results.
- **Web3 Smart Contract Interaction:** Retrieves domain data and HTML content stored on-chain.
- **Popup UI:** Allows users to toggle extension functionality and search for .lib domains.
- **Seamless Browsing Experience:** Automatically loads decentralized web pages in place of centralized alternatives.

## Installation

### Load as Unpacked Extension

1. Clone this repository:
   ```sh
   git clone https://github.com/yourusername/liberum-extension.git
   ```
2. Open **Google Chrome** and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the project folder.
5. The Liberum extension should now be active in your browser.

## Permissions

The extension requires the following permissions:

- **tabs** - To detect active tabs and check if a .lib domain is being accessed.
- **scripting** - To inject scripts when necessary for content rendering.
- **storage** - To store user preferences and extension settings.
- **activeTab** - To modify the behavior of actively visited pages.
- **webNavigation** - To track and handle URL navigation events for .lib domains.
- **host_permissions** - To allow interactions with .lib domains and Google search pages.

## Usage

1. Ensure that the extension is **enabled** from the popup UI.
2. Enter a .lib domain (e.g., `example.lib`) into the browser's address bar and press Enter.
3. The extension will automatically resolve the domain and load the associated content.
4. Users can also search for .lib domains in Google, and the extension will intercept the search to load the correct decentralized content.

## Development

### Prerequisites

- **Node.js** (for potential future development and testing)
- **Google Chrome / Chromium-based Browser**

### Local Development Setup

1. Navigate to the extension directory:
   ```sh
   cd liberum-extension
   ```
2. Modify `background.js` and `popup.js` as needed.
3. Reload the extension from `chrome://extensions/` for changes to take effect.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request with improvements.
