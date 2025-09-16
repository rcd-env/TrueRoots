import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import type { ChatMessage, Batch } from '../types';

interface ChatBotProps {
  batch?: Batch;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ batch, isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: batch 
          ? `Hi! I'm here to help you understand the provenance of this ${batch.herb.name} batch. What would you like to know?`
          : 'Hi! I can help explain herb provenance and traceability. How can I assist you?',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, batch]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (!batch) {
      return "I'd be happy to help! Please scan a QR code first so I can tell you about a specific herb batch.";
    }

    // Simple keyword-based responses
    if (message.includes('collect') || message.includes('farm') || message.includes('grow')) {
      return `This ${batch.herb.name} was collected by ${batch.collector.name}, a verified farmer from ${batch.collector.location.address}. They collected ${batch.quantity} ${batch.unit} on ${new Date(batch.collectionDate).toLocaleDateString()}. ${batch.collector.name} has a ${batch.collector.rating}/5 rating and has made ${batch.collector.totalCollections} collections with us.`;
    }
    
    if (message.includes('safe') || message.includes('test') || message.includes('quality')) {
      const labResults = batch.labResults || [];
      if (labResults.length > 0) {
        const compliantTests = labResults.filter(r => r.isCompliant).length;
        return `Yes, this batch is safe! It has passed ${compliantTests} out of ${labResults.length} lab tests. The tests include ${labResults.map(r => r.testType).join(', ')}. All results show the herb meets safety standards for heavy metals, microbial content, and other quality parameters.`;
      } else {
        return `This batch has been verified by our enterprise partners, but lab test results are still pending. Once available, you'll see detailed safety certificates here.`;
      }
    }
    
    if (message.includes('payment') || message.includes('money') || message.includes('paid')) {
      if (batch.paymentProof) {
        return `The farmer was fairly compensated! ${batch.collector.name} received ₹${batch.paymentProof.amount} for this ${batch.quantity} ${batch.unit} collection. The payment was processed via blockchain on ${new Date(batch.paymentProof.paymentDate).toLocaleDateString()}, ensuring transparency and immediate transfer.`;
      } else {
        return `Payment information is being processed and will be available soon.`;
      }
    }
    
    if (message.includes('where') || message.includes('location') || message.includes('place')) {
      return `This ${batch.herb.name} was collected from ${batch.location.address || 'a verified location'} (coordinates: ${batch.location.latitude.toFixed(4)}, ${batch.location.longitude.toFixed(4)}). The region is known for producing high-quality ${batch.herb.name} due to its ideal soil and climate conditions.`;
    }
    
    if (message.includes('benefit') || message.includes('property') || message.includes('use')) {
      return `${batch.herb.name} (${batch.herb.scientificName}) is known for these properties: ${batch.herb.properties.join(', ')}. ${batch.herb.description} It's traditionally harvested during ${batch.herb.harvestSeason.join(' and ')} seasons for optimal potency.`;
    }
    
    if (message.includes('blockchain') || message.includes('verify') || message.includes('authentic')) {
      return `This batch is recorded on blockchain for complete transparency! Every step from collection to your hands is permanently recorded. The batch ID ${batch.id} contains immutable records of collection, payment, verification, and lab testing. You can trust this is authentic ${batch.herb.name}.`;
    }
    
    if (message.includes('timeline') || message.includes('journey') || message.includes('process')) {
      const timelineSteps = batch.timeline.length;
      return `This batch has gone through ${timelineSteps} verified steps: ${batch.timeline.map(t => t.title).join(' → ')}. Each step is timestamped and recorded on blockchain, creating a complete audit trail from farm to your product.`;
    }
    
    // Default response
    return `I can help you understand this ${batch.herb.name} batch! You can ask me about:
    
• How it was collected and by whom
• Safety and lab test results  
• Payment to the farmer
• Location and growing conditions
• Health benefits and properties
• Blockchain verification
• The complete journey timeline

What interests you most?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputMessage),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How was this herb collected?",
    "Is this herb safe and tested?", 
    "Tell me about the farmer",
    "What are the health benefits?"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">TrueRoots Assistant</h3>
              <p className="text-xs text-gray-600">Ask about provenance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary-600' 
                        : 'bg-gray-200'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    
                    <div className={`px-3 py-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="grid grid-cols-1 gap-1">
                  {quickQuestions.slice(0, 2).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputMessage(question);
                        setTimeout(handleSendMessage, 100);
                      }}
                      className="text-left text-xs text-primary-600 hover:bg-primary-50 p-2 rounded transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask about this batch..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
