import React, { useState, useEffect } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

// Initialize Pera Wallet Connect instance
const peraWallet = new PeraWalletConnect();

// Interface for component props
interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  className?: string;
}

// Interface for wallet state
interface WalletState {
  isConnected: boolean;
  accountAddress: string | null;
  isConnecting: boolean;
  error: string | null;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  className = ''
}) => {
  // State management for wallet connection
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    accountAddress: null,
    isConnecting: false,
    error: null
  });

  /**
   * Truncates wallet address for display purposes
   * @param address - Full wallet address
   * @returns Truncated address (e.g., "FG4E...JK8L")
   */
  const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  /**
   * Handles wallet connection process
   * Initiates connection request to Pera Wallet
   */
  const handleConnect = async (): Promise<void> => {
    try {
      // Set connecting state
      setWalletState(prev => ({
        ...prev,
        isConnecting: true,
        error: null
      }));

      console.log('Initiating wallet connection...');

      // Request connection to Pera Wallet
      const newAccounts = await peraWallet.connect();
      
      if (newAccounts && newAccounts.length > 0) {
        const accountAddress = newAccounts[0];
        
        console.log('Wallet connected successfully:', accountAddress);

        // Update state with connected wallet
        setWalletState({
          isConnected: true,
          accountAddress,
          isConnecting: false,
          error: null
        });

        // Call optional callback
        onConnect?.(accountAddress);
      } else {
        throw new Error('No accounts returned from wallet');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      let errorMessage = 'Failed to connect wallet';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Connection rejected by user';
        } else if (error.message.includes('No accounts')) {
          errorMessage = 'No accounts found in wallet';
        } else {
          errorMessage = error.message;
        }
      }

      // Update state with error
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage
      }));
    }
  };

  /**
   * Handles wallet disconnection
   * Disconnects from Pera Wallet and clears state
   */
  const handleDisconnect = (): void => {
    try {
      console.log('Disconnecting wallet...');
      
      // Disconnect from Pera Wallet
      peraWallet.disconnect();
      
      // Reset wallet state
      setWalletState({
        isConnected: false,
        accountAddress: null,
        isConnecting: false,
        error: null
      });

      // Call optional callback
      onDisconnect?.();
      
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error during wallet disconnection:', error);
    }
  };

  /**
   * Clears any existing error messages
   */
  const clearError = (): void => {
    setWalletState(prev => ({
      ...prev,
      error: null
    }));
  };

  /**
   * Effect hook to check for existing wallet connection on component mount
   * Automatically reconnects if user has previously connected
   */
  useEffect(() => {
    const checkExistingConnection = async (): Promise<void> => {
      try {
        console.log('Checking for existing wallet connection...');
        
        // Check if wallet is already connected
        const connectedAccounts = peraWallet.connector?.accounts;
        
        if (connectedAccounts && connectedAccounts.length > 0) {
          const accountAddress = connectedAccounts[0];
          
          console.log('Existing connection found:', accountAddress);
          
          // Restore connection state
          setWalletState({
            isConnected: true,
            accountAddress,
            isConnecting: false,
            error: null
          });

          // Call optional callback
          onConnect?.(accountAddress);
        } else {
          console.log('No existing connection found');
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    };

    checkExistingConnection();

    // Set up event listener for wallet disconnection
    const handleWalletDisconnect = (): void => {
      console.log('Wallet disconnected via event');
      setWalletState({
        isConnected: false,
        accountAddress: null,
        isConnecting: false,
        error: null
      });
      onDisconnect?.();
    };

    // Listen for disconnect events
    peraWallet.connector?.on('disconnect', handleWalletDisconnect);

    // Cleanup event listener on component unmount
    return () => {
      peraWallet.connector?.off('disconnect');
    };
  }, [onConnect, onDisconnect]);

  return (
    <div className={`wallet-connect ${className}`}>
      {/* Error Message Display */}
      {walletState.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">{walletState.error}</span>
            <button
              onClick={clearError}
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
              aria-label="Clear error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Wallet Connection UI */}
      <div className="flex items-center justify-center">
        {!walletState.isConnected ? (
          // Connect Wallet Button
          <button
            onClick={handleConnect}
            disabled={walletState.isConnecting}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200
              ${walletState.isConnecting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {walletState.isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                </svg>
                <span>Connect Wallet</span>
              </div>
            )}
          </button>
        ) : (
          // Connected Wallet Display
          <div className="flex items-center space-x-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            {/* Wallet Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Connected</p>
              <p className="text-sm text-gray-500 font-mono">
                {truncateAddress(walletState.accountAddress || '')}
              </p>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Connection Status Info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          {walletState.isConnected 
            ? '🟢 Wallet connected securely' 
            : '🔴 No wallet connected'
          }
        </p>
      </div>
    </div>
  );
};

export default WalletConnect;
