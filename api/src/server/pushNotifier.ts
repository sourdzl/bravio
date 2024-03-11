import { Expo } from "expo-server-sdk";


const pushEnabled = process.env.BRAVIO_PUSH_ENABLED === "true";

type SolanaAddress = string;

/**
 * Subscribes to coin transfers onchain. Whenever USDC is deposited into a User
 * account, sends a push notification to each of the user's devices.
 */
export class PushNotifier {
  pushTokens = new Map<SolanaAddress, string[]>();
  expo = new Expo();

  isInitialized = false;

  constructor(
  ) {
    // fix this
    this.isInitialized = true;
  }

  async init() {
  }

}
