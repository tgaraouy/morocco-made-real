'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Calendar, 
  Clock, 
  Euro, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  MessageCircle,
  Phone,
  MessageSquare,
  Sparkles,
  Heart
} from 'lucide-react';
import BookingAgentService, { BookingFlow, BookingStep } from '@/lib/booking-agent-service';
import AnimatedArtisan from './AnimatedArtisan';

interface BookingAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: any;
  onBookingComplete?: (bookingData: any) => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: number;
  options?: string[];
  stepId?: string;
}

export default function BookingAgentModal({ isOpen, onClose, experience, onBookingComplete }: BookingAgentModalProps) {
  const [bookingFlow, setBookingFlow] = useState<BookingFlow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(experience?.price || 75);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [textInput, setTextInput] = useState('');
  const [existingBooking, setExistingBooking] = useState<any>(null);

  useEffect(() => {
    if (isOpen && experience) {
      checkForExistingBooking();
    }
  }, [isOpen, experience]);

  const checkForExistingBooking = async () => {
    try {
      // Check localStorage for recent booking for this experience
      const storageKey = `booking_${experience.id}_user_demo`;
      const storedBooking = localStorage.getItem(storageKey);
      
      if (storedBooking) {
        const bookingData = JSON.parse(storedBooking);
        const bookingTime = new Date(bookingData.created_at).getTime();
        const now = new Date().getTime();
        const hoursSinceBooking = (now - bookingTime) / (1000 * 60 * 60);
        
        // If booking was created within last 24 hours, show it
        if (hoursSinceBooking < 24 && bookingData.status === 'booked') {
          setExistingBooking(bookingData);
          setIsComplete(true);
          setBookingId(bookingData.id);
          setTotalPrice(bookingData.total_price);
          
          // Show existing booking confirmation
          const artisan = BookingAgentService.getArtisanContact(experience.craftType || 'pottery');
          setChatMessages([
            {
              id: 'existing_greeting',
              type: 'ai',
              content: `Ahlan wa sahlan! I see you already have a CONFIRMED booking with me! Your ${experience.title} experience is all set. 🎉`,
              timestamp: Date.now()
            },
            {
              id: 'existing_confirmation',
              type: 'system',
              content: `✅ STATUS: BOOKED - Your experience is confirmed! I'll contact you soon with final details.`,
              timestamp: Date.now() + 1000
            },
            {
              id: 'existing_options',
              type: 'ai',
              content: `Would you like to book another experience or start fresh?`,
              timestamp: Date.now() + 2000,
              options: ['View my booking details', 'Book another experience', 'Start over'],
              stepId: 'existing_booking_action'
            }
          ]);
          
          // Trigger completion callback to show Artisan Confirmation
          if (onBookingComplete) {
            const fullBookingData = {
              id: bookingData.id,
              responses: bookingData.responses,
              totalPrice: bookingData.total_price,
              bookingDate: bookingData.booking_date
            };
            setTimeout(() => {
              onBookingComplete(fullBookingData);
            }, 4000); // Give time to read the existing booking message
          }
          return;
        }
      }
      
      // No existing booking found, start fresh
      initializeBookingFlow();
    } catch (error) {
      console.error('Error checking for existing booking:', error);
      initializeBookingFlow();
    }
  };

  const initializeBookingFlow = async () => {
    try {
      const flow = await BookingAgentService.getBookingFlow(experience.craftType || 'pottery');
      setBookingFlow(flow);
      
      // Initialize chat with artisan greeting
      setChatMessages([
        {
          id: 'greeting',
          type: 'ai',
          content: flow.artisanGreeting,
          timestamp: Date.now()
        },
        {
          id: 'start',
          type: 'ai',
          content: flow.steps[0].question,
          timestamp: Date.now() + 1000,
          options: flow.steps[0].options,
          stepId: flow.steps[0].id
        }
      ]);
    } catch (error) {
      console.error('Failed to initialize booking flow:', error);
    }
  };

  const handleOptionSelect = (option: string, stepId: string) => {
    if (!bookingFlow) return;

    // Handle existing booking actions
    if (stepId === 'existing_booking_action') {
      if (option === 'View my booking details') {
        const bookingDetails = `📋 **Your Booking Details:**
• Experience: ${existingBooking.experience_title}
• Booking ID: ${existingBooking.id}
• Date: ${existingBooking.responses?.preferred_date || 'To be confirmed'}
• Time: ${existingBooking.responses?.preferred_time || 'To be confirmed'}  
• Group: ${existingBooking.responses?.group_size || 'Not specified'}
• Total: €${existingBooking.total_price}
• Status: BOOKED ✅

I'll contact you soon with final details!`;
        
        setChatMessages(prev => [...prev, 
          { id: `user_${Date.now()}`, type: 'user', content: option, timestamp: Date.now() },
          { id: `details_${Date.now()}`, type: 'ai', content: bookingDetails, timestamp: Date.now() + 500 }
        ]);
        return;
      } else if (option === 'Book another experience') {
        setChatMessages(prev => [...prev, 
          { id: `user_${Date.now()}`, type: 'user', content: option, timestamp: Date.now() },
          { id: `another_${Date.now()}`, type: 'ai', content: 'Great! Please close this dialog and select a different experience from the main page to book another one! 🎯', timestamp: Date.now() + 500 }
        ]);
        return;
      } else if (option === 'Start over') {
        // Clear existing booking and restart
        const storageKey = `booking_${experience.id}_user_demo`;
        localStorage.removeItem(storageKey);
        setExistingBooking(null);
        setIsComplete(false);
        setBookingId(null);
        setCurrentStepIndex(0);
        setUserResponses({});
        setChatMessages([]);
        initializeBookingFlow();
        return;
      }
    }

    const currentStep = bookingFlow.steps[currentStepIndex];
    
    // Add user response to chat
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: option,
      timestamp: Date.now()
    };

    // Generate AI response
    const aiResponse = BookingAgentService.generateAIResponse(currentStep.aiResponse, option);
    const aiMessage: ChatMessage = {
      id: `ai_${Date.now()}`,
      type: 'ai',
      content: aiResponse,
      timestamp: Date.now() + 500
    };

    // Update responses
    const newResponses = { ...userResponses, [stepId]: option };
    setUserResponses(newResponses);

    // Calculate updated price
    if (stepId === 'group_size') {
      const newPrice = BookingAgentService.calculatePrice(experience.price, option);
      setTotalPrice(newPrice);
    }

    setChatMessages(prev => [...prev, userMessage, aiMessage]);

    // Move to next step or complete
    setTimeout(() => {
      if (currentStepIndex < bookingFlow.steps.length - 1) {
        const nextStep = bookingFlow.steps[currentStepIndex + 1];
        const nextMessage: ChatMessage = {
          id: `step_${nextStep.id}`,
          type: 'ai',
          content: nextStep.question,
          timestamp: Date.now(),
          options: nextStep.options,
          stepId: nextStep.id
        };
        setChatMessages(prev => [...prev, nextMessage]);
        setCurrentStepIndex(prev => prev + 1);
      } else {
        completeBooking(newResponses);
      }
    }, 1500);
  };

  const handleDateSelect = (date: string) => {
    if (!bookingFlow) return;

    const currentStep = bookingFlow.steps[currentStepIndex];
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    handleOptionSelect(formattedDate, currentStep.id);
    setSelectedDate(date);
  };

  const handleTextSubmit = () => {
    if (!bookingFlow || !textInput.trim()) return;

    const currentStep = bookingFlow.steps[currentStepIndex];
    handleOptionSelect(textInput, currentStep.id);
    setTextInput('');
  };

  const completeBooking = async (responses: Record<string, any>) => {
    setIsProcessing(true);
    
    try {
      // Create booking with new structure
      const bookingData = {
        experience_id: experience.id,
        user_id: 'user_demo', // In real app, get from auth
        responses: {
          ...responses,
          craft_type: experience.craftType // Include craft type in responses
        },
        total_price: totalPrice,
        booking_date: selectedDate || new Date().toISOString(),
        status: 'booked' as const
      };

      const newBookingId = await BookingAgentService.createBooking(bookingData);
      setBookingId(newBookingId);

      // Save booking to localStorage for persistence
      const completeBookingData = {
        id: newBookingId,
        experience_id: experience.id,
        experience_title: experience.title,
        responses: bookingData.responses,
        total_price: totalPrice,
        booking_date: selectedDate || new Date().toISOString(),
        status: 'booked',
        created_at: new Date().toISOString(),
        craft_type: experience.craftType
      };
      
      const storageKey = `booking_${experience.id}_user_demo`;
      localStorage.setItem(storageKey, JSON.stringify(completeBookingData));

      // Show completion message
      const completionMessage: ChatMessage = {
        id: 'completion',
        type: 'ai',
        content: bookingFlow?.confirmationMessage || "Perfect! Your booking is confirmed!",
        timestamp: Date.now()
      };

      const handoffMessage: ChatMessage = {
        id: 'handoff',
        type: 'system',
        content: `🎉 Status: BOOKED ✅ ${BookingAgentService.getArtisanContact(experience.craftType).name} will contact you within 30 minutes to finalize details and welcome you personally!`,
        timestamp: Date.now() + 1000
      };

      setChatMessages(prev => [...prev, completionMessage, handoffMessage]);
      setIsComplete(true);

      // Trigger completion callback with booking data
      if (onBookingComplete) {
        const fullBookingData = {
          id: newBookingId,
          responses: bookingData.responses,
          totalPrice,
          bookingDate: selectedDate || new Date().toISOString()
        };
        setTimeout(() => {
          onBookingComplete(fullBookingData);
        }, 3000); // Wait 3 seconds to let user see confirmation
      }
    } catch (error) {
      console.error('Failed to complete booking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentStep = (): BookingStep | null => {
    if (!bookingFlow || currentStepIndex >= bookingFlow.steps.length) return null;
    return bookingFlow.steps[currentStepIndex];
  };

  const artisanContact = bookingFlow ? 
    BookingAgentService.getArtisanContact(bookingFlow.categoryId) : 
    { name: 'Artisan', phone: '', whatsapp: '', avatar: '🎨' };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AnimatedArtisan craftType={experience.craftType || 'pottery'} size="sm" />
            </div>
            <div>
              <h3 className="font-semibold">{artisanContact.name}</h3>
              <p className="text-sm opacity-90">Booking Assistant</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="text-white border-white hover:bg-white hover:text-orange-500">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : message.type === 'system'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {/* Options for current step */}
                {message.options && message.stepId && !userResponses[message.stepId] && (
                  <div className="mt-3 space-y-2">
                    {message.options.map((option, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => handleOptionSelect(option, message.stepId!)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Date picker for date steps */}
                {message.stepId?.includes('date') && !userResponses[message.stepId] && (
                  <div className="mt-3">
                    <input
                      type="date"
                      className="w-full p-2 border rounded text-gray-800"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleDateSelect(e.target.value)}
                    />
                  </div>
                )}

                {/* Text input for open-ended questions */}
                {message.stepId === 'special_requests' && !userResponses[message.stepId] && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      className="w-full p-2 border rounded text-gray-800 text-sm"
                      placeholder="Any special requests or requirements..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleOptionSelect('No special requests', message.stepId!)}
                        variant="outline"
                      >
                        Skip
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleTextSubmit}
                        disabled={!textInput.trim()}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="text-sm text-gray-600">Processing your booking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t">
          {!isComplete ? (
            <div className="space-y-3">
              {/* Progress */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Step {currentStepIndex + 1} of {bookingFlow?.steps.length || 1}</span>
                <span className="font-semibold text-green-600">€{totalPrice}</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / (bookingFlow?.steps.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Success message */}
              <div className="text-center py-2">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="mb-2">
                  <Badge className="bg-green-100 text-green-800 font-semibold px-3 py-1">
                    STATUS: BOOKED ✅
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-green-600">Booking Confirmed!</p>
                <p className="text-xs text-gray-600">ID: {bookingId}</p>
              </div>

              {/* Contact buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open(`tel:${artisanContact.phone}`)}
                >
                  <Phone className="w-3 h-3" />
                  Call
                </Button>
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  onClick={() => window.open(`https://wa.me/${artisanContact.whatsapp.replace(/\s/g, '')}`)}
                >
                  <MessageSquare className="w-3 h-3" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 