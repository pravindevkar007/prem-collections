# Multi-Question Day Agent Documentation

## 🎯 Overview
The Multi-Question Day Agent is an enhanced single-agent system that can handle multiple types of questions about historical information. It's more sophisticated than the simple agent with better question classification and context building.

## 🔄 Complete Flow Diagram

### User Query → Final Response Flow
```
👤 User Types: "Who was born today?"
        ↓
📥 main() → user_input = input("Ask me anything: ")
        ↓
🎯 main() → agent.answer_question(user_input)
        ↓
🔍 answer_question() → question_type = self.classify_question(user_query)
        ↓
🏷️ classify_question() → return "famous_births" [keyword matching]
        ↓
📅 answer_question() → date = parse_date_from_question()
        ↓
📊 answer_question() → data = self.get_historical_data(date)
        ↓
🌐 get_historical_data() → requests.get(wikipedia_urls)
        ↓
📋 get_historical_data() → return comprehensive_data_dict
        ↓
📝 answer_question() → context = self._build_context(data, question_type)
        ↓
🎨 _build_context() → return births_focused_context [smart filtering]
        ↓
🤖 answer_question() → prompt = create_targeted_prompt(context, question)
        ↓
⚡ answer_question() → response = self.llm.invoke(prompt)
        ↓
📤 answer_question() → return response.content
        ↓
🖥️ main() → print(response)
        ↓
✅ User sees targeted birth-focused answer
```

## 🔧 Step-by-Step Function Call Sequence

### When User Asks: "Who was born today?"

#### Step 1: Input Capture
```python
# In main() function
user_input = input("Ask me anything: ").strip()  # "Who was born today?"
```

#### Step 2: Main Processing Call
```python
# In main() function
response = agent.answer_question(user_input)
```

#### Step 3: Question Classification
```python
# In answer_question() method
def answer_question(self, user_question):
    question_type = self.classify_question(user_question)  # ← Calls classify_question()
```

#### Step 3a: Classification Process
```python
# In classify_question() method
def classify_question(self, question):
    question_lower = question.lower()  # "who was born today?"
    
    # Check against supported question categories
    for category, keywords in self.supported_questions.items():
        if any(keyword in question_lower for keyword in keywords):
            return category  # Returns "famous_births"
    
    return "general"  # Default fallback
```

#### Step 4: Date Processing
```python
# Back in answer_question() method
    # Handle different date requests
    if "tomorrow" in user_question.lower():
        date = datetime.now() + timedelta(days=1)
    else:
        date = datetime.now()  # Today's date
```

#### Step 5: Enhanced Data Fetching
```python
# In answer_question() method
    data = self.get_historical_data(date)  # ← Calls enhanced data fetcher
```

#### Step 5a: Comprehensive Data Retrieval
```python
# In get_historical_data() method
def get_historical_data(self, date=None):
    # Step 5a: Prepare multiple API endpoints
    events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
    births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
    deaths_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/{date.month}/{date.day}"
    
    # Step 5b: Make parallel API calls
    events_response = requests.get(events_url, headers=headers, timeout=5)
    births_response = requests.get(births_url, headers=headers, timeout=5)
    deaths_response = requests.get(deaths_url, headers=headers, timeout=5)
    
    # Step 5c: Return comprehensive data
    return {
        'events': events_response.json().get('events', [])[:5] if events_response.ok else [],
        'births': births_response.json().get('births', [])[:5] if births_response.ok else [],
        'deaths': deaths_response.json().get('deaths', [])[:5] if deaths_response.ok else [],
        'date': date.strftime("%B %d, %Y"),
        'day_name': date.strftime("%A")
    }
```

#### Step 6: Smart Context Building
```python
# Back in answer_question() method
    context = self._build_context(data, question_type)  # ← Calls smart context builder
```

#### Step 6a: Question-Type Specific Context
```python
# In _build_context() method
def _build_context(self, data, question_type):
    context = f"Date: {data['date']} ({data['day_name']})\n\n"
    
    # Smart filtering based on question type
    if question_type in ["famous_births", "general"]:
        context += "Famous Births:\n"
        if data['births']:
            for i, birth in enumerate(data['births'], 1):
                context += f"{i}. {birth.get('year')}: {birth.get('text')}\n"
        else:
            context += "No specific births data available.\n"
    
    # Only add other sections if needed for this question type
    if question_type == "general":
        # Add events and deaths too
        # ... (additional context building)
    
    return context
```

