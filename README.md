# Bravio
Starting a simple expo react native mobile app for withdrawing USDC from coinbase and on-ramping into DeFi.

Targeting extremely simplified UX through a custodial experience with no decision making on the user side - 
USDC is sent to a generated Solana wallet, funds are swept into a pooled account and deposited into protocol for USD denomninated yield.

## App
Expo App, WIP.  Bare bones frontend using supabase for authentication.  Not connected to webserver yet.

`npx expo start`

$$ Api

`npm i && npm start`
TRPC server exposing more sensitive logic.  Generate user solana wallets, store keys in supabase, sweep funds into lending protocols.

TODO:
Support withdrawals.
