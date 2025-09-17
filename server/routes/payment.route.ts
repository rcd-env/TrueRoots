import express from "express";
import algosdk from "algosdk";
import {
  TREASURY_CONFIG,
  getCurrentNetworkConfig,
  createPaymentNote,
} from "../config/treasury";

const router = express.Router();

// Company treasury account configuration
// ⚠️ SECURITY NOTE: In production, this private key should be stored securely
// (environment variables, HashiCorp Vault, AWS Secrets Manager, etc.)
const COMPANY_PRIVATE_KEY = process.env.COMPANY_TREASURY_PRIVATE_KEY || "";

interface PaymentRequest {
  collectorWalletAddress: string;
  herbType: string;
  quantity: number;
  estimatedValue: number;
  submissionId: string;
}

// POST /api/payments/collector-payment
router.post("/collector-payment", async (req, res) => {
  try {
    const {
      collectorWalletAddress,
      herbType,
      quantity,
      estimatedValue,
      submissionId,
    }: PaymentRequest = req.body;

    // Validate input
    if (!collectorWalletAddress || !herbType || !quantity || !estimatedValue) {
      return res.status(400).json({
        success: false,
        error: "Missing required payment parameters",
      });
    }

    // Validate collector wallet address
    if (!algosdk.isValidAddress(collectorWalletAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid collector wallet address",
      });
    }

    // Calculate payment amount (30% of estimated value)
    const paymentAmount =
      estimatedValue * TREASURY_CONFIG.COLLECTOR_PAYMENT_PERCENTAGE;

    // Check minimum payment threshold
    if (paymentAmount < TREASURY_CONFIG.MIN_PAYMENT_ALGO) {
      return res.status(400).json({
        success: false,
        error: `Payment amount ${paymentAmount} ALGO is below minimum threshold of ${TREASURY_CONFIG.MIN_PAYMENT_ALGO} ALGO`,
      });
    }

    // Initialize Algorand client
    const networkConfig = getCurrentNetworkConfig();
    const algodClient = new algosdk.Algodv2(
      networkConfig.ALGOD_TOKEN,
      networkConfig.ALGOD_SERVER,
      networkConfig.ALGOD_PORT
    );

    // Check if company has enough balance
    const companyAccountInfo = await algodClient
      .accountInformation(TREASURY_CONFIG.COMPANY_WALLET_ADDRESS)
      .do();
    const companyBalance = Number(companyAccountInfo.amount) / 1000000; // Convert microALGOs to ALGOs

    if (companyBalance < paymentAmount + 0.001) {
      // +0.001 for transaction fee
      return res.status(400).json({
        success: false,
        error: `Insufficient company treasury balance. Available: ${companyBalance} ALGO, Required: ${
          paymentAmount + 0.001
        } ALGO`,
      });
    }

    // Create payment transaction
    const suggestedParams = await algodClient.getTransactionParams().do();
    const paymentAmountMicroAlgos = Math.round(paymentAmount * 1000000);

    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: TREASURY_CONFIG.COMPANY_WALLET_ADDRESS,
      receiver: collectorWalletAddress,
      amount: paymentAmountMicroAlgos,
      suggestedParams,
      note: new TextEncoder().encode(
        createPaymentNote(submissionId, herbType, quantity)
      ),
    });

    // Sign transaction with company private key
    if (!COMPANY_PRIVATE_KEY) {
      throw new Error("Company treasury private key not configured");
    }

    const companyAccount = algosdk.mnemonicToSecretKey(COMPANY_PRIVATE_KEY);
    const signedTxn = paymentTxn.signTxn(companyAccount.sk);

    // Submit transaction to network
    const txnResult = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(
      algodClient,
      txnResult.txid,
      4
    );

    console.log(`✅ Payment successful! Transaction ID: ${txnResult.txid}`);
    console.log(`💰 Sent ${paymentAmount} ALGO to ${collectorWalletAddress}`);

    // Log the confirmed transaction to see what BigInt values exist
    console.log(
      "🔍 Confirmed transaction object:",
      JSON.stringify(confirmedTxn, (key, value) =>
        typeof value === "bigint" ? `[BigInt: ${value}]` : value
      )
    );

    // Create safe response data (convert all potential BigInts)
    const responseData = {
      transactionId: String(txnResult.txid),
      paymentAmount: Number(paymentAmount),
      recipientAddress: String(collectorWalletAddress),
      blockNumber: confirmedTxn.confirmedRound
        ? Number(confirmedTxn.confirmedRound)
        : 0,
      submissionId: String(submissionId),
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Sending response data:", JSON.stringify(responseData));

    // Send response with explicit Content-Type and manual stringify to avoid BigInt issues
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        success: true,
        data: responseData,
      })
    );
  } catch (error) {
    console.error("❌ Payment failed:", error);

    res.status(500);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Payment processing failed",
      })
    );
  }
});

// GET /api/payments/treasury-balance
router.get("/treasury-balance", async (req, res) => {
  try {
    const networkConfig = getCurrentNetworkConfig();
    const algodClient = new algosdk.Algodv2(
      networkConfig.ALGOD_TOKEN,
      networkConfig.ALGOD_SERVER,
      networkConfig.ALGOD_PORT
    );

    const accountInfo = await algodClient
      .accountInformation(TREASURY_CONFIG.COMPANY_WALLET_ADDRESS)
      .do();
    const balance = Number(accountInfo.amount) / 1000000; // Convert to ALGOs

    // Create safe response data
    const responseData = {
      walletAddress: String(TREASURY_CONFIG.COMPANY_WALLET_ADDRESS),
      balance: Number(balance),
      currency: "ALGO",
      network: String(TREASURY_CONFIG.CURRENT_ENV),
    };

    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        success: true,
        data: responseData,
      })
    );
  } catch (error) {
    console.error("❌ Failed to fetch treasury balance:", error);

    res.status(500);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch treasury balance",
      })
    );
  }
});

export default router;
