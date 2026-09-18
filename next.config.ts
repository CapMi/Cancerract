import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Build a fully static site (no Node server needed), e.g. for GitHub Pages. */
  output: "export",
  /* Project sites are served from /<repo>, so assets need a base path.
     Unset locally, so `yarn dev` still serves from http://localhost:3000. */
  basePath: process.env.PAGES_BASE_PATH,
  /* The default image optimizer needs a server, which a static export has not. */
  images: { unoptimized: true },
  /* Emit /path/index.html so any static host serves clean URLs. */
  trailingSlash: true,
};

export default nextConfig;
