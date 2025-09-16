const algosdk = require("algosdk");
const fs = require("fs");

async function deployMinimal() {
  console.log("=== Minimal TrueRoots Deployment (No Args) ===");
  
  // Setup client
  const algodClient = new algosdk.Algodv2(
    "", // token
    "https://testnet-api.algonode.cloud", // server
    443 // port
  );
  
  // Your mnemonic
  const mnemonic = "debate verify viable blade evolve pass distance upon direct member arena unfair primary alley merge fringe slab sick day fever runway chronic permit abstract day";
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  
  // Clean the address (remove any whitespace/newlines)
  const cleanAddress = account.addr.toString().trim();
  console.log(`Deploying from account: ${cleanAddress}`);
  
  // Check account balance
  try {
    const accountInfo = await algodClient.accountInformation(cleanAddress).do();
    console.log(`Account balance: ${Number(accountInfo.amount) / 1000000} ALGO`);
    
    if (Number(accountInfo.amount) < 1000000) {
      console.error("❌ Insufficient balance. Please fund your account");
      return;
    }
  } catch (e) {
    console.error("❌ Error fetching account info:", e);
    return;
  }
  
  // Read the compiled contract
  const approvalPath = "./smart_contracts/artifacts/true_roots/TrueRoots.approval.teal";
  const clearPath = "./smart_contracts/artifacts/true_roots/TrueRoots.clear.teal";
  
  if (!fs.existsSync(approvalPath) || !fs.existsSync(clearPath)) {
    console.error("❌ Contract files not found. Please run 'npm run build' first");
    return;
  }
  
  const approvalProgram = fs.readFileSync(approvalPath, "utf8");
  const clearProgram = fs.readFileSync(clearPath, "utf8");
  
  // Compile programs
  console.log("Compiling contract programs...");
  const approvalCompiled = await algodClient.compile(approvalProgram).do();
  const clearCompiled = await algodClient.compile(clearProgram).do();
  
  // Get suggested params
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  // Create the application without args to test basic deployment
  console.log("Creating minimal application transaction...");
  const appCreateTxn = algosdk.makeApplicationCreateTxnFromObject({
    sender: cleanAddress,
    suggestedParams,
    approvalProgram: new Uint8Array(Buffer.from(approvalCompiled.result, "base64")),
    clearProgram: new Uint8Array(Buffer.from(clearCompiled.result, "base64")),
    numGlobalInts: 8,      // Based on your contract state
    numGlobalByteSlices: 10, // Based on your contract state
    numLocalInts: 0,       // No local state
    numLocalByteSlices: 0, // No local state
    // NO appArgs - test if basic deployment works
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  });
  
  // Sign and send
  console.log("Signing transaction...");
  const signedTxn = appCreateTxn.signTxn(account.sk);
  const txId = appCreateTxn.txID().toString();
  
  console.log("Sending transaction to network...");
  await algodClient.sendRawTransaction(signedTxn).do();
  
  // Wait for confirmation
  console.log("⏳ Waiting for confirmation...");
  const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
  
  const appId = result.applicationIndex;
  const appAddress = algosdk.getApplicationAddress(appId);
  
  console.log("\n🎉 SUCCESS! Contract deployed!");
  console.log(`App ID: ${appId}`);
  console.log(`App Address: ${appAddress}`);
  console.log(`Transaction ID: ${txId}`);
  console.log(`View on AlgoExplorer: https://testnet.algoexplorer.io/application/${appId}`);
  
  return {
    appId,
    appAddress,
    txId
  };
}

deployMinimal().catch(console.error);