import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin,
  User,
  Package,
  Shield,
  FileText,
  Star,
  Phone,
  Award,
  Leaf,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ChatBot from '../components/ChatBot';
import type { Batch } from '../types';

const ProvenancePage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  // Mock data for demonstration
  const mockBatch: Batch = {
    id: batchId || 'TR001234',
    herbId: '1',
    herb: {
      id: '1',
      name: 'Ashwagandha',
      scientificName: 'Withania somnifera',
      description: 'A powerful adaptogenic herb known for its stress-reducing properties',
      properties: ['Adaptogenic', 'Anti-stress', 'Immune support'],
      harvestSeason: ['Winter', 'Spring'],
      region: ['Karnataka', 'Rajasthan']
    },
    collectorId: 'C001',
    collector: {
      id: 'C001',
      name: 'Ravi Kumar',
      phone: '+91-9876543210',
      location: { latitude: 12.9716, longitude: 77.5946, address: 'Bangalore Rural, Karnataka' },
      communityName: 'Organic Farmers Collective',
      certifications: ['Organic Certified', 'Fair Trade'],
      joinedDate: '2023-01-15',
      totalCollections: 45,
      rating: 4.8,
      isVerified: true
    },
    status: 'verified',
    quantity: 5.2,
    unit: 'kg',
    collectionDate: '2024-01-15T10:30:00Z',
    location: { latitude: 12.9716, longitude: 77.5946, address: 'Bangalore Rural, Karnataka' },
    images: ['/api/placeholder/400/300'],
    qrCode: 'QR001234',
    paymentProof: {
      id: 'PAY001',
      batchId: batchId || 'TR001234',
      amount: 780,
      currency: 'INR',
      transactionHash: '0x1234...abcd',
      paymentDate: '2024-01-15T12:00:00Z',
      paymentMethod: 'Blockchain Transfer',
      status: 'completed'
    },
    labResults: [
      {
        id: 'LR001',
        batchId: batchId || 'TR001234',
        labName: 'AyurLab Certified Testing',
        testType: 'Heavy Metals Analysis',
        testDate: '2024-01-16T09:00:00Z',
        results: {
          lead: '< 0.1 ppm',
          mercury: '< 0.05 ppm',
          cadmium: '< 0.1 ppm',
          arsenic: '< 0.2 ppm'
        },
        certificateUrl: '/certificates/LR001.pdf',
        ipfsHash: 'QmX1Y2Z3...',
        isCompliant: true,
        uploadedBy: 'Dr. Rajesh Kumar',
        uploadedAt: '2024-01-16T10:30:00Z'
      }
    ],
    timeline: [
      {
        id: 'T1',
        batchId: batchId || 'TR001234',
        type: 'collection',
        title: 'Herb Collected',
        description: 'Ashwagandha roots collected by certified farmer',
        timestamp: '2024-01-15T10:30:00Z',
        location: { latitude: 12.9716, longitude: 77.5946 },
        actor: 'Ravi Kumar'
      },
      {
        id: 'T2',
        batchId: batchId || 'TR001234',
        type: 'payment',
        title: 'Payment Processed',
        description: 'Farmer payment completed via blockchain',
        timestamp: '2024-01-15T12:00:00Z',
        actor: 'TrueRoots System'
      },
      {
        id: 'T3',
        batchId: batchId || 'TR001234',
        type: 'verification',
        title: 'Batch Verified',
        description: 'Quality and authenticity verified by enterprise',
        timestamp: '2024-01-16T09:15:00Z',
        actor: 'AyurCorp Ltd'
      },
      {
        id: 'T4',
        batchId: batchId || 'TR001234',
        type: 'lab_test',
        title: 'Lab Testing Complete',
        description: 'Heavy metals analysis completed - All parameters within limits',
        timestamp: '2024-01-16T10:30:00Z',
        actor: 'AyurLab Certified Testing'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T10:30:00Z'
  };

  useEffect(() => {
    // Simulate API call
    const fetchBatch = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBatch(mockBatch);
      setLoading(false);
    };

    fetchBatch();
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading provenance data..." />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Batch Not Found</h2>
          <p className="text-gray-600">The batch ID {batchId} could not be found.</p>
        </Card>
      </div>
    );
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'collection': return <Leaf className="w-4 h-4" />;
      case 'payment': return <Package className="w-4 h-4" />;
      case 'verification': return <CheckCircle className="w-4 h-4" />;
      case 'lab_test': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'collection': return 'bg-green-100 text-green-600';
      case 'payment': return 'bg-blue-100 text-blue-600';
      case 'verification': return 'bg-purple-100 text-purple-600';
      case 'lab_test': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Herb Provenance
          </h1>
          <StatusBadge status={batch.status} />
        </div>
        <p className="text-gray-600">
          Complete traceability for batch {batch.id}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Herb Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-primary-600" />
              Herb Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{batch.herb.name}</h3>
                <p className="text-sm text-gray-600 italic mb-3">{batch.herb.scientificName}</p>
                <p className="text-gray-700 mb-4">{batch.herb.description}</p>
                
                <div className="space-y-2">
                  <div><span className="font-medium">Quantity:</span> {batch.quantity} {batch.unit}</div>
                  <div><span className="font-medium">Collection Date:</span> {new Date(batch.collectionDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Properties</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {batch.herb.properties.map((property, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      {property}
                    </span>
                  ))}
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">Harvest Regions</h4>
                <div className="flex flex-wrap gap-2">
                  {batch.herb.region.map((region, index) => (
                    <span key={index} className="px-2 py-1 bg-earth-100 text-earth-800 text-xs rounded-full">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-600" />
              Batch Timeline
            </h2>
            
            <div className="space-y-6">
              {batch.timeline.map((event) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getTimelineColor(event.type)}`}>
                    {getTimelineIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">by {event.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lab Results */}
          {batch.labResults && batch.labResults.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Lab Certificates
              </h2>
              
              <div className="space-y-4">
                {batch.labResults.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{result.testType}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.isCompliant ? 'Compliant' : 'Non-Compliant'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Lab: {result.labName}</div>
                      <div>Test Date: {new Date(result.testDate).toLocaleDateString()}</div>
                      <div>Uploaded by: {result.uploadedBy}</div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-3">
                      View Certificate
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Collector Profile */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Collector Profile
            </h2>
            
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900">{batch.collector.name}</h3>
              {batch.collector.isVerified && (
                <div className="flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Verified Collector</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span>{batch.collector.phone}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span>{batch.collector.location.address}</span>
              </div>
              
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span>{batch.collector.rating}/5 ({batch.collector.totalCollections} collections)</span>
              </div>
              
              {batch.collector.communityName && (
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{batch.collector.communityName}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
              <div className="space-y-1">
                {batch.collector.certifications.map((cert, index) => (
                  <span key={index} className="inline-block px-2 py-1 bg-sage-100 text-sage-800 text-xs rounded mr-1">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Payment Proof */}
          {batch.paymentProof && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary-600" />
                Payment Proof
              </h2>
              
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Amount:</span> ₹{batch.paymentProof.amount}</div>
                <div><span className="text-gray-600">Date:</span> {new Date(batch.paymentProof.paymentDate).toLocaleDateString()}</div>
                <div><span className="text-gray-600">Method:</span> {batch.paymentProof.paymentMethod}</div>
                <div><span className="text-gray-600">Status:</span> 
                  <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {batch.paymentProof.status}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-600">Tx Hash:</span>
                  <div className="font-mono text-xs text-gray-800 break-all mt-1">
                    {batch.paymentProof.transactionHash}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Location Map Placeholder */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Collection Location
            </h2>
            
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Interactive map would be here</p>
                <p className="text-xs">Lat: {batch.location.latitude.toFixed(6)}</p>
                <p className="text-xs">Lng: {batch.location.longitude.toFixed(6)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Chatbot */}
      <ChatBot
        batch={batch}
        isOpen={showChatbot}
        onToggle={() => setShowChatbot(!showChatbot)}
      />
    </div>
  );
};

export default ProvenancePage;
