import { defineConfig } from "astro/config";
import { site as content } from "./src/content/site";

// Until a custom domain is set in src/content/site.ts, the site lives at
// https://iheartvolume.github.io/mcpeek-wedding/ and needs a base path.
const hasDomain = content.domain.trim() !== "";

export default defineConfig({
  site: hasDomain ? `https://${content.domain}` : "https://iheartvolume.github.io",
  base: hasDomain ? "/" : "/mcpeek-wedding",
  trailingSlash: "ignore",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
