# Simple Day Agent - Code Documentation

## 🎯 Overview
The Simple Day Agent is a single-agent system that answers questions about historical events and famous births on any given day. It combines Wikipedia API data with NVIDIA AI to create engaging responses.

## 🔄 Complete Flow Diagram

### User Query → Final Response Flow
```
👤 User Types: "Tell me about today"
        ↓
📥 main() → user_input = input("You: ")
        ↓
🎯 main() → agent.answer_query(user_input)
        ↓
📊 answer_query() → day_info = self.get_day_info()
        ↓
🌐 get_day_info() → requests.get(wikipedia_urls)
        ↓
📋 get_day_info() → return {'events': [...], 'births': [...], 'date': '...'}
        ↓
📝 answer_query() → context = build_context_string(day_info)
        ↓
🤖 answer_query() → prompt = create_ai_prompt(context, user_query)
        ↓
⚡ answer_query() → response = self.llm.invoke(prompt)
        ↓
📤 answer_query() → return response.content
        ↓
🖥️ main() → print(response)
        ↓
✅ User sees final answer
```

## 🔧 Step-by-Step Function Call Sequence

### When User Asks: "Tell me about today"

#### Step 1: Input Capture
```python
# In main() function
user_input = input("You: ").strip()  # "Tell me about today"
```

#### Step 2: Main Processing Call
```python
# In main() function
response = agent.answer_query(user_input)
```

#### Step 3: Data Fetching
```python
# In answer_query() method
def answer_query(self, user_query):
    day_info = self.get_day_info()  # ← Calls get_day_info()
```

#### Step 4: Wikipedia API Calls
```python
# In get_day_info() method
def get_day_info(self, date=None):
    # Step 4a: Prepare URLs
    events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
    births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
    
    # Step 4b: Make API calls
    events_response = requests.get(events_url, headers=self.headers, timeout=5)
    births_response = requests.get(births_url, headers=self.headers, timeout=5)
    
    # Step 4c: Process responses or fallback
    if events_response.ok:
        events = events_response.json().get('events', [])[:5]
    else:
        return self._get_fallback_data(date)  # ← Calls fallback if API fails
```

#### Step 5: Context Building
```python
# Back in answer_query() method
def answer_query(self, user_query):
    day_info = self.get_day_info()  # ← Returns from Step 4
    
    # Step 5a: Build context string
    context = f"Date: {day_info['date']}\n\n"
    
    # Step 5b: Add events
    context += "Historical Events:\n"
    for i, event in enumerate(day_info['events'], 1):
        context += f"{i}. {event.get('year')}: {event.get('text')}\n"
    
    # Step 5c: Add births
    context += "\nFamous Births:\n"
    for i, birth in enumerate(day_info['births'], 1):
        context += f"{i}. {birth.get('year')}: {birth.get('text')}\n"
```

#### Step 6: AI Prompt Creation
```python
# Still in answer_query() method
    # Step 6: Create AI prompt
    prompt = f"""
Context: {context}

User Question: {user_query}

Instructions:
- Answer using the historical information provided
- Be conversational and engaging
- Make history interesting with storytelling
- If no data available, be honest but helpful

Response:"""
```

#### Step 7: NVIDIA AI Processing
```python
# Still in answer_query() method
    # Step 7: Get AI response
    response = self.llm.invoke(prompt)  # ← Calls NVIDIA AI
    return response.content
```

#### Step 8: Display Result
```python
# Back in main() function
print("\nAgent: ", end="")
print(response)  # ← Shows final answer to user
```

## 📋 Detailed Function Breakdown

### Function Call Hierarchy
```
main()
├── SimpleDayAgent.__init__()
│   └── ChatNVIDIA() initialization
├── agent.answer_query(user_question)
│   ├── self.get_day_info()
│   │   ├── requests.get(events_url)
│   │   ├── requests.get(births_url)
│   │   └── self._get_fallback_data() [if API fails]
│   ├── context building (string formatting)
│   ├── prompt creation (string formatting)
│   └── self.llm.invoke(prompt)
└── print(response)
```

### Error Handling Flow
```
API Call Fails
     ↓
get_day_info() catches exception
     ↓
Calls _get_fallback_data(date)
     ↓
Returns sample historical data
     ↓
Processing continues normally
```

## 🏗️ Architecture

### Data Flow
```
User Question → Wikipedia API → Historical Data → NVIDIA AI → Response
```

### Components
1. **Data Fetcher** - Gets historical information from Wikipedia
2. **Fallback System** - Provides sample data when API fails  
3. **AI Processor** - Uses NVIDIA AI to create engaging responses
4. **User Interface** - Simple command-line interaction

## 📁 Code Structure

### Dependencies
```python
import requests                        # For Wikipedia API calls
from datetime import datetime          # For date handling
from langchain_nvidia_ai_endpoints import ChatNVIDIA  # NVIDIA AI integration
from dotenv import load_dotenv        # Environment variables
import os                             # System operations
```

### Main Class: `SimpleDayAgent`

#### `__init__(self)`
- Initializes NVIDIA AI model (`ai-llama-3_1-70b-instruct`)
- Sets up HTTP headers for Wikipedia API requests
- Configures temperature (0.7) for balanced AI creativity

#### `get_day_info(self, date=None)`
**Purpose**: Fetch historical data for a specific date

**Process**:
1. Uses current date if none provided
2. Makes API calls to Wikipedia:
   - Events: `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{month}/{day}`
   - Births: `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{month}/{day}`
