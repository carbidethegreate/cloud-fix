# Cloudflare Diagnostic Tool

A simple static page for generating diagnostic reports for Cloudflare Workers and Pages. It runs entirely in the browser with HTML, CSS and vanilla JavaScript.

## Usage

1. Open `index.html` in any modern browser or deploy the repository to a static host such as Cloudflare Pages.
2. Enter a Cloudflare API token with permissions to read Workers and Pages.
3. Select the resources to inspect and click **Generate Report** to view the details.
4. Use **Full Report** to verify the token information.

No build step or package installation is required.

The application stores the API token only in memory and reminds users to reset their API key by April 4, 2026.
