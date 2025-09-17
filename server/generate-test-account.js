const algosdk = require("algosdk");

// Generate a new test account for demo purposes
const testAccount = algosdk.generateAccount();

console.log("🔑 Generated Test Treasury Account:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📍 Address:", testAccount.addr);
console.log("🔐 Mnemonic:", algosdk.secretKeyToMnemonic(testAccount.sk));
console.log("");
console.log("⚠️  IMPORTANT: This is a TEST account for demo purposes only!");
console.log(
  "💡 For production, use a properly secured account with real funds."
);
console.log("");
console.log("🔧 Add this to your .env file:");
console.log(
  `COMPANY_TREASURY_PRIVATE_KEY="${algosdk.secretKeyToMnemonic(
    testAccount.sk
  )}"`
);
console.log("");
console.log("💰 Fund this account via TestNet faucet:");
console.log(`https://testnet.algoexplorer.io/dispenser`);
console.log("");
console.log("🌐 View account on AlgoExplorer:");
console.log(`https://testnet.algoexplorer.io/address/${testAccount.addr}`);
