# Test API Documentation

## 🎯 Overview
The Test API script is a utility tool designed to test NVIDIA API connectivity and find working models. It's essential for troubleshooting API issues and discovering which models are available and functional.

## 🔄 Complete Flow Diagram

### Script Execution → Model Discovery Flow
```
🚀 User Runs: "python test_api.py"
        ↓
📥 main execution → if __name__ == "__main__":
        ↓
🎯 main execution → working_model = test_nvidia_api()
        ↓
🔍 test_nvidia_api() → print("Testing NVIDIA API...")
        ↓
📋 test_nvidia_api() → models_to_try = [list of models]
        ↓
🔄 test_nvidia_api() → for model in models_to_try:
        ↓
        ┌─────────────────────────────────────┐
        │  For Each Model in List:            │
        │  1. ai-llama-3_1-8b-instruct       │
        │  2. ai-llama-3_1-70b-instruct      │
        │  3. ai-mixtral-8x7b-instruct       │
        │  4. ai-gemma-2-2b-it               │
        └─────────────────────────────────────┘
        ↓
🤖 test_nvidia_api() → llm = ChatNVIDIA(model=model, api_key=...)
        ↓
⚡ test_nvidia_api() → response = llm.invoke("Hello! What's today's date?")
        ↓
    ✅ Success?     ❌ Failure?
        ↓              ↓
   Print Success    Print Error
        ↓              ↓
   Return Model     Try Next Model
        ↓              ↓
        └──────┬───────┘
               ↓
📤 main execution → print(f"Use this model: {working_model}")
        ↓
✅ User sees recommended model
```

## 🔧 Step-by-Step Function Call Sequence

### When User Runs: "python test_api.py"

#### Step 1: Script Initialization
```python
# Script starts execution
if __name__ == "__main__":
    working_model = test_nvidia_api()  # ← Calls main testing function
```

#### Step 2: Testing Function Entry
```python
# In test_nvidia_api() function
def test_nvidia_api():
    print("Testing NVIDIA API...")  # ← User feedback
    
    # Step 2a: Define models to test
    models_to_try = [
        "ai-llama-3_1-8b-instruct",    # Fast, smaller model
        "ai-llama-3_1-70b-instruct",   # Larger, more capable
        "ai-mixtral-8x7b-instruct",    # Alternative option
        "ai-gemma-2-2b-it"             # Lightweight option
    ]
```

#### Step 3: Model Testing Loop
```python
# Still in test_nvidia_api() function
    for model in models_to_try:  # ← Iterate through each model
        try:
            print(f"\nTrying model: {model}")  # ← Status update
```

#### Step 4: Individual Model Testing
```python
# Inside the for loop
            # Step 4a: Initialize NVIDIA client
            llm = ChatNVIDIA(
                model=model,
                api_key=os.getenv('NVIDIA_API_KEY'),
                temperature=0.7
            )  # ← Creates ChatNVIDIA instance
            
            # Step 4b: Send test query
            response = llm.invoke("Hello! What's today's date?")  # ← API call
```

#### Step 5: Success Handling
```python
# If API call succeeds
            print(f"SUCCESS with {model}!")  # ← Success message
            print(f"Response: {response.content}")  # ← Show response
            return model  # ← Return first working model
```

#### Step 6: Error Handling
```python
# If API call fails
        except Exception as e:
            print(f"Failed with {model}: {e}")  # ← Error message
            # Continue to next model in loop
```

#### Step 7: No Models Work
```python
# After trying all models
    print("No models worked!")  # ← Final failure message
    return None  # ← No working model found
```

#### Step 8: Result Display
```python
# Back in main execution
    if working_model:
        print(f"\nUse this model in your agent: {working_model}")  # ← Success
    else:
        print("\nNo working models found. Check your API key.")  # ← Failure
```

## 📋 Detailed Function Breakdown

### Function Call Hierarchy
```
Script Execution
├── __main__ check
├── test_nvidia_api()
│   ├── Environment setup (load_dotenv)
│   ├── Model list initialization
│   ├── For each model:
│   │   ├── ChatNVIDIA() initialization
│   │   ├── llm.invoke() API call
│   │   ├── Success handling → return model
│   │   └── Error handling → continue loop
│   └── Final failure handling
└── Result display
```

