import React, { useState, useEffect } from 'react';
import PDFUpload from './components/PDFUpload.jsx';
import VoiceChat from './components/VoiceChat.jsx';
import { api } from './utils/api.js';
import { useTextToSpeech } from './hooks/useVoice.js';
import { FileText, Brain, Loader, AlertCircle, CheckCircle, RefreshCw, MessageCircle, Volume2 } from 'lucide-react';

function App() {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  
  // Text-to-speech hook for speaking summaries and notifications
  const { isSpeaking, speak, stopSpeaking } = useTextToSpeech();

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
    // Also reset any existing session to ensure clean state
    resetSessionOnLoad();
  }, []);

  const resetSessionOnLoad = async () => {
    try {
      await api.resetSession();
      console.log('Session reset on app load');
    } catch (error) {
      console.log('No existing session to reset');
    }
  };

  const checkBackendHealth = async () => {
    try {
      const health = await api.healthCheck();
      setBackendStatus('connected');
      
      // Don't restore any existing PDF state - always start fresh
      console.log('Backend connected, starting with clean state');
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus('disconnected');
      setError('Cannot connect to backend server. Please make sure the Flask server is running on port 5000.');
    }
  };

  const handlePDFUpload = async (file) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.uploadPDF(file);
      setPdfUploaded(true);
      setPdfName(file.name);
      
      // Speak upload success message
      speak(`PDF "${file.name}" uploaded successfully! Processing document and generating summary...`);
      
      // Get document summary
      const summaryResponse = await api.getSummary();
      setSummary(summaryResponse.summary);
      
      // Speak the summary after a short delay
      setTimeout(() => {
        const summaryMessage = `Here is the document summary: ${summaryResponse.summary}. You can now ask questions about this document using voice or text input. What would you like to know?`;
        speak(summaryMessage);
        
        // Add a prompt message to chat after summary is spoken
        setTimeout(() => {
          setLastResponse('I\'ve finished reading the document summary. What questions do you have about this PDF? You can ask using voice by clicking the microphone button, or type your question.');
        }, summaryMessage.length * 50); // Estimate speaking time
      }, 2000);
      
      setLastResponse(`PDF "${file.name}" uploaded successfully! You can now ask questions about it.`);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error || 'Upload failed. Please try again.';
      setError(errorMessage);
      speak(`Upload failed: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (question) => {
    if (!pdfUploaded) {
      setLastResponse('Please upload a PDF first.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.askQuestion(question);
      setLastResponse(response.answer);
    } catch (error) {
      console.error('Question error:', error);
      const errorMessage = error.response?.data?.error || 'Sorry, there was an error processing your question. Please try again.';
      setLastResponse(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    stopSpeaking(); // Stop any current speech
    try {
      await api.resetSession();
      setPdfUploaded(false);
      setPdfName('');
      setSummary('');
      setLastResponse('');
      setError('');
      speak('Session reset successfully. You can upload a new PDF.');
    } catch (error) {
      console.error('Reset error:', error);
      setError('Failed to reset session.');
      speak('Failed to reset session.');
    } finally {
      setIsLoading(false);
    }
  };

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  if (backendStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Backend Disconnected</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">To start the backend server:</p>
            <code className="block bg-gray-100 p-2 rounded text-sm">
              cd backend && python app.py
            </code>
            <button
              onClick={checkBackendHealth}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-12 w-12 text-blue-600 mr-3" />
                  <div>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-bold text-blue-600 mr-2">PDF</div>
                      <div className="text-xl font-semibold text-purple-600">Voice AI</div>
                    </div>
                    <p className="text-sm text-gray-600">AI-powered document reader</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                      backendStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      backendStatus === 'connected' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {backendStatus === 'connected' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  {pdfUploaded && (
                    <button
                      onClick={handleReset}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg px-3 py-1 text-sm font-medium transition-colors"
                      disabled={isLoading}
                    >
                      🔄 Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex-shrink-0 px-6 pb-2">
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-3 shadow-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Two Cards */}
        <div className="flex-1 px-6 pb-4 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Card 1 - PDF Upload/Info + Instructions */}
            <div className="h-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 h-full flex flex-col overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex-shrink-0">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {pdfUploaded ? 'Document Ready' : 'Upload PDF & Instructions'}
                  </h2>
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                  {!pdfUploaded ? (
                    <div className="h-full flex flex-col">
                      {/* PDF Upload Section */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-full max-w-lg">
                          <PDFUpload onUploadSuccess={handlePDFUpload} />
                        </div>
                      </div>
                      
                      {/* Instructions Section */}
                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <div className="text-center mb-6">
                          <div className="flex items-center justify-center mb-2">
                            <MessageCircle className="h-5 w-5 mr-2 text-indigo-600" />
                            <h3 className="text-lg font-bold text-gray-800">How It Works</h3>
                          </div>
                        </div>
                        
                        {isSpeaking && (
                          <div className="mb-6 p-3 bg-blue-50/80 border border-blue-200/50 rounded-xl">
                            <div className="flex items-center justify-center text-blue-700">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                              <span className="text-xs font-medium">🎙️ AI is speaking...</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                          {[
                            { icon: '📄', title: 'Upload PDF', desc: 'Select your document' },
                            { icon: '🎧', title: 'Listen', desc: 'AI reads summary aloud' },
                            { icon: '🎤', title: 'Ask Questions', desc: 'Use voice or text' },
                            { icon: '🤖', title: 'Get Answers', desc: 'AI responds with voice' }
                          ].map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-4 hover:bg-gray-50/50 rounded-xl transition-colors border border-gray-100">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg mb-3 shadow-sm">
                                {step.icon}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm mb-1">{step.title}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Document Info Section */}
                      <div className="text-center mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 inline-block">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <div>
                              <p className="font-medium text-green-800 text-sm">{pdfName}</p>
                              <p className="text-xs text-green-600">Ready for questions</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Summary Section */}
                      {summary && (
                        <div className="mb-6">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium text-gray-800 text-sm flex items-center">
                                <Brain className="h-4 w-4 mr-2 text-purple-600" />
                                AI Summary
                              </h3>
                              <button
                                onClick={() => isSpeaking ? stopSpeaking() : speak(`Document summary: ${summary}`)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg px-3 py-1 text-xs font-medium transition-colors flex items-center"
                              >
                                <Volume2 className="h-3 w-3 mr-1" />
                                {isSpeaking ? 'Stop' : 'Listen'}
                              </button>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed text-center">{summary}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Next Steps Section */}
                      <div className="flex-1">
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center mb-3">
                            <MessageCircle className="h-5 w-5 mr-2 text-indigo-600" />
                            <h3 className="text-base font-bold text-gray-800">Next Steps</h3>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
                          <div className="flex items-center p-3 bg-blue-50/50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                              🎤
                            </div>
                            <p className="text-xs text-gray-700">Use the microphone button to ask questions</p>
                          </div>
                          
                          <div className="flex items-center p-3 bg-purple-50/50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                              💬
                            </div>
                            <p className="text-xs text-gray-700">Type questions in the chat interface</p>
                          </div>
                          
                          <div className="flex items-center p-3 bg-green-50/50 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                              🔊
                            </div>
                            <p className="text-xs text-gray-700">Listen to AI responses automatically</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Card 2 - Voice Chat */}
            <div className="h-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 h-full flex flex-col overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex-shrink-0">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Voice Assistant
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  {pdfUploaded ? (
                    <div className="h-full flex flex-col">
                      {/* Voice Chat Component without its own header */}
                      <div className="flex-1 overflow-hidden">
                        <VoiceChat 
                          onSendMessage={handleSendMessage} 
                          lastResponse={lastResponse}
                          isLoading={isLoading}
                          externalSpeaking={isSpeaking}
                          hideHeader={true}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-6">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Chat</h3>
                        <p className="text-sm text-gray-500">
                          Upload a PDF to start chatting
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-3">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-center">
              <Brain className="h-6 w-6 text-blue-600 mr-2" />
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-blue-600 mr-1">PDF</span>
                <span className="text-base font-semibold text-purple-600">Voice AI</span>
              </div>
              <span className="text-xs text-gray-500 ml-4">
                © 2024 - AI-powered document reader
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;