#### Step 7: Targeted AI Prompt Creation
```python
# Back in answer_question() method
    prompt = f"""
Context: {context}

User Question: {user_question}

Instructions:
- Answer the user's question using the historical information provided
- Be conversational and engaging
- If they ask about specific categories (events, births, deaths), focus on those
- If asking generally, provide a nice overview
- If no data is available, be honest but still helpful
- Make it interesting and educational

Response:"""
```

#### Step 8: NVIDIA AI Processing
```python
# Still in answer_question() method
    response = self.llm.invoke(prompt)  # ← Calls NVIDIA AI with targeted prompt
    return response.content
```

#### Step 9: Display Targeted Result
```python
# Back in main() function
print(f"\n🤖 Agent: {response}")  # ← Shows birth-focused answer
```

## 📋 Detailed Function Breakdown

### Enhanced Function Call Hierarchy
```
main()
├── MultiQuestionDayAgent.__init__()
│   ├── ChatNVIDIA() initialization
│   └── self._get_supported_questions()
├── agent.answer_question(user_question)
│   ├── self.classify_question(user_question)
│   │   └── keyword matching logic
│   ├── date parsing logic
│   ├── self.get_historical_data(date)
│   │   ├── requests.get(events_url)
│   │   ├── requests.get(births_url)
│   │   ├── requests.get(deaths_url)
│   │   └── self._get_fallback_data() [if needed]
│   ├── self._build_context(data, question_type)
│   │   └── smart context filtering
│   └── self.llm.invoke(targeted_prompt)
└── print(targeted_response)
```

### Question Classification Flow
```
User Question: "Who was born today?"
        ↓
classify_question() analyzes keywords
        ↓
Finds "born" in famous_births keywords
        ↓
Returns "famous_births" category
        ↓
_build_context() creates births-focused context
        ↓
AI gets targeted prompt about births
        ↓
User gets specialized birth-focused response
```

### Smart Context Building Flow
```
Question Type: "famous_births"
        ↓
_build_context() checks question_type
        ↓
Only includes births section in context
        ↓
Skips events and deaths for focused response
        ↓
AI prompt is targeted and specific
        ↓
Response is more relevant and focused
```

## 🏗️ Architecture

### Key Difference from Simple Agent
- **Question Classification**: Automatically determines what type of question the user is asking
- **Context Adaptation**: Builds different contexts based on question type
- **Enhanced Data Handling**: Supports deaths, holidays, and more categories
- **Better Error Handling**: More robust fallback mechanisms

## 📁 Code Structure

### Main Class: `MultiQuestionDayAgent`

#### `__init__(self)`
- Initializes NVIDIA AI model
- Sets up supported question categories
- Configures question classification system

#### `_get_supported_questions(self)`
**Purpose**: Define all supported question types and their keywords

**Categories**:
```python
{
    "historical_events": ["what happened today", "historical events", "events on this day"],
    "famous_births": ["who was born today", "famous birthdays", "births on this day"],
    "famous_deaths": ["who died today", "deaths on this day", "people who passed away"],
    "holidays": ["holidays today", "special days", "observances"],
    "date_info": ["today's date", "what day is it", "current date"],
    "tomorrow": ["tomorrow", "next day", "what about tomorrow"],
    "custom_date": ["specific date", "another date", "different day"],
    "general": ["tell me about today", "how was today", "today's significance"]
}
```

#### `get_historical_data(self, date=None)`
**Purpose**: Comprehensive data fetching including events, births, and deaths

**Enhanced Features**:
- Fetches 3 types of data: events, births, deaths
- Better timeout handling (5 seconds)
- More comprehensive fallback data
- Returns additional metadata (day name)

#### `classify_question(self, question)`
**Purpose**: Intelligent question classification

**Process**:
1. Convert question to lowercase
2. Check against keyword patterns for each category
3. Return the matching category
4. Default to "general" if no match found

#### `answer_question(self, user_question)`
**Purpose**: Main processing method with intelligent routing

**Enhanced Process**:
1. **Classify**: Determine question type
2. **Date Handling**: Support for "tomorrow" requests
3. **Data Fetching**: Get appropriate historical data
4. **Context Building**: Create category-specific context
5. **AI Processing**: Generate targeted response

