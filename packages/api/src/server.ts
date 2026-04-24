import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { MemoryCacheAdapter } from "../../shared/src/storage/CacheAdapter";
import { AnalyticsService } from "@core/AnalyticsService";
import { LOG_MESSAGES, STORAGE_KEYS } from "@core/constants";

const __dirname = path.resolve();

export async function startServer() {
  const app = express();
  const PORT = 3000;
  const cache = new MemoryCacheAdapter();
  const analytics = new AnalyticsService();

  // 1. Vite Middleware for Development
  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist/client")));
  }

  // 2. Selective SSR / ISR Handler
  app.get("*", async (req, res) => {
    const url = req.originalUrl;

    try {
      // A. On-demand SSR
      let template;
      if (process.env.NODE_ENV !== "production") {
        template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(__dirname, "dist/client/index.html"), "utf-8");
      }

      // No real SSR implemented yet, just return the template
      // We keep the ssr-outlet for future real SSR implementation
      const html = template.replace(`<!--ssr-outlet-->`, "");

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(LOG_MESSAGES.SERVER_START(PORT));
  });
}
