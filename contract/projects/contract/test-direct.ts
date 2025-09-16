import algosdk from "algosdk";

async function directConnection() {
  console.log("Testing direct AlgoSDK connection...");
  
  try {
    // Direct algosdk connection
    const algodClient = new algosdk.Algodv2(
      "", // token
      "https://testnet-api.algonode.cloud", // server
      443 // port
    );
    
    console.log("Algod client created");
    
    const status = await algodClient.status().do();
    console.log("✅ Direct connection successful!");
    console.log("Last round:", status["last-round"]);
    
    return true;
  } catch (error) {
    console.error("❌ Direct connection failed:", error);
    return false;
  }
}

directConnection();