import * as splToken from "@solana/spl-token";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import sql from "./postgres.js";
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// not sure if necessary - can just use single account to pay for everything, and just sign instructions
// const LAMPORTS_PER_WALLET = LAMPORTS_PER_SOL / 100; // 0.01 SOL
// todo: support devnet USDC?
const USDC_SPL_PUBKEY = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
); // on solana mainnet
const USDC_DECIMALS = 6;

export async function _getTestnetSol(wallet: Keypair) {
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    LAMPORTS_PER_SOL
  );

  //todo: update method call
  await connection.confirmTransaction(airdropSignature);
}

// TODO: regulatory issues with a shared account that we sweep funds into?
// is it better to just manually manage each wallet on its own, and directly
// deposit into marginfi individually?
export async function _sweepUSDC(fromWallet: Keypair, toWallet: Keypair) {
  // TODO: register these in a separate method, and just query from database
  const [fromTokenAccount, toTokenAccount] = await Promise.all([
    splToken.getOrCreateAssociatedTokenAccount(
      connection,
      toWallet,
      USDC_SPL_PUBKEY,
      fromWallet.publicKey
    ),
    splToken.getOrCreateAssociatedTokenAccount(
      connection,
      toWallet,
      USDC_SPL_PUBKEY,
      toWallet.publicKey
    ),
  ]);

  // sweep everything
  const amount = await connection.getTokenAccountBalance(
    fromTokenAccount.address
  );

  if (!amount.value.uiAmount) {
    console.log("no USDC found, transfer aborted");
    return;
  }

  // const transferTransaction = new Transaction().add(
  //   splToken.createTransferCheckedInstruction(
  //     // splToken.Token.createTransferInstruction(
  //     splToken.TOKEN_PROGRAM_ID,
  //     fromTokenAccount.address,
  //     toTokenAccount.address,
  //     fromWallet.publicKey,
  //     amount.value.uiAmount,
  //     USDC_Token.Decimals,
  //     [fromWallet]
  //   )
  // );

  // const signature = await splToken.transfer(
  const signature = await splToken.transfer(
    connection,
    toWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    amount.value.uiAmount,
    [fromWallet, toWallet]
  );
  // TODO: log the transfer
  return signature;

  // TODO: directly deposit to marginfi instead?
  // return await sendAndConfirmTransaction(connection, transferTransaction, [
  // toWallet, // the receiving wallet can pay for everything
  // ]);
}

export async function generateKeyPair(userId: string) {
  const keypair = Keypair.generate();

  // register this keypair for the user for the DB.  Put secretkey somewhere else?
  await sql`
  INSERT INTO wallets (user_id, public_key, secret_key)
  VALUES (${userId}, ${keypair.publicKey.toString()}, ${Buffer.from(
    keypair.secretKey
  ).toString("base64")})
  `;

  const wallet = {
    publicKey: keypair.publicKey,
    secretKey: keypair.secretKey,
  };
  console.log(wallet);
  return wallet;
}
