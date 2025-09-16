import { AlgorandClient } from "@algorandfoundation/algokit-utils";
// NOTE: The typed client (TrueRootsFactory) will be generated after running the build script.
// To avoid TypeScript errors before generation, we will import dynamically or use any.

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log("=== Deploying TrueRoots ===");

  const algorand = AlgorandClient.fromEnvironment();
  const deployer = await algorand.account.fromEnvironment("DEPLOYER");

  // Dynamically require generated client after build to avoid compile-time missing file errors
  let factory: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TrueRootsFactory } = require("../artifacts/true_roots/TrueRootsClient");
    factory = algorand.client.getTypedAppFactory(TrueRootsFactory, { defaultSender: deployer.addr });
  } catch {
    console.warn("Typed client not found yet. Run: npm run build to generate artifacts.");
    return;
  }

  const { appClient, result } = await factory.deploy({ onUpdate: "append", onSchemaBreak: "append" });

  // If app was just created fund the app account
  if (["create", "replace"].includes(result.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    });
  }

  // Example: provenance read (will be mostly empty initially)
  try {
    const prov = await appClient.send.provenance({});
    console.log("Initial provenance (expected mostly empty):", prov.return);
  } catch (e) {
    console.log("Provenance call pre-batch (expected may fail if missing batch_id):", e);
  }
}
