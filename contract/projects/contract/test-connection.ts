import { AlgorandClient } from "@algorandfoundation/algokit-utils";

async function testConnection() {
  console.log("Testing connection to Algorand testnet...");
  
  try {
    const algorand = AlgorandClient.fromEnvironment();
    console.log("AlgorandClient created successfully");
    
    const algod = algorand.client.algod;
    console.log("Algod client obtained");
    
    const status = await algod.status().do();
    console.log("Testnet status:", status);
    
    console.log("✅ Connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error);
    return false;
  }
}

testConnection();