### Model Testing Flow (Per Model)
```
Model: "ai-llama-3_1-8b-instruct"
        ↓
print("Trying model: ai-llama-3_1-8b-instruct")
        ↓
ChatNVIDIA(model="ai-llama-3_1-8b-instruct", ...)
        ↓
llm.invoke("Hello! What's today's date?")
        ↓
    Success?    Failure?
        ↓          ↓
   Return Model   Print Error
        ↓          ↓
   Exit Function  Try Next Model
```

### Error Scenarios Flow
```
API Call Made
     ↓
  Success?  ──No──→ Exception Caught
     ↓                    ↓
    Yes              Print Error Message
     ↓                    ↓
Return Model        Continue to Next Model
     ↓                    ↓
Script Ends         Loop Continues
                          ↓
                    All Models Tried?
                          ↓
                        Yes
                          ↓
                    Return None
                          ↓
                    "No models worked!"
```

## 🎯 Example Execution Traces

### Successful Execution
```
$ python test_api.py

Testing NVIDIA API...

Trying model: ai-llama-3_1-8b-instruct
Failed with ai-llama-3_1-8b-instruct: [400] Bad Request
Inference error

Trying model: ai-llama-3_1-70b-instruct
SUCCESS with ai-llama-3_1-70b-instruct!
Response: Today's date is May 9, 2024, however I realize my knowledge stopped in 2023...

Use this model in your agent: ai-llama-3_1-70b-instruct
```

### Failed Execution
```
$ python test_api.py

Testing NVIDIA API...

Trying model: ai-llama-3_1-8b-instruct
Failed with ai-llama-3_1-8b-instruct: Invalid API key

Trying model: ai-llama-3_1-70b-instruct
Failed with ai-llama-3_1-70b-instruct: Invalid API key

Trying model: ai-mixtral-8x7b-instruct
Failed with ai-mixtral-8x7b-instruct: Invalid API key

Trying model: ai-gemma-2-2b-it
Failed with ai-gemma-2-2b-it: Invalid API key

No models worked!

No working models found. Check your API key.
```

## 🔄 Integration Flow

### How Test Results Are Used
```
test_api.py finds working model
        ↓
User copies model name
        ↓
Updates agent configuration:

self.llm = ChatNVIDIA(
    model="ai-llama-3_1-70b-instruct",  # ← From test results
    api_key=os.getenv('NVIDIA_API_KEY'),
    temperature=0.7
)
        ↓
Agent uses working model
        ↓
Reliable agent operation
```

## 🔧 Purpose
- **API Connectivity Testing**: Verify NVIDIA API key works
- **Model Discovery**: Find which models are currently available
- **Troubleshooting**: Debug API connection issues
- **Model Selection**: Identify the best working model for your agents

## 📁 Code Structure

### Main Function: `test_nvidia_api()`

#### Model Testing Array
```python
models_to_try = [
    "ai-llama-3_1-8b-instruct",    # Fast, smaller model
    "ai-llama-3_1-70b-instruct",   # Larger, more capable model  
    "ai-mixtral-8x7b-instruct",    # Alternative high-quality model
    "ai-gemma-2-2b-it"             # Lightweight option
]
```

#### Testing Process
1. **Iterate Through Models**: Try each model in the list
2. **Initialize NVIDIA Client**: Create ChatNVIDIA instance for each model
3. **Send Test Query**: Simple "Hello! What's today's date?" message
4. **Capture Results**: Record success/failure for each model
5. **Return Working Model**: First successful model becomes the recommendation

#### Error Handling
```python
try:
    llm = ChatNVIDIA(model=model, api_key=api_key, temperature=0.7)
    response = llm.invoke("Hello! What's today's date?")
    print(f"SUCCESS with {model}!")
    return model  # Return first working model
except Exception as e:
    print(f"Failed with {model}: {e}")
```

## 🔧 How It Works

### Step-by-Step Process

1. **Environment Setup**: Load NVIDIA API key from environment
2. **Model Iteration**: Test each model in the predefined list
3. **API Call**: Make a simple test call to each model
4. **Result Evaluation**: Determine if the call succeeded
5. **Recommendation**: Return the first working model

