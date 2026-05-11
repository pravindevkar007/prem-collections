import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { cn } from '../lib/utils.js';
import { motion, AnimatePresence } from 'framer-motion';

const PDFUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        handleFileUpload(file);
      } else {
        setError('Please upload a PDF file only.');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        handleFileUpload(file);
      } else {
        setError('Please upload a PDF file only.');
      }
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError('');
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      await onUploadSuccess(file);
      setUploadProgress(100);
      setUploadedFile(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed. Please try again.');
      clearInterval(progressInterval);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError('');
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 border-2 border-dashed w-full",
        isDragging && "border-primary bg-primary/5 scale-105",
        uploadedFile && "border-green-500 bg-green-50/50",
        error && "border-destructive bg-destructive/5",
        !isDragging && !uploadedFile && !error && "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center space-y-3"
              >
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{uploadProgress}%</span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-base font-medium text-foreground">Processing PDF...</p>
                  <p className="text-xs text-muted-foreground">Extracting content and generating summary</p>
                </div>
                <div className="w-full max-w-xs bg-secondary rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ) : uploadedFile ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center space-y-3"
              >
                <div className="relative">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 bg-green-200 rounded-full -z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    transition={{ delay: 0.2 }}
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base font-semibold text-green-700">{uploadedFile.name}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      {formatFileSize(uploadedFile.size)}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      PDF Document
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Ready for questions!</p>
                </div>
                <Button
                  onClick={resetUpload}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Upload Different PDF
                </Button>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center space-y-3"
              >
                <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-base font-medium text-destructive">Upload Error</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
                <Button
                  onClick={() => setError('')}
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4 w-full"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={cn(
                  "relative transition-all duration-300",
                  isDragging && "scale-110"
                )}>
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Upload className="h-8 w-8" />
                  </div>
                  {isDragging && (
                    <motion.div
                      className="absolute -inset-4 bg-primary/20 rounded-full -z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    />
                  )}
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {isDragging ? 'Drop your PDF here' : 'Upload your PDF'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isDragging ? 'Release to upload' : 'Drag & drop or click to browse'}
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-3 w-full">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="pdf-upload"
                    ref={(input) => { window.pdfFileInput = input; }}
                  />
                  <button
                    onClick={handleButtonClick}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-6 cursor-pointer w-full max-w-xs"
                    type="button"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Choose PDF File</span>
                  </button>
                  
                  <div className="flex items-center justify-center space-x-3 text-xs text-muted-foreground">
                    <span>• Maximum 10MB</span>
                    <span>• PDF format only</span>
                    <span>• Secure processing</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFUpload;