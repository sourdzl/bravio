import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

const secret1 = new Uint8Array([75,70,200,208,208,28,127,64,111,171,150,171,72,108,87,191,10,197,145,198,162,97,155,194,224,12,159,254,243,243,71,141,163,17,20,239,89,48,150,152,247,215,70,90,38,0,123,171,181,125,131,39,83,64,71,70,160,239,203,190,208,68,37,162]);
const secret2 = new Uint8Array([158,249,156,146,89,70,185,230,165,239,179,161,237,28,254,72,61,0,41,48,48,88,245,75,82,138,69,57,5,179,3,147,178,159,5,111,89,239,93,15,66,66,246,128,200,161,204,82,222,17,124,120,213,176,253,214,52,206,217,49,153,138,174,251]);

const fromKeypair = Keypair.fromSecretKey(secret1);//.generate();
const toKeypair = Keypair.fromSecretKey(secret2);//.generate();

const connection = new Connection(
    //todo: real prod URL
    process.env.DEPLOY_ENV === "prod" ? "https://api.solana.com" : "https://api.devnet.solana.com",
    "confirmed"
);


async function requestDevnetSol() {

  console.log(fromKeypair.secretKey.toString());
  console.log(toKeypair.secretKey.toString());


  const airdropSignature = await connection.requestAirdrop(
    fromKeypair.publicKey,
    LAMPORTS_PER_SOL
  );

  return await connection.confirmTransaction(airdropSignature);

  }

async function sendDevnetSol(fromKeypair: Keypair, toKeypair: Keypair) {

  const lamportsToSend = 1_000_000;

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: lamportsToSend,
    })
  );

  console.log(`sent ${lamportsToSend} lamports from ${fromKeypair.publicKey} to ${toKeypair.publicKey}`);

  return await sendAndConfirmTransaction(connection, transferTransaction, [
    fromKeypair,
  ]);
}
