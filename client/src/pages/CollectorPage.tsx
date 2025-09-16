import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  MapPin,
  CheckCircle,
  AlertCircle,
  Leaf,
  Plus,
  X,
  Award,
} from "lucide-react";

interface CollectionFormData {
  herbId: string;
  firmId: string;
  quantity: number;
  unit: string;
  images: File[];
  notes: string;
}

const CollectorPage = () => {
  const [formData, setFormData] = useState<CollectionFormData>({
    herbId: "",
    firmId: "",
    quantity: 0,
    unit: "kg",
    images: [],
    notes: "",
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<CollectionFormData | null>(
    null
  );
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isVerified: boolean;
    confidence: number;
    ipfsHash: string;
    aiAnalysis: string;
  } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // AI Verification and IPFS Upload Function
  const verifyHerbWithAI = async () => {
    if (formData.images.length === 0) return;

    setIsVerifying(true);

    try {
      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock IPFS hash generation
      const ipfsHash = `Qm${Math.random()
        .toString(36)
        .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      // Mock AI analysis based on selected herb
      const selectedHerb = herbs.find((h) => h.id === formData.herbId);
      const confidence = Math.random() * 20 + 80; // 80-100% confidence

      const analysisResults = [
        `Identified as ${selectedHerb?.name} with ${confidence.toFixed(
          1
        )}% confidence`,
        "Leaf structure and color patterns match expected characteristics",
        "No visible signs of contamination or disease detected",
        "Quality assessment: Premium grade specimen",
        "Recommended for pharmaceutical use",
      ];

      setVerificationResult({
        isVerified: confidence > 85,
        confidence: confidence,
        ipfsHash: ipfsHash,
        aiAnalysis: analysisResults.join(". "),
      });
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationResult({
        isVerified: false,
        confidence: 0,
        ipfsHash: "",
        aiAnalysis: "Verification failed. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Comprehensive herbs data with Algorand pricing based on rarity
  const herbs = [
    // Common Herbs (5-15 ALGO/kg)
    {
      id: "1",
      name: "Turmeric",
      scientificName: "Curcuma longa",
      price: 8,
      rarity: "Common",
      category: "Anti-inflammatory",
    },
    {
      id: "2",
      name: "Ginger",
      scientificName: "Zingiber officinale",
      price: 6,
      rarity: "Common",
      category: "Digestive",
    },
    {
      id: "3",
      name: "Neem",
      scientificName: "Azadirachta indica",
      price: 10,
      rarity: "Common",
      category: "Antimicrobial",
    },
    {
      id: "4",
      name: "Tulsi",
      scientificName: "Ocimum tenuiflorum",
      price: 12,
      rarity: "Common",
      category: "Adaptogen",
    },
    {
      id: "5",
      name: "Aloe Vera",
      scientificName: "Aloe barbadensis",
      price: 7,
      rarity: "Common",
      category: "Healing",
    },

    // Uncommon Herbs (15-35 ALGO/kg)
    {
      id: "6",
      name: "Ashwagandha",
      scientificName: "Withania somnifera",
      price: 25,
      rarity: "Uncommon",
      category: "Adaptogen",
    },
    {
      id: "7",
      name: "Brahmi",
      scientificName: "Bacopa monnieri",
      price: 30,
      rarity: "Uncommon",
      category: "Nootropic",
    },
    {
      id: "8",
      name: "Triphala",
      scientificName: "Terminalia chebula",
      price: 20,
      rarity: "Uncommon",
      category: "Digestive",
    },
    {
      id: "9",
      name: "Guduchi",
      scientificName: "Tinospora cordifolia",
      price: 28,
      rarity: "Uncommon",
      category: "Immunomodulator",
    },
    {
      id: "10",
      name: "Shankhpushpi",
      scientificName: "Convolvulus pluricaulis",
      price: 32,
      rarity: "Uncommon",
      category: "Nootropic",
    },
    {
      id: "11",
      name: "Arjuna",
      scientificName: "Terminalia arjuna",
      price: 22,
      rarity: "Uncommon",
      category: "Cardiotonic",
    },

    // Rare Herbs (35-75 ALGO/kg)
    {
      id: "12",
      name: "Shatavari",
      scientificName: "Asparagus racemosus",
      price: 45,
      rarity: "Rare",
      category: "Reproductive Health",
    },
    {
      id: "13",
      name: "Safed Musli",
      scientificName: "Chlorophytum borivilianum",
      price: 65,
      rarity: "Rare",
      category: "Aphrodisiac",
    },
    {
      id: "14",
      name: "Bhringraj",
      scientificName: "Eclipta prostrata",
      price: 40,
      rarity: "Rare",
      category: "Hair Care",
    },
    {
      id: "15",
      name: "Jatamansi",
      scientificName: "Nardostachys jatamansi",
      price: 55,
      rarity: "Rare",
      category: "Nervine",
    },
    {
      id: "16",
      name: "Vidanga",
      scientificName: "Embelia ribes",
      price: 50,
      rarity: "Rare",
      category: "Antiparasitic",
    },

    // Very Rare Herbs (75-150 ALGO/kg)
    {
      id: "17",
      name: "Shilajit",
      scientificName: "Asphaltum punjabinum",
      price: 120,
      rarity: "Very Rare",
      category: "Rejuvenative",
    },
    {
      id: "18",
      name: "Cordyceps",
      scientificName: "Cordyceps sinensis",
      price: 140,
      rarity: "Very Rare",
      category: "Adaptogen",
    },
    {
      id: "19",
      name: "Kesar",
      scientificName: "Crocus sativus",
      price: 150,
      rarity: "Very Rare",
      category: "Aromatic",
    },
    {
      id: "20",
      name: "Swarna Bhasma",
      scientificName: "Aurum metallicum",
      price: 135,
      rarity: "Very Rare",
      category: "Metallic",
    },

    // Legendary Herbs (150+ ALGO/kg)
    {
      id: "21",
      name: "Sanjeevani Booti",
      scientificName: "Selaginella bryopteris",
      price: 200,
      rarity: "Legendary",
      category: "Resurrection",
    },
    {
      id: "22",
      name: "Himalayan Yarsagumba",
      scientificName: "Ophiocordyceps sinensis",
      price: 250,
      rarity: "Legendary",
      category: "Rare Fungus",
    },
    {
      id: "23",
      name: "Black Turmeric",
      scientificName: "Curcuma caesia",
      price: 180,
      rarity: "Legendary",
      category: "Sacred",
    },
    {
      id: "24",
      name: "Brahma Kamal",
      scientificName: "Saussurea obvallata",
      price: 220,
      rarity: "Legendary",
      category: "Sacred Flower",
    },
  ];

  // Pharmaceutical firms data
  const firms = [
    {
      id: "1",
      name: "Himalaya Wellness",
      type: "Ayurvedic",
      location: "Bangalore, India",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Dabur India Ltd",
      type: "Ayurvedic",
      location: "Ghaziabad, India",
      rating: 4.7,
    },
    {
      id: "3",
      name: "Patanjali Ayurved",
      type: "Ayurvedic",
      location: "Haridwar, India",
      rating: 4.6,
    },
    {
      id: "4",
      name: "Baidyanath Group",
      type: "Ayurvedic",
      location: "Kolkata, India",
      rating: 4.5,
    },
    {
      id: "5",
      name: "Zandu Pharmaceuticals",
      type: "Ayurvedic",
      location: "Mumbai, India",
      rating: 4.4,
    },
    {
      id: "6",
      name: "Arya Vaidya Pharmacy",
      type: "Traditional",
      location: "Coimbatore, India",
      rating: 4.9,
    },
    {
      id: "7",
      name: "Kerala Ayurveda",
      type: "Traditional",
      location: "Kochi, India",
      rating: 4.7,
    },
    {
      id: "8",
      name: "Organic India",
      type: "Organic",
      location: "Lucknow, India",
      rating: 4.6,
    },
    {
      id: "9",
      name: "Forest Essentials",
      type: "Luxury Ayurvedic",
      location: "New Delhi, India",
      rating: 4.8,
    },
    {
      id: "10",
      name: "Kama Ayurveda",
      type: "Premium",
      location: "New Delhi, India",
      rating: 4.5,
    },
  ];

  // Camera functions
  const startCamera = async () => {
    try {
      console.log("Starting camera...");

      // Stop any existing camera first
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      // Check if MediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported by this browser");
      }

      let stream;

      // Try different camera configurations for better laptop compatibility
      const cameraConfigs = [
        // First try: Default camera with reasonable constraints
        {
          video: {
            width: { ideal: 640, min: 320, max: 1920 },
            height: { ideal: 480, min: 240, max: 1080 },
            frameRate: { ideal: 30, min: 15, max: 60 },
          },
          audio: false,
        },
        // Second try: Basic video only
        {
          video: true,
          audio: false,
        },
        // Third try: Very basic constraints
        {
          video: {
            width: 640,
            height: 480,
          },
          audio: false,
        },
      ];

      for (let i = 0; i < cameraConfigs.length; i++) {
        try {
          console.log(`Trying camera config ${i + 1}:`, cameraConfigs[i]);
          stream = await navigator.mediaDevices.getUserMedia(cameraConfigs[i]);
          console.log(`Camera config ${i + 1} successful`);
          break;
        } catch (configError) {
          console.log(
            `Camera config ${i + 1} failed:`,
            configError instanceof Error ? configError.message : configError
          );
          if (i === cameraConfigs.length - 1) {
            throw configError;
          }
        }
      }

      if (!stream) {
        throw new Error("Unable to access camera with any configuration");
      }

      console.log("Camera stream obtained:", stream);
      console.log("Video tracks:", stream.getVideoTracks());

      setCameraStream(stream);
      setIsCameraActive(true);

      // Set up video element
      if (videoRef.current) {
        console.log("Setting up video element...");
        videoRef.current.srcObject = stream;

        // Multiple attempts to start video playback
        const playVideo = async () => {
          if (videoRef.current) {
            try {
              await videoRef.current.play();
              console.log("Video is now playing");
            } catch (playError) {
              console.error("Play error:", playError);
              // Try again after a short delay
              setTimeout(playVideo, 200);
            }
          }
        };

        // Start playback immediately and also after a delay
        playVideo();
        setTimeout(playVideo, 100);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      let errorMessage = "Camera access failed. ";

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage += "Please allow camera permissions and try again.";
        } else if (error.name === "NotFoundError") {
          errorMessage +=
            "No camera found. Please connect a camera and try again.";
        } else if (error.name === "NotReadableError") {
          errorMessage += "Camera is already in use by another application.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Unknown camera error occurred.";
      }

      alert(errorMessage);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        console.log("Stopping track:", track);
        track.stop();
      });
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `photo-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, file],
              }));

              // Create preview URL
              const previewUrl = URL.createObjectURL(blob);
              setPreviewImages((prev) => [...prev, previewUrl]);
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed", e.target.files);
    const files = Array.from(e.target.files || []);
    console.log("Files array:", files);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...(files as File[])],
      }));

      // Create preview URLs
      const newPreviews = (files as File[]).map((file: File) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prev) => [...prev, ...newPreviews]);
      console.log("Preview images updated:", newPreviews);
    }
  };

  // Removed unused handleDragDrop function

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store submitted data before resetting form
      setSubmittedData({ ...formData });
      setShowSuccess(true);

      // Reset form
      setFormData({
        herbId: "",
        firmId: "",
        quantity: 0,
        unit: "kg",
        images: [],
        notes: "",
      });
      setPreviewImages([]);
    } catch (error) {
      console.error("Error submitting collection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed unused selectedHerb variable

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #f3f4f6",
          padding: "1rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontFamily: "Playfair Display, serif",
                fontWeight: "700",
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              Herb Collection Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                backgroundColor: "#f0fdf4",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Award size={16} color="#059669" />
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                Collector Level 3
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to log out?")) {
                  window.location.href = "/";
                }
              }}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "3rem 2rem",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <div
          style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              fontFamily: "Playfair Display, serif",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Start Your Collection Journey
          </h2>

          <p
            style={{
              fontSize: "1.125rem",
              color: "#6b7280",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
            }}
          >
            Document your herb collection with photos, location, and details.
            Each verified collection earns you rewards and contributes to the
            blockchain ledger.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#059669",
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#059669",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    color: "white",
                    fontWeight: "700",
                  }}
                >
                  A
                </span>
                163.3
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Total ALGO Earned
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#d97706",
                  marginBottom: "0.25rem",
                }}
              >
                23
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Collections
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#7c3aed",
                  marginBottom: "0.25rem",
                }}
              >
                98%
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Accuracy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ padding: "3rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Progress Steps */}
          <div style={{ marginBottom: "3rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "2rem",
              }}
            >
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor:
                        currentStep >= step ? "#059669" : "#e5e7eb",
                      color: currentStep >= step ? "white" : "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      style={{
                        width: "60px",
                        height: "2px",
                        backgroundColor:
                          currentStep > step ? "#059669" : "#e5e7eb",
                        margin: "0 1rem",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem",
                }}
              >
                {currentStep === 1 && "Select Herb Type"}
                {currentStep === 2 && (
                  <span>
                    Click Photo{" "}
                    <span
                      style={{
                        fontFamily: "Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "1.2em",
                        fontWeight: "300",
                      }}
                    >
                      &
                    </span>{" "}
                    Details
                  </span>
                )}
                {currentStep === 3 && "Herb Verification"}
                {currentStep === 4 && "Verify Location"}
                {currentStep === 5 && (
                  <span>
                    Review{" "}
                    <span style={{ fontFamily: "serif", fontStyle: "italic" }}>
                      &
                    </span>{" "}
                    Submit
                  </span>
                )}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Step {currentStep} of 5
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Herb Selection */}
            {currentStep === 1 && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Leaf size={24} color="#059669" />
                  Choose Your Herb
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "1.5rem",
                    maxHeight: "600px",
                    overflowY: "auto",
                    padding: "0.5rem",
                  }}
                >
                  {herbs.map((herb) => {
                    const getRarityColor = (rarity: string) => {
                      switch (rarity) {
                        case "Common":
                          return {
                            bg: "#f0fdf4",
                            text: "#166534",
                            border: "#bbf7d0",
                          };
                        case "Uncommon":
                          return {
                            bg: "#fef3c7",
                            text: "#92400e",
                            border: "#fcd34d",
                          };
                        case "Rare":
                          return {
                            bg: "#fdf2f8",
                            text: "#be185d",
                            border: "#f9a8d4",
                          };
                        case "Very Rare":
                          return {
                            bg: "#f3e8ff",
                            text: "#7c3aed",
                            border: "#c4b5fd",
                          };
                        case "Legendary":
                          return {
                            bg: "#fef2f2",
                            text: "#dc2626",
                            border: "#fca5a5",
                          };
                        default:
                          return {
                            bg: "#f9fafb",
                            text: "#6b7280",
                            border: "#d1d5db",
                          };
                      }
                    };

                    const rarityColors = getRarityColor(herb.rarity);

                    return (
                      <div
                        key={herb.id}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, herbId: herb.id }))
                        }
                        style={{
                          padding: "1.5rem",
                          border:
                            formData.herbId === herb.id
                              ? "2px solid #059669"
                              : "2px solid #f3f4f6",
                          borderRadius: "16px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backgroundColor:
                            formData.herbId === herb.id ? "#f0fdf4" : "#ffffff",
                          position: "relative",
                          boxShadow:
                            formData.herbId === herb.id
                              ? "0 8px 25px rgba(5, 150, 105, 0.15)"
                              : "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                        onMouseEnter={(e) => {
                          if (formData.herbId !== herb.id) {
                            e.currentTarget.style.borderColor = "#d1d5db";
                            e.currentTarget.style.transform =
                              "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 25px rgba(0, 0, 0, 0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.herbId !== herb.id) {
                            e.currentTarget.style.borderColor = "#f3f4f6";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 8px rgba(0, 0, 0, 0.1)";
                          }
                        }}
                      >
                        {/* Rarity Badge */}
                        <div
                          style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            backgroundColor: rarityColors.bg,
                            color: rarityColors.text,
                            border: `1px solid ${rarityColors.border}`,
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          {herb.rarity}
                        </div>

                        {/* Selection Indicator */}
                        {formData.herbId === herb.id && (
                          <div
                            style={{
                              position: "absolute",
                              top: "1rem",
                              left: "1rem",
                              backgroundColor: "#059669",
                              color: "white",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CheckCircle size={16} />
                          </div>
                        )}

                        <div style={{ marginTop: "0.5rem" }}>
                          <h4
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "700",
                              color: "#1a1a1a",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {herb.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                              fontStyle: "italic",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {herb.scientificName}
                          </p>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#059669",
                              backgroundColor: "#f0fdf4",
                              padding: "0.125rem 0.5rem",
                              borderRadius: "6px",
                              fontWeight: "500",
                            }}
                          >
                            {herb.category}
                          </span>
                        </div>

                        {/* Price Section */}
                        <div
                          style={{
                            marginTop: "1rem",
                            backgroundColor:
                              formData.herbId === herb.id
                                ? "#dcfce7"
                                : "#f8fafc",
                            borderRadius: "12px",
                            padding: "1rem",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Price per kg
                              </div>
                              <div
                                style={{
                                  fontSize: "1.125rem",
                                  fontWeight: "700",
                                  color: "#059669",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    backgroundColor: "#059669",
                                    borderRadius: "50%",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    color: "white",
                                    fontWeight: "700",
                                  }}
                                >
                                  A
                                </span>
                                {herb.price} ALGO
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Est. USD
                              </div>
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "600",
                                  color: "#6b7280",
                                }}
                              >
                                ${(herb.price * 0.15).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Firm Selection - Show only when herb is selected */}
                {formData.herbId && (
                  <div style={{ marginTop: "2rem" }}>
                    <h4
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      Select Pharmaceutical Firm
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "1rem",
                        maxHeight: "400px",
                        overflowY: "auto",
                        padding: "0.5rem",
                      }}
                    >
                      {firms.map((firm) => (
                        <div
                          key={firm.id}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              firmId: firm.id,
                            }))
                          }
                          style={{
                            padding: "1.5rem",
                            border:
                              formData.firmId === firm.id
                                ? "2px solid #059669"
                                : "2px solid #f3f4f6",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            backgroundColor:
                              formData.firmId === firm.id
                                ? "#f0fdf4"
                                : "#ffffff",
                            position: "relative",
                            boxShadow:
                              formData.firmId === firm.id
                                ? "0 4px 12px rgba(5, 150, 105, 0.15)"
                                : "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                          onMouseEnter={(e) => {
                            if (formData.firmId !== firm.id) {
                              e.currentTarget.style.borderColor = "#d1d5db";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (formData.firmId !== firm.id) {
                              e.currentTarget.style.borderColor = "#f3f4f6";
                              e.currentTarget.style.transform = "translateY(0)";
                            }
                          }}
                        >
                          {/* Selection Indicator */}
                          {formData.firmId === firm.id && (
                            <div
                              style={{
                                position: "absolute",
                                top: "1rem",
                                right: "1rem",
                                backgroundColor: "#059669",
                                color: "white",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CheckCircle size={16} />
                            </div>
                          )}

                          <h5
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "700",
                              color: "#1a1a1a",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {firm.name}
                          </h5>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.875rem",
                                color: "#059669",
                                backgroundColor: "#f0fdf4",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                fontWeight: "500",
                              }}
                            >
                              {firm.type}
                            </span>
                            <span
                              style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                              }}
                            >
                              ⭐ {firm.rating}
                            </span>
                          </div>

                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                              margin: 0,
                            }}
                          >
                            📍 {firm.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.herbId || !formData.firmId}
                    style={{
                      backgroundColor:
                        formData.herbId && formData.firmId
                          ? "#059669"
                          : "#e5e7eb",
                      color:
                        formData.herbId && formData.firmId
                          ? "white"
                          : "#9ca3af",
                      border: "none",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor:
                        formData.herbId && formData.firmId
                          ? "pointer"
                          : "not-allowed",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Continue to Photos
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Photos & Details */}
            {currentStep === 2 && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: "0.5rem",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  Click Photo{" "}
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1.2em",
                      fontWeight: "300",
                    }}
                  >
                    &
                  </span>{" "}
                  Details
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#6b7280",
                    marginBottom: "2rem",
                    lineHeight: "1.6",
                  }}
                >
                  Upload clear photos of your{" "}
                  {herbs.find((h) => h.id === formData.herbId)?.name} collection
                  and provide quantity details.
                </p>

                {/* Photo Upload */}
                <div style={{ marginBottom: "2rem" }}>
                  {/* Camera Section */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "2rem",
                      textAlign: "center",
                    }}
                  >
                    {!isCameraActive ? (
                      <div>
                        <Camera
                          size={48}
                          color="#6b7280"
                          style={{ marginBottom: "1rem" }}
                        />
                        <h4
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Click Photo of Your Herbs
                        </h4>
                        <p
                          style={{
                            color: "#6b7280",
                            fontSize: "0.875rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          Use your camera to take clear photos of your herb
                          collection
                        </p>

                        <button
                          type="button"
                          onClick={startCamera}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: "#059669",
                            color: "white",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#047857";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#059669";
                          }}
                        >
                          <Camera size={16} />
                          Start Camera
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "1rem",
                          }}
                        >
                          <video
                            ref={videoRef}
                            style={{
                              width: "100%",
                              maxWidth: "500px",
                              height: "auto",
                              minHeight: "300px",
                              borderRadius: "12px",
                              border: "3px solid #059669",
                              objectFit: "cover",
                              backgroundColor: "#000",
                              display: "block",
                            }}
                            autoPlay
                            playsInline
                            muted
                            controls={false}
                            onLoadedMetadata={() => {
                              console.log("Video metadata loaded");
                              if (videoRef.current) {
                                videoRef.current
                                  .play()
                                  .catch((e) =>
                                    console.error("Metadata play failed:", e)
                                  );
                              }
                            }}
                            onLoadedData={() => {
                              console.log("Video data loaded");
                              if (videoRef.current) {
                                videoRef.current
                                  .play()
                                  .catch((e) =>
                                    console.error("Data play failed:", e)
                                  );
                              }
                            }}
                            onCanPlay={() => {
                              console.log("Video can play");
                              if (videoRef.current) {
                                videoRef.current
                                  .play()
                                  .catch((e) =>
                                    console.error("CanPlay play failed:", e)
                                  );
                              }
                            }}
                            onPlay={() => console.log("Video started playing")}
                            onPause={() => console.log("Video paused")}
                            onError={(e) => {
                              console.error("Video error:", e);
                              console.error(
                                "Video error details:",
                                e.currentTarget.error
                              );
                            }}
                            onStalled={() => console.log("Video stalled")}
                            onWaiting={() => console.log("Video waiting")}
                          />
                        </div>
                        <canvas ref={canvasRef} style={{ display: "none" }} />

                        <p
                          style={{
                            textAlign: "center",
                            color: "#059669",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            marginBottom: "1rem",
                          }}
                        >
                          📹 Camera is active - Position your herbs in the frame
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            type="button"
                            onClick={capturePhoto}
                            style={{
                              backgroundColor: "#059669",
                              color: "white",
                              border: "none",
                              padding: "0.75rem 1.5rem",
                              borderRadius: "8px",
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            Capture Photo
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            style={{
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              padding: "0.75rem 1.5rem",
                              borderRadius: "8px",
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            Stop Camera
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />

                  {/* Simple test button */}
                  <div style={{ marginTop: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Test button clicked");
                        console.log("Current images:", formData.images);
                        console.log("Preview images:", previewImages);
                      }}
                      style={{
                        backgroundColor: "#6b7280",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      Debug: Check Images ({formData.images.length})
                    </button>
                  </div>

                  {/* Photo Guidelines */}
                  <div
                    style={{
                      marginTop: "1.5rem",
                      backgroundColor: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      📋 Photo Guidelines
                    </h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#059669",
                            borderRadius: "50%",
                          }}
                        />
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          Clear, well-lit photos
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#059669",
                            borderRadius: "50%",
                          }}
                        />
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          Show herb details clearly
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#059669",
                            borderRadius: "50%",
                          }}
                        />
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          Include packaging/containers
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#059669",
                            borderRadius: "50%",
                          }}
                        />
                        <span
                          style={{ fontSize: "0.875rem", color: "#6b7280" }}
                        >
                          Multiple angles preferred
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Photo Preview Grid */}
                  {previewImages.length > 0 && (
                    <div style={{ marginTop: "2rem" }}>
                      <h5
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                          marginBottom: "1rem",
                        }}
                      >
                        📷 Uploaded Photos ({previewImages.length})
                      </h5>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(150px, 1fr))",
                          gap: "1rem",
                        }}
                      >
                        {previewImages.map((preview, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              borderRadius: "12px",
                              overflow: "hidden",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              transition: "transform 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />

                            {/* Image Overlay */}
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                  "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "flex-end",
                                padding: "0.5rem",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                style={{
                                  backgroundColor: "rgba(239, 68, 68, 0.9)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#ef4444";
                                  e.currentTarget.style.transform =
                                    "scale(1.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "rgba(239, 68, 68, 0.9)";
                                  e.currentTarget.style.transform = "scale(1)";
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>

                            {/* Image Number Badge */}
                            <div
                              style={{
                                position: "absolute",
                                bottom: "0.5rem",
                                left: "0.5rem",
                                backgroundColor: "rgba(5, 150, 105, 0.9)",
                                color: "white",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              #{index + 1}
                            </div>
                          </div>
                        ))}

                        {/* Add More Photos Button */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border: "2px dashed #d1d5db",
                            borderRadius: "12px",
                            height: "150px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            backgroundColor: "#fafafa",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#059669";
                            e.currentTarget.style.backgroundColor = "#f0fdf4";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#d1d5db";
                            e.currentTarget.style.backgroundColor = "#fafafa";
                          }}
                        >
                          <Plus
                            size={24}
                            color="#6b7280"
                            style={{ marginBottom: "0.5rem" }}
                          />
                          <span
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                              fontWeight: "500",
                            }}
                          >
                            Add More
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity & Earnings */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "1rem",
                      }}
                    >
                      Quantity
                    </h4>

                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "2px solid #f3f4f6",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="0"
                          value={formData.quantity || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              quantity: parseFloat(e.target.value) || 0,
                            }))
                          }
                          style={{
                            flex: 1,
                            padding: "0.75rem 1rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            backgroundColor: "#ffffff",
                          }}
                          required
                        />
                        <select
                          value={formData.unit}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              unit: e.target.value,
                            }))
                          }
                          style={{
                            padding: "0.75rem 1rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            minWidth: "80px",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="lbs">lbs</option>
                        </select>
                      </div>

                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          textAlign: "center",
                        }}
                      >
                        Enter the total quantity collected
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "1rem",
                      }}
                    >
                      Estimated Earnings
                    </h4>

                    <div
                      style={{
                        backgroundColor:
                          formData.quantity > 0 ? "#f0fdf4" : "#f8fafc",
                        border:
                          formData.quantity > 0
                            ? "2px solid #bbf7d0"
                            : "2px solid #f3f4f6",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        textAlign: "center",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {formData.quantity > 0 ? (
                        <>
                          <div
                            style={{
                              fontSize: "1.75rem",
                              fontWeight: "700",
                              color: "#059669",
                              marginBottom: "0.5rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: "#059669",
                                borderRadius: "50%",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.875rem",
                                color: "white",
                                fontWeight: "700",
                              }}
                            >
                              A
                            </span>
                            {(
                              formData.quantity *
                              (herbs.find((h) => h.id === formData.herbId)
                                ?.price || 0)
                            ).toFixed(2)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                          >
                            ALGO tokens (~$
                            {(
                              formData.quantity *
                              (herbs.find((h) => h.id === formData.herbId)
                                ?.price || 0) *
                              0.15
                            ).toFixed(2)}{" "}
                            USD)
                          </div>
                        </>
                      ) : (
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#9ca3af",
                          }}
                        >
                          Enter quantity to see earnings
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: "2rem" }}>
                  <h4
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "1rem",
                    }}
                  >
                    Additional Notes (Optional)
                  </h4>

                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "2px solid #f3f4f6",
                      borderRadius: "12px",
                      padding: "1.5rem",
                    }}
                  >
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Add any additional notes about the collection quality, harvesting conditions, or special observations..."
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        minHeight: "100px",
                        resize: "vertical",
                        backgroundColor: "#ffffff",
                        fontFamily: "inherit",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        marginTop: "0.5rem",
                      }}
                    >
                      Include details about quality, harvesting conditions, or
                      any special observations
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#6b7280",
                      border: "1px solid #d1d5db",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={
                      formData.images.length === 0 || !formData.quantity
                    }
                    style={{
                      backgroundColor:
                        formData.images.length > 0 && formData.quantity
                          ? "#059669"
                          : "#e5e7eb",
                      color:
                        formData.images.length > 0 && formData.quantity
                          ? "white"
                          : "#9ca3af",
                      border: "none",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor:
                        formData.images.length > 0 && formData.quantity
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    Continue to Location
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Herb Verification */}
            {currentStep === 3 && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#7c3aed15",
                      borderRadius: "16px",
                      marginBottom: "1rem",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    AI-Powered Herb Verification
                  </h4>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    Our AI will analyze your photos and verify the herb
                    authenticity using IPFS blockchain storage
                  </p>
                </div>

                {!verificationResult && !isVerifying && (
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <button
                      type="button"
                      onClick={verifyHerbWithAI}
                      style={{
                        backgroundColor: "#7c3aed",
                        color: "white",
                        border: "none",
                        padding: "1rem 2rem",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        margin: "0 auto",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6" />
                        <path d="m21 12-6-3-6 3-6-3" />
                      </svg>
                      Start AI Verification
                    </button>
                  </div>
                )}

                {isVerifying && (
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1.5rem 2rem",
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "3px solid #e2e8f0",
                          borderTop: "3px solid #7c3aed",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      <div>
                        <p
                          style={{
                            fontWeight: "600",
                            color: "#1a1a1a",
                            margin: "0",
                          }}
                        >
                          AI Analysis in Progress...
                        </p>
                        <p
                          style={{
                            color: "#6b7280",
                            fontSize: "0.875rem",
                            margin: "0",
                          }}
                        >
                          Uploading to IPFS and analyzing herb characteristics
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationResult && (
                  <div
                    style={{
                      backgroundColor: verificationResult.isVerified
                        ? "#f0fdf4"
                        : "#fef2f2",
                      border: `1px solid ${
                        verificationResult.isVerified ? "#bbf7d0" : "#fecaca"
                      }`,
                      borderRadius: "12px",
                      padding: "1.5rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: verificationResult.isVerified
                            ? "#22c55e"
                            : "#ef4444",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        >
                          {verificationResult.isVerified ? (
                            <path d="M9 12l2 2 4-4" />
                          ) : (
                            <path d="M18 6L6 18M6 6l12 12" />
                          )}
                        </svg>
                      </div>
                      <h5
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                          color: verificationResult.isVerified
                            ? "#166534"
                            : "#dc2626",
                          margin: "0",
                        }}
                      >
                        {verificationResult.isVerified
                          ? "Verification Successful!"
                          : "Verification Failed"}
                      </h5>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <p
                        style={{
                          color: "#374151",
                          fontSize: "0.875rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <strong>Confidence Level:</strong>{" "}
                        {verificationResult.confidence.toFixed(1)}%
                      </p>
                      <p
                        style={{
                          color: "#374151",
                          fontSize: "0.875rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <strong>IPFS Hash:</strong>{" "}
                        <code
                          style={{
                            backgroundColor: "#f3f4f6",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {verificationResult.ipfsHash}
                        </code>
                      </p>
                      <p
                        style={{
                          color: "#374151",
                          fontSize: "0.875rem",
                          marginBottom: "0",
                        }}
                      >
                        <strong>AI Analysis:</strong>{" "}
                        {verificationResult.aiAnalysis}
                      </p>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#6b7280",
                      border: "1px solid #d1d5db",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    disabled={!verificationResult?.isVerified}
                    style={{
                      backgroundColor: verificationResult?.isVerified
                        ? "#059669"
                        : "#e5e7eb",
                      color: verificationResult?.isVerified
                        ? "white"
                        : "#9ca3af",
                      border: "none",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: verificationResult?.isVerified
                        ? "pointer"
                        : "not-allowed",
                    }}
                  >
                    Continue to Location
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Location Verification */}
            {currentStep === 4 && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <MapPin size={24} color="#059669" />
                  Verify Location
                </h3>

                {location ? (
                  <div
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <CheckCircle size={24} color="#059669" />
                      <h4
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                          color: "#059669",
                          margin: 0,
                        }}
                      >
                        Location Captured Successfully
                      </h4>
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#047857",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong>Coordinates:</strong> {location.lat.toFixed(6)},{" "}
                      {location.lng.toFixed(6)}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#047857" }}>
                      <strong>Timestamp:</strong> {new Date().toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#fef3c7",
                      border: "1px solid #fbbf24",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <AlertCircle size={24} color="#d97706" />
                      <h4
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                          color: "#d97706",
                          margin: 0,
                        }}
                      >
                        Getting Location...
                      </h4>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#92400e",
                        margin: 0,
                      }}
                    >
                      Please allow location access to verify your collection
                      site. This ensures authenticity and traceability.
                    </p>
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "1rem",
                    }}
                  >
                    Why do we need your location?
                  </h4>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.5rem",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      lineHeight: "1.6",
                    }}
                  >
                    <li>Verify the authenticity of your collection</li>
                    <li>Ensure herbs are sourced from approved regions</li>
                    <li>Maintain complete supply chain transparency</li>
                    <li>Comply with regulatory requirements</li>
                  </ul>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#6b7280",
                      border: "1px solid #d1d5db",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    disabled={!location}
                    style={{
                      backgroundColor: location ? "#059669" : "#e5e7eb",
                      color: location ? "white" : "#9ca3af",
                      border: "none",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: location ? "pointer" : "not-allowed",
                    }}
                  >
                    Review Submission
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <CheckCircle size={24} color="#059669" />
                  Review{" "}
                  <span style={{ fontFamily: "serif", fontStyle: "italic" }}>
                    &
                  </span>{" "}
                  Submit
                </h3>

                <div style={{ marginBottom: "2rem" }}>
                  {/* Herb Info */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "1rem",
                      }}
                    >
                      Collection Details
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Herb Type
                        </div>
                        <div style={{ fontWeight: "600", color: "#1a1a1a" }}>
                          {herbs.find((h) => h.id === formData.herbId)?.name}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Quantity
                        </div>
                        <div style={{ fontWeight: "600", color: "#1a1a1a" }}>
                          {formData.quantity} {formData.unit}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Photos
                        </div>
                        <div style={{ fontWeight: "600", color: "#1a1a1a" }}>
                          {formData.images.length} uploaded
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Estimated Earnings
                        </div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              width: "16px",
                              height: "16px",
                              backgroundColor: "#059669",
                              borderRadius: "50%",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.625rem",
                              color: "white",
                              fontWeight: "700",
                            }}
                          >
                            A
                          </span>
                          {(
                            formData.quantity *
                            (herbs.find((h) => h.id === formData.herbId)
                              ?.price || 0)
                          ).toFixed(2)}{" "}
                          ALGO
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Info */}
                  {location && (
                    <div
                      style={{
                        backgroundColor: "#f0fdf4",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                          marginBottom: "1rem",
                        }}
                      >
                        Location Verified
                      </h4>
                      <div style={{ fontSize: "0.875rem", color: "#047857" }}>
                        Coordinates: {location.lat.toFixed(6)},{" "}
                        {location.lng.toFixed(6)}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {formData.notes && (
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                          marginBottom: "1rem",
                        }}
                      >
                        Additional Notes
                      </h4>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {formData.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#6b7280",
                      border: "1px solid #d1d5db",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting ? "#9ca3af" : "#059669",
                      color: "white",
                      border: "none",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid #ffffff",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Collection"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "3rem 2rem",
              maxWidth: "500px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                backgroundColor: "#f0fdf4",
                borderRadius: "50%",
                marginBottom: "2rem",
              }}
            >
              <CheckCircle size={40} color="#059669" />
            </div>

            <h3
              style={{
                fontSize: "1.75rem",
                fontFamily: "Playfair Display, serif",
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: "1rem",
              }}
            >
              Collection Submitted Successfully!
            </h3>

            <p
              style={{
                fontSize: "1rem",
                color: "#6b7280",
                lineHeight: "1.6",
                marginBottom: "2rem",
              }}
            >
              Your {herbs.find((h) => h.id === submittedData?.herbId)?.name}{" "}
              collection has been recorded on the blockchain. Payment will be
              processed within 24 hours.
            </p>

            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "2rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Batch ID:
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    color: "#1a1a1a",
                  }}
                >
                  #TR{Date.now().toString().slice(-6)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Quantity:
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                  }}
                >
                  {submittedData?.quantity || 0} {submittedData?.unit || "kg"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Estimated Payment:
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      backgroundColor: "#059669",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.625rem",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    A
                  </span>
                  {(
                    (submittedData?.quantity || 0) *
                    (herbs.find((h) => h.id === submittedData?.herbId)?.price ||
                      0)
                  ).toFixed(2)}{" "}
                  ALGO
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setSubmittedData(null);
                  setCurrentStep(1);
                  setFormData({
                    herbId: "",
                    firmId: "",
                    quantity: 0,
                    unit: "kg",
                    images: [],
                    notes: "",
                  });
                  setPreviewImages([]);
                  setVerificationResult(null);
                  setIsVerifying(false);
                  stopCamera();
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                New Collection
              </button>
              <Link to="/home" style={{ flex: 1, textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "#6b7280",
                    border: "1px solid #d1d5db",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Go Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CollectorPage;
