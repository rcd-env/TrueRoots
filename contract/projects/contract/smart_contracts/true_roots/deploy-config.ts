import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import algosdk from "algosdk";
// NOTE: The typed client (TrueRootsFactory) will be generated after running the build script.

export async function deploy() {
  console.log("=== Deploying TrueRoots ===");

  const algorand = AlgorandClient.fromEnvironment();
  const deployer = await algorand.account.fromEnvironment("DEPLOYER");

  console.log(`Deploying from account: ${deployer.addr}`);

  // Dynamically require generated client after build to avoid compile-time missing file errors
  let factory: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TrueRootsFactory } = require("../artifacts/true_roots/TrueRootsClient");
    factory = algorand.client.getTypedAppFactory(TrueRootsFactory, { defaultSender: deployer.addr });
  } catch (error) {
    console.error("Typed client not found. Make sure to run: npm run build");
    throw error;
  }

  // Define deployment parameters
  const deployParams = {
    // admin: deployer address as bytes
    admin: deployer.addr,
    // lab: for demo purposes, using deployer as lab (in production, use different accounts)
    lab: deployer.addr,
    // proc: processor address (using deployer for demo)
    proc: deployer.addr,
    // rewardAsa: 0 for ALGO (in production, create/use your reward ASA)
    rewardAsa: 0,
    // baseReward: 1000000 microALGOs = 1 ALGO
    baseReward: 1_000_000,
  };

  console.log("Deployment parameters:", {
    admin: deployer.addr,
    lab: deployer.addr,
    proc: deployer.addr,
    rewardAsa: deployParams.rewardAsa,
    baseReward: deployParams.baseReward,
  });

  const { appClient, result } = await factory.deploy({
    deployParams,
    onUpdate: "append",
    onSchemaBreak: "append",
  });

  console.log(`✅ Contract deployed!`);
  console.log(`App ID: ${appClient.appId}`);
  console.log(`App Address: ${appClient.appAddress}`);
  console.log(`Operation: ${result.operationPerformed}`);

  // If app was just created, fund the app account
  if (["create", "replace"].includes(result.operationPerformed)) {
    console.log("Funding app account...");
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    });
    console.log("✅ App account funded with 1 ALGO");
  }

  // Test the contract with a basic provenance call
  try {
    console.log("Testing provenance method...");
    const prov = await appClient.send.provenance({});
    console.log("Initial provenance:", prov.return?.toString() || "Empty");
  } catch (e) {
    console.log("⚠️ Provenance call failed (expected for empty state):", (e as Error).message);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log(`\nYou can now interact with your contract at App ID: ${appClient.appId}`);
  console.log(`View on AlgoExplorer: https://testnet.algoexplorer.io/application/${appClient.appId}`);

  return {
    appId: appClient.appId,
    appAddress: appClient.appAddress,
    appClient,
  };
}