### Example Output
```
Testing NVIDIA API...

Trying model: ai-llama-3_1-8b-instruct
Failed with ai-llama-3_1-8b-instruct: [400] Bad Request
Inference error

Trying model: ai-llama-3_1-70b-instruct
SUCCESS with ai-llama-3_1-70b-instruct!
Response: Today's date is May 9, 2024, however I realize my knowledge stopped in 2023 so the actual date is likely different.

Use this model in your agent: ai-llama-3_1-70b-instruct
```

## 🎯 Use Cases

### 1. Initial Setup
When setting up your agents for the first time:
```bash
python test_api.py
```
Use the recommended model in your agent configuration.

### 2. Troubleshooting
When your agents stop working:
- Run test to verify API key is still valid
- Check if your current model is still available
- Find alternative working models

### 3. Model Selection
When choosing the best model for your needs:
- Test multiple models to see which ones work
- Compare response quality and speed
- Select based on your requirements

### 4. API Monitoring
Regular checks to ensure your setup remains functional:
- Verify API connectivity
- Monitor model availability
- Detect service changes

## 🔍 Common Issues and Solutions

### Issue 1: All Models Fail
**Symptoms**: Every model returns an error
**Possible Causes**:
- Invalid API key
- Network connectivity issues
- NVIDIA service outage
- Expired API key

**Solutions**:
1. Verify API key in .env file
2. Check internet connection
3. Regenerate API key from build.nvidia.com
4. Check NVIDIA service status

### Issue 2: Specific Model Fails
**Symptoms**: Some models work, others don't
**Possible Causes**:
- Model temporarily unavailable
- Model deprecated or renamed
- Rate limiting on specific models

**Solutions**:
1. Use alternative working models
2. Check NVIDIA documentation for model updates
3. Wait and retry later

### Issue 3: Slow Responses
**Symptoms**: Models work but respond slowly
**Possible Causes**:
- High server load
- Large model processing time
- Network latency

**Solutions**:
1. Try smaller, faster models (8B instead of 70B)
2. Implement timeout handling
3. Use during off-peak hours

## 📊 Model Comparison

### Tested Models Overview

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| **ai-llama-3_1-8b-instruct** | Small | Fast | Good | Quick responses, high volume |
| **ai-llama-3_1-70b-instruct** | Large | Slower | Excellent | Complex reasoning, quality responses |
| **ai-mixtral-8x7b-instruct** | Medium | Medium | Very Good | Balanced performance |
| **ai-gemma-2-2b-it** | Very Small | Very Fast | Basic | Simple tasks, testing |

### Selection Guidelines
- **For Learning**: Start with `ai-llama-3_1-70b-instruct` (best quality)
- **For Production**: Use `ai-mixtral-8x7b-instruct` (balanced)
- **For High Volume**: Use `ai-llama-3_1-8b-instruct` (fastest)
- **For Testing**: Use `ai-gemma-2-2b-it` (lightweight)

## 🛠️ Configuration

### Environment Requirements
```bash
# .env file
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### Dependencies
```python
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from dotenv import load_dotenv
import os
```

## 🚀 Usage

### Basic Testing
```bash
python test_api.py
```

### Integration with Agents
After finding a working model, update your agent:
```python
# In your agent code
self.llm = ChatNVIDIA(
    model="ai-llama-3_1-70b-instruct",  # Use the working model
    api_key=os.getenv('NVIDIA_API_KEY'),
    temperature=0.7
)
```

## 🔮 Advanced Usage

### Custom Model Testing
Modify the `models_to_try` list to test specific models:
```python
models_to_try = [
    "your-specific-model-1",
    "your-specific-model-2",
    # Add any models you want to test
]
```

### Automated Testing
Use in CI/CD pipelines to verify API connectivity:
```bash
# In your deployment script
python test_api.py
if [ $? -eq 0 ]; then
    echo "API test passed, deploying agents..."
else
    echo "API test failed, aborting deployment"
    exit 1
fi
```

### Performance Benchmarking
Extend the script to measure response times:
```python
import time

start_time = time.time()
response = llm.invoke("Test query")
end_time = time.time()
print(f"Response time: {end_time - start_time:.2f} seconds")
```

This Test API utility is essential for maintaining reliable agent operations and troubleshooting API-related issues!