import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as sql from './postgres';

const LAMPORTS_PER_WALLET = LAMPORTS_PER_SOL / 100; // 0.01 SOL

export async function _getTestnetSol(wallet: Keypair){
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    LAMPORTS_PER_SOL
  );

  //todo: update method call
  await connection.confirmTransaction(airdropSignature);
}

export async function _sendSOL(fromKeypair: Keypair, toKeypair: Keypair) {
  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: LAMPORTS_PER_WALLET,
    })
  );

  return await sendAndConfirmTransaction(connection, transferTransaction, [
    fromKeypair,
  ]);
}

export async function generateKeyPair (userId: string) {
    
  const keypair = Keypair.generate();
  console.log(wallet);

  // register this keypair for the user for the DB.  Put secretkey somewhere else?
  sql`
  INSERT INTO wallets (user_id, public_key, secret_key)
  VALUES (${userId}, ${keypair.publicKey()}, ${keypair.secretKey()})
  `
  

  wallet = {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secretKey(),
  }
  return wallet;

}