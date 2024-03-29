import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import cors from "cors";
import http from "http";

import { Crontab } from "./cron.js";
import { PushNotifier } from "./pushNotifier.js";
import { createRouter } from "./router.js";
import { createContext, onTrpcError } from "./trpc.js";
// wtf is .js needed?

async function main() {
  // await db.createTables();

  // const accountFactory = null; //new AccountFactory();
  const crontab = new Crontab();

  const notifier = new PushNotifier();

  // Initialize in background
  (async () => {
    console.log(`[API] initializing indexers...`);
    await Promise.all([notifier.init(), crontab.init()]);
  })();

  console.log(`[API] serving...`);
  const router = createRouter(notifier);
  const handler = createHTTPHandler({
    middleware: cors(),
    router,
    createContext,
    onError: onTrpcError,
  });

  const trpcPrefix = `/chain/solana/`;
  const server = http.createServer((req, res) => {
    // Only serve requests for the correct network.
    // i dunno if this is actually needed right now, since we'll only support Solana at first
    if (req.url == null || !req.url.startsWith(trpcPrefix)) {
      console.log(`[API] SKIPPING ${req.url}`);
      res.writeHead(404);
      res.end();
      return;
    }

    console.log(`[API] serving ${req.method} ${req.url}`);

    req.url = "/" + req.url.slice(trpcPrefix.length);
    handler(req, res);
  });
  server.listen(3000).address();

  console.log(`[API] listening`);
}

main().catch(console.error);