3. Returns top 5 events and births
4. Falls back to sample data if API fails

**Returns**: Dictionary with events, births, and formatted date

#### `_get_fallback_data(self, date)`
**Purpose**: Provide sample historical data when Wikipedia API is unavailable

**Sample Data Includes**:
- **May 10th**: Transcontinental Railroad, Churchill, Mandela, Fred Astaire, Bono
- **December 25th**: Charlemagne, William the Conqueror, Isaac Newton

**Returns**: Same format as `get_day_info()` but with hardcoded data

#### `answer_query(self, user_query)`
**Purpose**: Main method to process user questions and generate responses

**Process**:
1. **Get Data**: Calls `get_day_info()` to fetch historical information
2. **Build Context**: Creates formatted string with events and births
3. **Create Prompt**: Combines context with user question and instructions
4. **AI Processing**: Sends prompt to NVIDIA AI model
5. **Return Response**: Returns AI-generated conversational answer

**Context Format**:
```
Date: May 10, 2026

Historical Events:
1. 1869: First Transcontinental Railroad completed
2. 1940: Winston Churchill becomes UK Prime Minister

Famous Births:
1. 1899: Fred Astaire, American dancer and actor
2. 1960: Bono, Irish singer (U2)
```

#### `show_help(self)`
**Purpose**: Display supported question types and examples

## 🔧 How It Works

### Step-by-Step Process

1. **User Input**: User types a question
2. **Data Fetching**: 
   - Try Wikipedia API for real historical data
   - Use fallback data if API fails
3. **Context Building**: Format data into readable context
4. **AI Prompt Creation**: Combine context + question + instructions
5. **AI Processing**: NVIDIA model generates engaging response
6. **Output**: Display conversational answer to user

### Example Flow

**Input**: "Tell me about today"

**Wikipedia API Call**:
```python
events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/5/10"
births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/5/10"
```

**Context Created**:
```
Date: May 10, 2026

Historical Events:
1. 1869: First Transcontinental Railroad completed
2. 1940: Winston Churchill becomes UK Prime Minister
3. 1994: Nelson Mandela inaugurated as South African President

Famous Births:
1. 1899: Fred Astaire, American dancer and actor
2. 1960: Bono, Irish singer (U2)
3. 1946: Donovan, Scottish singer-songwriter
```

**AI Prompt**:
```
Context: [above context]

User Question: Tell me about today

Instructions:
- Answer using the historical information provided
- Be conversational and engaging
- Make history interesting with storytelling
- If no data available, be honest but helpful

Response:
```

**AI Response**: Engaging narrative combining the historical facts

## 📝 Supported Questions

### ✅ Question Types

| Category | Examples |
|----------|----------|
| **General** | "Tell me about today", "What's special about today?" |
| **Events** | "What happened today in history?", "Historical events on this day" |
| **Births** | "Who was born today?", "Famous birthdays today" |
| **Specific Dates** | "What happened on December 25th?", "Tell me about July 4th" |

### ❌ Limitations
- No current events or news
- No future predictions  
- No weather information
- Limited to historical data only

## 🛠️ Configuration

### Environment Variables
```bash
# .env file
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### API Settings
```python
# NVIDIA AI Configuration
model = "ai-llama-3_1-70b-instruct"
temperature = 0.7  # Balanced creativity

# Wikipedia API Configuration  
headers = {'User-Agent': 'SimpleDayAgent/2.0'}
timeout = 5  # seconds
```

## 🚀 Usage

### Installation
```bash
pip install langchain-nvidia-ai-endpoints requests python-dotenv
```

### Running
```bash
python simple_agent.py
```

### Commands
- `help` or `?` - Show supported questions
- `exit`, `quit`, `bye` - Exit the program
- Any historical question - Get AI response

## 🔍 Error Handling

### API Failures
- **Wikipedia API down** → Uses fallback sample data
- **NVIDIA API error** → Shows error message  
- **Network timeout** → Falls back gracefully
- **Invalid responses** → Handles empty data

### Data Validation
- **Missing events** → Shows "No events data available"
- **Missing births** → Shows "No births data available"  
- **Invalid dates** → Uses current date as default
- **Empty user input** → Prompts for input

## 🎨 Key Features

### Advantages
✅ **Simple Architecture** - Single agent, easy to understand  
✅ **Reliable** - Fallback data when APIs fail  
✅ **Fast** - Direct processing, minimal overhead  
✅ **Educational** - Combines facts with storytelling  
✅ **Flexible** - Handles various question types  

### Design Decisions
- **Single Agent vs Multi-Agent**: Chose simplicity over specialization
- **Wikipedia API**: Free, reliable historical data source
- **NVIDIA AI**: High-quality language model for engaging responses
- **Fallback Data**: Ensures functionality even when API fails
- **Command Line**: Simple interface, no web dependencies

## 🔮 Potential Enhancements

### Easy Additions
- More fallback data for common dates
- Support for deaths/obituaries  
- Holiday and observance information
- Different date input formats

### Advanced Features
- Web interface
- Voice interaction
- Multiple languages
- Image generation for historical events
- Integration with more historical APIs

## 📊 Performance

### Typical Response Times
- Wikipedia API call: 1-3 seconds
- NVIDIA AI processing: 2-5 seconds  
- Total response time: 3-8 seconds

### Resource Usage
- Memory: ~50MB
- Network: Minimal (API calls only)
- CPU: Low (mostly waiting for APIs)

This Simple Day Agent provides an excellent balance of functionality, reliability, and educational value for historical information queries!