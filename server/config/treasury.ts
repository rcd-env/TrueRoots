// Treasury Configuration for TrueRoots Company
// This represents the company's payment account that funds collector payments

export const TREASURY_CONFIG = {
  // Company Treasury Account (TestNet)
  // In production: This would be a secure company-controlled account
  COMPANY_WALLET_ADDRESS:
    "2JKDG32I5H5AZQXAGVWWWWZNZNQFPUVY2R7HYQ3A2KTMYH4EBGTQA77YBE", // Test TestNet address

  // Company name for transaction notes
  COMPANY_NAME: "TrueRoots",

  // Payment configuration
  COLLECTOR_PAYMENT_PERCENTAGE: 0.3, // 30% of estimated value

  // Algorand network configuration
  ALGORAND_NETWORK: {
    TESTNET: {
      ALGOD_SERVER: "https://testnet-api.algonode.cloud",
      ALGOD_PORT: "",
      ALGOD_TOKEN: "",
    },
    MAINNET: {
      ALGOD_SERVER: "https://mainnet-api.algonode.cloud",
      ALGOD_PORT: "",
      ALGOD_TOKEN: "",
    },
  },

  // Current environment
  CURRENT_ENV: "TESTNET" as "TESTNET" | "MAINNET",

  // Minimum payment threshold (to avoid micro-payments)
  MIN_PAYMENT_ALGO: 0.001, // Minimum 0.001 ALGO

  // Transaction notes
  PAYMENT_NOTE: "TrueRoots Collector Payment - 30% of submitted herbs value",
};

// Helper function to get current network config
export const getCurrentNetworkConfig = () => {
  return TREASURY_CONFIG.ALGORAND_NETWORK[TREASURY_CONFIG.CURRENT_ENV];
};

// Helper function to format payment note
export const createPaymentNote = (
  collectorId: string,
  herbType: string,
  quantity: number
) => {
  return `${TREASURY_CONFIG.PAYMENT_NOTE} | Collector: ${collectorId} | Herb: ${herbType} | Qty: ${quantity}kg`;
};
