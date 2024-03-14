import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateKeyPair } from "../utils/createSolanaWallet";
import { getBalance } from "../utils/postgres";
import { PushNotifier } from "./pushNotifier";
import { trpcT } from "./trpc";

export function createRouter(notifier: PushNotifier) {
  const corsMiddleware = trpcT.middleware(async (opts) => {
    opts.ctx.res.setHeader("Access-Control-Allow-Origin", "*");
    return opts.next();
  });

  const readyMiddleware = trpcT.middleware(async (opts) => {
    // Don't serve requests until we're ready.
    // This avoids confusing UI state in local development.
    if (!notifier.isInitialized) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    return opts.next();
  });

  const publicProcedure = trpcT.procedure
    .use(corsMiddleware)
    .use(readyMiddleware);

  return trpcT.router({
    health: publicProcedure.query(async (_opts) => {
      // See readyMiddleware
      return "healthy";
    }),

    getAccountHistory: publicProcedure
      .input(
        z.object({
          user: z.string(),
        })
      )
      .query(async (opts) => {
        return;
        // getAccountHistory(
        opts;
        // );
      }),

    registerPushToken: publicProcedure
      .input(
        z.object({
          user: z.string(),
          token: z.string(),
        })
      )
      .mutation(async (opts) => {
        // TODO: device attestation or similar to avoid griefing.
        // Auth is not for privacy; anyone can watch an address onchain.
        // const { token } = opts.input;
        // const address = getAddress(opts.input.address);
        // notifier.register(address, token);
        return;
      }),

    // simple GET endpoint here
    simpleGet: publicProcedure.query(async () => {
      return { message: "This is a simple GET response" };
    }),

    dbQuery: publicProcedure
      .input(z.object({ user: z.string() }))
      .query(async (opts) => {
        return { fakemessage: await getBalance(opts.input.user) };
      }),

    createSolanaWallet: publicProcedure
      .input(z.object({ user: z.string() }))
      .query(async (opts) => {
        const { user } = opts.input;
        const wallet = await generateKeyPair(user);
        return wallet;
      }),
  });
}
