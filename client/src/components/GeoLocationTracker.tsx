import React, { useState } from 'react';

// Interface for the geolocation data
interface GeoLocationData {
  lat: number;
  lng: number;
  timestamp: string;
}

// Interface for the component state
interface GeoLocationState {
  isLoading: boolean;
  locationData: GeoLocationData | null;
  error: string | null;
  consent: boolean;
  isSupported: boolean;
}

// Props interface for the component
interface GeoLocationTrackerProps {
  onLocationCaptured?: (data: GeoLocationData) => void;
  onError?: (error: string) => void;
}

const GeoLocationTracker: React.FC<GeoLocationTrackerProps> = ({
  onLocationCaptured,
  onError: onErrorCallback
}) => {
  // State management for the component
  const [state, setState] = useState<GeoLocationState>({
    isLoading: false,
    locationData: null,
    error: null,
    consent: false,
    isSupported: 'geolocation' in navigator
  });

  /**
   * Main function to capture user's geolocation
   * Uses the browser's Geolocation API to get current position
   */
  const getGeoLocation = (): void => {
    // Check if geolocation is supported
    if (!state.isSupported) {
      const errorMsg = 'Geolocation is not supported by this browser.';
      setState(prev => ({ ...prev, error: errorMsg }));
      onErrorCallback?.(errorMsg);
      return;
    }

    // Set loading state
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Configure geolocation options
    const options: PositionOptions = {
      enableHighAccuracy: true, // Request high accuracy
      timeout: 10000, // 10 second timeout
      maximumAge: 0 // Don't use cached position
    };

    /**
     * Success callback for getCurrentPosition
     * @param position - The position object containing coordinates
     */
    const onSuccess = (position: GeolocationPosition): void => {
      const { latitude, longitude } = position.coords;
      const timestamp = new Date().toISOString();

      const locationData: GeoLocationData = {
        lat: latitude,
        lng: longitude,
        timestamp
      };

      // Log to console as requested
      console.log('Location captured successfully:', {
        latitude,
        longitude,
        timestamp,
        accuracy: position.coords.accuracy
      });

      // Update state with captured data
      setState(prev => ({
        ...prev,
        isLoading: false,
        locationData,
        consent: true,
        error: null
      }));

      // Call optional callback
      onLocationCaptured?.(locationData);

      // Send data to backend API
      sendLocationToAPI(locationData);
    };

    /**
     * Error callback for getCurrentPosition
     * @param error - The position error object
     */
    const onError = (error: GeolocationPositionError): void => {
      let errorMessage: string;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
        default:
          errorMessage = 'An unknown error occurred while retrieving location.';
          break;
      }

      console.error('Geolocation error:', errorMessage, error);

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      // Call optional error callback
      onErrorCallback?.(errorMessage);
    };

    // Request current position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  };

  /**
   * Sends the captured location data to the backend API
   * @param data - The geolocation data to send
   */
  const sendLocationToAPI = async (data: GeoLocationData): Promise<void> => {
    try {
      console.log('Sending location data to API:', data);

      const response = await fetch('[BACKEND_API_URL]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: data.lat,
          lng: data.lng,
          timestamp: data.timestamp
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Location data sent successfully:', result);

    } catch (error) {
      console.error('Failed to send location data to API:', error);
      
      const errorMsg = error instanceof Error 
        ? `API Error: ${error.message}` 
        : 'Failed to send location data to server';
      
      setState(prev => ({ ...prev, error: errorMsg }));
    }
  };

  /**
   * Resets the component state
   */
  const resetLocation = (): void => {
    setState(prev => ({
      ...prev,
      locationData: null,
      error: null,
      consent: false
    }));
  };

  // Component render
  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '2rem',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1a202c',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        📍 Geolocation Tracker
      </h2>

      {/* Support check */}
      {!state.isSupported && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fed7d7',
          border: '1px solid #fc8181',
          borderRadius: '8px',
          color: '#c53030',
          marginBottom: '1rem'
        }}>
          ❌ Geolocation is not supported by your browser.
        </div>
      )}

      {/* Error display */}
      {state.error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fed7d7',
          border: '1px solid #fc8181',
          borderRadius: '8px',
          color: '#c53030',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {state.error}
        </div>
      )}

      {/* Location data display */}
      {state.locationData && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0fff4',
          border: '1px solid #68d391',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
            ✅ Location Captured Successfully
          </h3>
          <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>
            <strong>Latitude:</strong> {state.locationData.lat.toFixed(6)}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>
            <strong>Longitude:</strong> {state.locationData.lng.toFixed(6)}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>
            <strong>Timestamp:</strong> {new Date(state.locationData.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={getGeoLocation}
          disabled={!state.isSupported || state.isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: state.isLoading ? '#a0aec0' : '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: state.isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            opacity: !state.isSupported ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!state.isLoading && state.isSupported) {
              e.currentTarget.style.backgroundColor = '#3182ce';
            }
          }}
          onMouseLeave={(e) => {
            if (!state.isLoading && state.isSupported) {
              e.currentTarget.style.backgroundColor = '#4299e1';
            }
          }}
        >
          {state.isLoading ? '📍 Getting Location...' : '📍 Get My Location'}
        </button>

        {state.locationData && (
          <button
            onClick={resetLocation}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c53030';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e53e3e';
            }}
          >
            🔄 Reset
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {state.isLoading && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#4a5568'
        }}>
          <div style={{
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '2px solid #e2e8f0',
            borderTop: '2px solid #4299e1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <p style={{ marginTop: '0.5rem' }}>
            Requesting location access...
          </p>
        </div>
      )}

      {/* Consent information */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#4a5568'
      }}>
        <p style={{ margin: 0 }}>
          <strong>Privacy Notice:</strong> Your location data will be captured and sent to our secure backend API. 
          We respect your privacy and only use this data for the intended functionality.
        </p>
      </div>
    </div>
  );
};

export default GeoLocationTracker;
