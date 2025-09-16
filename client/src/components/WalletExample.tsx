import React, { useState } from 'react';
import WalletConnect from './WalletConnect';

/**
 * Example component demonstrating how to use the WalletConnect component
 * This shows how to integrate wallet functionality with your application logic
 */
const WalletExample: React.FC = () => {
  // State to track wallet connection and user data
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<string[]>([]);

  /**
   * Handle wallet connection
   * This function is called when the user successfully connects their wallet
   */
  const handleWalletConnect = (address: string) => {
    console.log('Wallet connected in parent component:', address);
    setConnectedAddress(address);
    
    // Here you can add logic to:
    // - Fetch user's Algorand balance
    // - Load transaction history
    // - Initialize blockchain interactions
    // - Update user profile
    
    // Example: Simulate fetching balance (replace with actual Algorand API call)
    setTimeout(() => {
      setUserBalance(Math.random() * 1000); // Simulated balance
    }, 1000);
  };

  /**
   * Handle wallet disconnection
   * This function is called when the user disconnects their wallet
   */
  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected in parent component');
    setConnectedAddress(null);
    setUserBalance(null);
    setTransactionHistory([]);
    
    // Here you can add logic to:
    // - Clear user session
    // - Reset application state
    // - Redirect to login page
    // - Clear cached data
  };

  /**
   * Example function to simulate a blockchain transaction
   * This would be replaced with actual Algorand transaction logic
   */
  const simulateTransaction = () => {
    if (!connectedAddress) {
      alert('Please connect your wallet first');
      return;
    }

    const txId = `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setTransactionHistory(prev => [...prev, txId]);
    alert(`Transaction simulated: ${txId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Algorand Wallet Integration Example
        </h1>
        <p className="text-gray-600">
          This demonstrates how to integrate the WalletConnect component with your application
        </p>
      </div>

      {/* Wallet Connection Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
        <WalletConnect 
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
          className="mb-4"
        />
      </div>

      {/* User Information Section */}
      {connectedAddress && (
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Connected Wallet Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wallet Address */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Wallet Address</h3>
              <p className="text-sm font-mono text-gray-600 break-all">
                {connectedAddress}
              </p>
            </div>

            {/* Balance */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Balance</h3>
              <p className="text-lg font-semibold text-green-600">
                {userBalance !== null ? `${userBalance.toFixed(2)} ALGO` : 'Loading...'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={simulateTransaction}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Simulate Transaction
            </button>
            
            <button
              onClick={() => alert('Feature coming soon!')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View on AlgoExplorer
            </button>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {transactionHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <div className="space-y-2">
            {transactionHistory.map((txId, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-sm text-gray-600">{txId}</span>
                <span className="text-xs text-gray-500">Simulated</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Instructions */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Integration Instructions
        </h2>
        
        <div className="space-y-4 text-sm text-blue-700">
          <div>
            <h3 className="font-medium mb-2">1. Import the Component</h3>
            <code className="block bg-white p-2 rounded text-blue-900 font-mono">
              import WalletConnect from './components/WalletConnect';
            </code>
          </div>

          <div>
            <h3 className="font-medium mb-2">2. Use in Your Component</h3>
            <code className="block bg-white p-2 rounded text-blue-900 font-mono">
              {`<WalletConnect 
  onConnect={(address) => console.log('Connected:', address)}
  onDisconnect={() => console.log('Disconnected')}
/>`}
            </code>
          </div>

          <div>
            <h3 className="font-medium mb-2">3. Handle Connection Events</h3>
            <p>
              Use the onConnect and onDisconnect callbacks to integrate wallet state 
              with your application logic, such as fetching user data, enabling features, 
              or updating the UI.
            </p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Component Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-green-600">✅ Included Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pera Wallet integration</li>
              <li>• Automatic session restoration</li>
              <li>• Error handling & user feedback</li>
              <li>• Responsive design</li>
              <li>• TypeScript support</li>
              <li>• Tailwind CSS styling</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-blue-600">🔧 Customizable</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Custom styling via className</li>
              <li>• Connection/disconnection callbacks</li>
              <li>• Error message handling</li>
              <li>• Button text and appearance</li>
              <li>• Loading states</li>
              <li>• Address display format</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletExample;
