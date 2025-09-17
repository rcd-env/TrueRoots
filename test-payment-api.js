// Simple test to verify the payment API is working
const testPaymentAPI = async () => {
  try {
    console.log("🧪 Testing Payment API...\n");

    const testPayload = {
      collectorWalletAddress:
        "7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q", // Use treasury address as test
      herbType: "Turmeric",
      quantity: 1,
      estimatedValue: 5.0,
      submissionId: "TEST123",
    };

    console.log("📤 Sending test payment request...");
    console.log("Payload:", JSON.stringify(testPayload, null, 2));

    const response = await fetch(
      "http://localhost:8080/api/payments/collector-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      }
    );

    console.log(`\n📥 Response Status: ${response.status}`);

    const result = await response.json();
    console.log("📥 Response Data:", JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("\n✅ SUCCESS: Payment API is working!");
    } else {
      console.log("\n❌ FAILED: Payment API returned error");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("\n💥 FETCH ERROR:", error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.error("🔧 Server is not running on port 3001");
    } else if (error.message.includes("Failed to fetch")) {
      console.error("🔧 Network error or CORS issue");
    }
  }
};

// Test treasury balance endpoint too
const testTreasuryBalance = async () => {
  try {
    console.log("\n🏦 Testing Treasury Balance API...");

    const response = await fetch(
      "http://localhost:8080/api/payments/treasury-balance"
    );
    const result = await response.json();

    console.log("📊 Treasury Balance:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Treasury balance test failed:", error.message);
  }
};

// Run tests
const runTests = async () => {
  await testTreasuryBalance();
  await testPaymentAPI();
};

runTests();
