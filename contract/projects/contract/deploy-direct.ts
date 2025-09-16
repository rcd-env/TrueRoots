import algosdk from "algosdk";
import fs from "fs";

async function deployDirect() {
  console.log("=== Direct Deployment to Testnet ===");
  
  // Setup clients
  const algodClient = new algosdk.Algodv2(
    "", // token
    "https://testnet-api.algonode.cloud", // server
    443 // port
  );
  
  // Your mnemonic from .env.testnet
  const mnemonic = "debate verify viable blade evolve pass distance upon direct member arena unfair primary alley merge fringe slab sick day fever runway chronic permit abstract day";
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  
  console.log(`Deploying from account: ${account.addr}`);
  
  // Check account balance
  const accountInfo = await algodClient.accountInformation(account.addr).do();
  console.log(`Account balance: ${Number(accountInfo.amount) / 1000000} ALGO`);
  
  if (Number(accountInfo.amount) < 1000000) {
    console.error("❌ Insufficient balance. Please fund your account with testnet ALGOs from https://testnet.algoexplorer.io/dispenser");
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
  const approvalCompiled = await algodClient.compile(approvalProgram).do();
  const clearCompiled = await algodClient.compile(clearProgram).do();
  
  // Get suggested params
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  // Create application  
  const addrString = account.addr.toString();
  const addressBytes = algosdk.decodeAddress(addrString).publicKey;
  const appArgs = [
    new Uint8Array(addressBytes), // admin
    new Uint8Array(addressBytes), // lab
    new Uint8Array(addressBytes), // processor
    algosdk.encodeUint64(0), // rewardAsa (0 = ALGO)
    algosdk.encodeUint64(1000000), // baseReward (1 ALGO)
  ];
  
  const appCreateTxn = algosdk.makeApplicationCreateTxnFromObject({
    sender: account.addr,
    suggestedParams,
    approvalProgram: new Uint8Array(Buffer.from(approvalCompiled.result, "base64")),
    clearProgram: new Uint8Array(Buffer.from(clearCompiled.result, "base64")),
    numGlobalInts: 8,
    numGlobalByteSlices: 10,
    numLocalInts: 0,
    numLocalByteSlices: 0,
    appArgs,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  });
  
  // Sign and send
  const signedTxn = appCreateTxn.signTxn(account.sk);
  const txId = appCreateTxn.txID().toString();
  
  console.log("Sending transaction...");
  await algodClient.sendRawTransaction(signedTxn).do();
  
  // Wait for confirmation
  console.log("Waiting for confirmation...");
  const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
  
  const appId = result.applicationIndex;
  console.log(`✅ Contract deployed successfully!`);
  console.log(`App ID: ${appId}`);
  console.log(`Transaction ID: ${txId}`);
  console.log(`View on AlgoExplorer: https://testnet.algoexplorer.io/application/${appId}`);
  
  return appId;
}

deployDirect().catch(console.error);