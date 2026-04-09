import { Plugin } from "vite";
import fs from "fs";
import path from "path";

interface SeoRoute {
  path: string;
  title: string;
  description: string;
  /** Raw HTML injected inside #root for crawler visibility */
  criticalHtml?: string;
}

/**
 * Vite plugin that generates per-route HTML files at build time.
 * Each route gets its own index.html with unique <title>, meta description,
 * Open Graph tags, AND critical above-the-fold HTML inside #root so crawlers
 * see real content before JavaScript hydrates the page.
 */
export function seoPages(routes: SeoRoute[]): Plugin {
  return {
    name: "vite-plugin-seo-pages",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const templatePath = path.join(distDir, "index.html");

      if (!fs.existsSync(templatePath)) return;
      const template = fs.readFileSync(templatePath, "utf-8");

      for (const route of routes) {
        // Build the HTML with replaced meta tags
        let html = template
          // Title
          .replace(
            /<title>[^<]*<\/title>/,
            `<title>${route.title}</title>`
          )
          // Meta description
          .replace(
            /<meta name="description" content="[^"]*"/,
            `<meta name="description" content="${route.description}"`
          )
          // OG title
          .replace(
            /<meta property="og:title" content="[^"]*"/,
            `<meta property="og:title" content="${route.title}"`
          )
          // OG description
          .replace(
            /<meta property="og:description" content="[^"]*"/,
            `<meta property="og:description" content="${route.description}"`
          )
          // OG URL
          .replace(
            /<meta property="og:url" content="[^"]*"/,
            `<meta property="og:url" content="https://aspenmontessori.in${route.path}"`
          )
          // Twitter title
          .replace(
            /<meta name="twitter:title" content="[^"]*"/,
            `<meta name="twitter:title" content="${route.title}"`
          )
          // Twitter description
          .replace(
            /<meta name="twitter:description" content="[^"]*"/,
            `<meta name="twitter:description" content="${route.description}"`
          )
          // Canonical
          .replace(
            /<link rel="canonical" href="[^"]*"/,
            `<link rel="canonical" href="https://aspenmontessori.in${route.path}"`
          );

        // Inject critical HTML inside #root for crawler visibility
        if (route.criticalHtml) {
          html = html.replace(
            '<div id="root"></div>',
            `<div id="root">${route.criticalHtml}</div>`
          );
        }

        // Write the file
        if (route.path === "/") {
          // Overwrite root index.html with critical content
          fs.writeFileSync(templatePath, html);
        } else {
          const routeDir = path.join(distDir, route.path.slice(1));
          fs.mkdirSync(routeDir, { recursive: true });
          fs.writeFileSync(path.join(routeDir, "index.html"), html);
        }
      }
    },
  };
}