#### `_build_context(self, data, question_type)`
**Purpose**: Build context based on specific question type

**Smart Context Building**:
- **Events-focused**: Only includes historical events
- **Births-focused**: Only includes famous births  
- **Deaths-focused**: Only includes notable deaths
- **General**: Includes all available information
- **Date-info**: Focuses on current date details

## 🔧 How It Works

### Question Classification Example

**Input**: "Who was born today?"

**Classification Process**:
```python
question_lower = "who was born today?"
# Checks against keywords: ["who was born today", "famous birthdays", "births on this day"]
# Matches: "who was born today"
# Returns: "famous_births"
```

**Context Built**:
```
Date: May 10, 2026 (Monday)

Famous Births:
1. 1899: Fred Astaire, American dancer and actor
2. 1960: Bono, Irish singer (U2)
3. 1946: Donovan, Scottish singer-songwriter
```

### Enhanced Data Structure
```python
{
    'events': [...],     # Historical events
    'births': [...],     # Famous births  
    'deaths': [...],     # Notable deaths
    'date': "May 10, 2026",
    'day_name': "Monday"
}
```

## 📝 Supported Questions

### ✅ Enhanced Question Support

| Category | Keywords | Example Questions |
|----------|----------|-------------------|
| **Historical Events** | "happened", "events", "history" | "What happened today in history?" |
| **Famous Births** | "born", "birthday", "celebrities" | "Who was born today?" |
| **Famous Deaths** | "died", "deaths", "passed away" | "Who died on this day?" |
| **Holidays** | "holiday", "celebration", "special day" | "What holidays are today?" |
| **Date Info** | "date", "time", "today", "day" | "What's today's date?" |
| **Tomorrow** | "tomorrow", "next day" | "What about tomorrow?" |
| **Custom Date** | "specific date", "another date" | "What happened on July 4th?" |
| **General** | "tell me", "how was", "significance" | "Tell me about today" |

## 🎨 Key Features

### Advantages Over Simple Agent
✅ **Intelligent Classification** - Knows what type of question you're asking  
✅ **Targeted Responses** - Gives focused answers based on question type  
✅ **More Data Types** - Supports deaths, holidays, date info  
✅ **Better Context** - Builds appropriate context for each question type  
✅ **Enhanced Help** - Comprehensive help system with examples  

### Smart Features
- **Tomorrow Support**: Can answer questions about tomorrow's historical significance
- **Category Filtering**: Only shows relevant information based on question type
- **Flexible Matching**: Uses keyword matching for natural language understanding
- **Comprehensive Help**: Built-in help system with examples

## 🛠️ Configuration

### Same as Simple Agent
```bash
# .env file
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### Enhanced Settings
```python
# More comprehensive timeout handling
timeout = 5  # seconds

# Enhanced fallback data
# Supports multiple date formats and more historical data
```

## 🚀 Usage

### Installation
```bash
pip install langchain-nvidia-ai-endpoints requests python-dotenv
```

### Running
```bash
python multi_agent.py
```

### Enhanced Commands
- `help` - Show comprehensive question examples
- `exit`, `quit`, `bye`, `goodbye` - Exit program
- Any question - Intelligent classification and response

## 🔍 Error Handling

### Enhanced Error Management
- **API Failures** → More robust fallback system
- **Classification Errors** → Defaults to general category
- **Data Validation** → Better handling of missing data
- **Network Issues** → Improved timeout and retry logic

## 📊 Performance

### Comparison with Simple Agent
| Feature | Simple Agent | Multi-Question Agent |
|---------|-------------|---------------------|
| **Question Types** | Basic | 8 Categories |
| **Context Building** | Static | Dynamic |
| **Data Types** | Events + Births | Events + Births + Deaths |
| **Classification** | None | Intelligent |
| **Response Time** | 3-8 seconds | 3-8 seconds |
| **Accuracy** | Good | Better (targeted) |

## 🔮 When to Use

### Use Multi-Question Agent When:
- You want more intelligent question handling
- You need support for different types of historical queries
- You want targeted, focused responses
- You need tomorrow/future date support
- You want a more sophisticated user experience

### Use Simple Agent When:
- You want minimal complexity
- You only need basic historical information
- You prefer simpler, faster responses
- You're learning the basics of agent development

This Multi-Question Agent represents the next step in agent sophistication while maintaining the simplicity of a single-agent architecture!