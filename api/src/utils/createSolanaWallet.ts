import * as splToken from "@solana/spl-token";
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
} from "@solana/web3.js";

import * as sql from './postgres';
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );



const LAMPORTS_PER_WALLET = LAMPORTS_PER_SOL / 100; // 0.01 SOL
const USDC_SPL_PUBKEY = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // on solana mainnet
const USDC_pubkey = new PublicKey(USDC_SPL_PUBKEY);

export async function _getTestnetSol(wallet: Keypair){
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    LAMPORTS_PER_SOL
  );

  //todo: update method call
  await connection.confirmTransaction(airdropSignature);
}

export async function _sweepUSDC(fromWallet: Keypair, toWallet: Keypair) {
    const USDC_Token = new splToken.Token(
    connection,
    USDC_pubkey,
    splToken.TOKEN_PROGRAM_ID,
    fromWallet
  );
    const [fromTokenAccount, toTokenAccount] = await Promise.all([
    USDC_Token.getOrCreateAssociatedAccountInfo(fromWallet.publicKey),
        USDC_Token.getOrCreateAssociatedAccountInfo(
            toWallet.publicKey
        )]);

  const transferTransaction = new Transaction().add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        0
      ).sign([fromWallet])
    );

  // sending SOL is much simpler
//   const transferTransaction = new Transaction().add(
//     SystemProgram.transfer({
//       fromPubkey: fromKeypair.publicKey,
//       toPubkey: toKeypair.publicKey,
//       lamports: LAMPORTS_PER_WALLET,
//     })
//   );

  return await sendAndConfirmTransaction(connection, transferTransaction, [
    toKeyPair, // the receiving wallet can pay for everything
  ]);
}

export async function generateKeyPair (userId: string) {
    
  const keypair = Keypair.generate();

  // register this keypair for the user for the DB.  Put secretkey somewhere else?
  sql`
  INSERT INTO wallets (user_id, public_key, secret_key)
  VALUES (${userId}, ${keypair.publicKey}, ${keypair.secretKey})
  `;

  const wallet = {
    publicKey: keypair.publicKey,
    secretKey: keypair.secretKey,
  }
  console.log(wallet);
  return wallet;

}