import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, MessageCircle, Loader, Trash2, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Badge } from './ui/badge.jsx';
import { cn } from '../lib/utils.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecognition, useTextToSpeech } from '../hooks/useVoice.js';

const VoiceChat = ({ onSendMessage, lastResponse, isLoading, externalSpeaking = false, hideHeader = false }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  
  const { isListening, transcript, error: voiceError, isSupported, startListening, stopListening, setTranscript, clearError } = useVoiceRecognition();
  const { isSpeaking, speak, stopSpeaking } = useTextToSpeech();

  // Handle voice errors
  useEffect(() => {
    if (voiceError) {
      console.error('Voice error:', voiceError);
      // Show error to user for a few seconds
      setTimeout(() => {
        clearError();
      }, 5000);
    }
  }, [voiceError, clearError]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (lastResponse && lastResponse.trim() && !externalSpeaking) {
      setChatHistory(prev => [...prev, { 
        type: 'response', 
        text: lastResponse, 
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      }]);
      
      // Auto-speak the response only if not externally speaking
      setTimeout(() => {
        speak(lastResponse);
      }, 500);
    } else if (lastResponse && lastResponse.trim() && externalSpeaking) {
      // Just add to chat history without speaking
      setChatHistory(prev => [...prev, { 
        type: 'response', 
        text: lastResponse, 
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      }]);
    }
  }, [lastResponse, speak, externalSpeaking]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setChatHistory(prev => [...prev, { 
      type: 'question', 
      text: userMessage, 
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    }]);
    
    await onSendMessage(userMessage);
    setMessage('');
    setTranscript('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    stopSpeaking();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "h-full flex flex-col",
      !hideHeader && "bg-gradient-to-br from-background to-muted/20 rounded-lg shadow-xl border overflow-hidden"
    )}>
      {/* Chat Header - Only show if hideHeader is false */}
      {!hideHeader && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold flex items-center space-x-3">
              <div className="relative">
                <MessageCircle className="h-6 w-6" />
                {(isListening || isSpeaking) && (
                  <motion.div
                    className="absolute -inset-1 bg-white/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <span>AI Voice Assistant</span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Status Badges */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 voice-wave" />
                      Listening
                    </Badge>
                  </motion.div>
                )}
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge className="bg-green-500 text-white">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Speaking
                    </Badge>
                  </motion.div>
                )}
                {voiceError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge className="bg-red-600 text-white">
                      <MicOff className="w-3 h-3 mr-1" />
                      Voice Error
                    </Badge>
                  </motion.div>
                )}
                {!isSupported && (
                  <Badge className="bg-yellow-500 text-white">
                    Voice Not Supported
                  </Badge>
                )}
              </AnimatePresence>
              
              {chatHistory.length > 0 && (
                <Button
                  onClick={clearChat}
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
          {/* Voice Error Display */}
          {voiceError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-4 mt-4">
              <div className="flex items-center">
                <MicOff className="h-5 w-5 text-red-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Voice Recognition Issue</p>
                  <p className="text-sm text-red-600">{voiceError}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
              {voiceError.includes('Microphone access denied') && (
                <div className="mt-3 p-3 bg-red-100 rounded">
                  <p className="text-xs text-red-700 font-medium mb-2">To enable microphone access:</p>
                  <ol className="text-xs text-red-600 space-y-1">
                    <li>1. Click the microphone icon in your browser's address bar</li>
                    <li>2. Select "Allow" for microphone access</li>
                    <li>3. Refresh the page if needed</li>
                    <li>4. Try the voice feature again</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/10">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="h-10 w-10 text-primary" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 bg-primary/5 rounded-full -z-10"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Start Your Conversation</h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask questions about your PDF using voice or text. I'll provide detailed answers and read them aloud.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="outline">🎤 Voice Input</Badge>
                  <Badge variant="outline">🔊 Audio Responses</Badge>
                  <Badge variant="outline">💬 Smart Answers</Badge>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <AnimatePresence>
                {chatHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "flex",
                      item.type === 'question' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      "flex items-start space-x-3 max-w-[80%]",
                      item.type === 'question' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    )}>
                      {/* Avatar */}
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        item.type === 'question' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {item.type === 'question' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={cn(
                        "rounded-2xl px-4 py-3 shadow-sm border",
                        item.type === 'question'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-card text-card-foreground rounded-bl-md'
                      )}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.text}</p>
                        <p className={cn(
                          "text-xs mt-2 opacity-70",
                          item.type === 'question' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {formatTime(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t bg-card/50 backdrop-blur-sm">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your PDF or use voice..."
                className="min-h-[60px] resize-none border-2 focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            
            {/* Voice Controls */}
            <div className="flex flex-col space-y-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : voiceError ? "outline" : "outline"}
                size="icon"
                className={cn(
                  "transition-all duration-200",
                  isListening && "animate-pulse shadow-lg",
                  voiceError && "border-red-300 text-red-500 hover:bg-red-50",
                  !isSupported && "opacity-50 cursor-not-allowed"
                )}
                disabled={isLoading || !isSupported}
                title={!isSupported ? "Voice recognition not supported in this browser" : voiceError ? voiceError : isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={isSpeaking ? stopSpeaking : () => speak(message)}
                variant={isSpeaking ? "default" : "outline"}
                size="icon"
                disabled={!message.trim() || isLoading}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              size="icon"
              className="h-[60px] w-12"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Status Bar */}
          <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              {isListening && (
                <span className="text-red-600 flex items-center font-medium">
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full mr-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  Listening for your voice...
                </span>
              )}
              {isSpeaking && (
                <span className="text-green-600 flex items-center font-medium">
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full mr-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  Reading response aloud...
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
              <span>to send</span>
              <span>•</span>
              <span>🎤 for voice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;