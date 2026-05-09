# Debug Wikipedia API Documentation

## 🎯 Overview
The Debug Wikipedia API script is a diagnostic tool designed to test Wikipedia API connectivity and examine the historical data being fetched. It helps troubleshoot data retrieval issues and understand the structure of Wikipedia's "On This Day" API responses.

## 🔄 Complete Flow Diagram

### Script Execution → API Testing Flow
```
🚀 User Runs: "python debug_wiki.py"
        ↓
📥 main execution → if __name__ == "__main__":
        ↓
🎯 main execution → test_wikipedia_api()
        ↓
📅 test_wikipedia_api() → date = datetime.now()
        ↓
🖨️ test_wikipedia_api() → print(f"Testing Wikipedia API for {date}")
        ↓
🌐 test_wikipedia_api() → events_url = build_events_url()
        ↓
📞 test_wikipedia_api() → events_response = requests.get(events_url)
        ↓
📊 test_wikipedia_api() → print(f"Events Status: {events_response.status_code}")
        ↓
    ✅ Status 200?    ❌ Status 403/Error?
        ↓                    ↓
   Parse JSON           Print "Failed"
        ↓                    ↓
   Display Events       Show Error Info
        ↓                    ↓
        └────────┬────────────┘
                 ↓
🌐 test_wikipedia_api() → births_url = build_births_url()
        ↓
📞 test_wikipedia_api() → births_response = requests.get(births_url)
        ↓
📊 test_wikipedia_api() → print(f"Births Status: {births_response.status_code}")
        ↓
    ✅ Success?      ❌ Failure?
        ↓                ↓
   Parse & Display   Show Error
        ↓                ↓
        └────────┬───────┘
                 ↓
✅ User sees complete API diagnostic results
```

## 🔧 Step-by-Step Function Call Sequence

### When User Runs: "python debug_wiki.py"

#### Step 1: Script Initialization
```python
# Script starts execution
if __name__ == "__main__":
    test_wikipedia_api()  # ← Calls main testing function
```

#### Step 2: Testing Function Entry
```python
# In test_wikipedia_api() function
def test_wikipedia_api():
    date = datetime.now()  # ← Get current date
    print(f"Testing Wikipedia API for {date.strftime('%B %d, %Y')}")
```

#### Step 3: Events API Testing
```python
# Still in test_wikipedia_api() function
    # Step 3a: Build events URL
    events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
    print(f"\nEvents URL: {events_url}")
    
    try:
        # Step 3b: Make API call
        events_response = requests.get(events_url)  # ← API call
        print(f"Events Status: {events_response.status_code}")  # ← Status check
```

#### Step 4: Events Response Processing
```python
# Still in try block
        if events_response.ok:  # ← Check if successful (200)
            # Step 4a: Parse JSON response
            events_data = events_response.json()  # ← Parse JSON
            events = events_data.get('events', [])  # ← Extract events
            print(f"Found {len(events)} events")  # ← Count events
            
            # Step 4b: Display sample events
            for i, event in enumerate(events[:3], 1):  # ← Show first 3
                year = event.get('year', 'Unknown')
                text = event.get('text', 'No description')
                print(f"{i}. {year}: {text}")  # ← Display event
        else:
            print("Failed to get events")  # ← Handle failure
```

#### Step 5: Events Error Handling
```python
# Exception handling
    except Exception as e:
        print(f"Events error: {e}")  # ← Display error message
```

#### Step 6: Births API Testing
```python
# Back in test_wikipedia_api() function
    # Step 6a: Build births URL
    births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
    print(f"\nBirths URL: {births_url}")
    
    try:
        # Step 6b: Make API call
        births_response = requests.get(births_url)  # ← API call
        print(f"Births Status: {births_response.status_code}")  # ← Status check
```

#### Step 7: Births Response Processing
```python
# Still in try block
        if births_response.ok:  # ← Check if successful
            # Step 7a: Parse JSON response
            births_data = births_response.json()  # ← Parse JSON
            births = births_data.get('births', [])  # ← Extract births
            print(f"Found {len(births)} births")  # ← Count births
            
            # Step 7b: Display sample births
            for i, birth in enumerate(births[:3], 1):  # ← Show first 3
                year = birth.get('year', 'Unknown')
                text = birth.get('text', 'No description')
                print(f"{i}. {year}: {text}")  # ← Display birth
        else:
            print("Failed to get births")  # ← Handle failure
```

#### Step 8: Births Error Handling
```python
# Exception handling
    except Exception as e:
        print(f"Births error: {e}")  # ← Display error message
```

## 📋 Detailed Function Breakdown

### Function Call Hierarchy
```
Script Execution
├── __main__ check
├── test_wikipedia_api()
│   ├── datetime.now() → get current date
│   ├── Events API Testing:
│   │   ├── URL construction
│   │   ├── requests.get(events_url)
│   │   ├── response.status_code check
│   │   ├── response.json() parsing
│   │   ├── data extraction and counting
│   │   └── sample data display
│   ├── Births API Testing:
│   │   ├── URL construction
│   │   ├── requests.get(births_url)
│   │   ├── response.status_code check
│   │   ├── response.json() parsing
│   │   ├── data extraction and counting
│   │   └── sample data display
│   └── Error handling for both APIs
└── Script completion
```

### API Testing Flow (Per Endpoint)
```
Build API URL
     ↓
Make HTTP Request
     ↓
Check Status Code
     ↓
  200 OK?    4xx/5xx Error?
     ↓              ↓
Parse JSON     Print Error
     ↓              ↓
Extract Data   Show Status
     ↓              ↓
Count Items    End Testing
     ↓
Display Samples
     ↓
Continue to Next API
```

## 🎯 Example Execution Traces

### Successful Execution
```
$ python debug_wiki.py

Testing Wikipedia API for May 10, 2026

Events URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/5/10
Events Status: 200
Found 47 events
1. 1869: The First Transcontinental Railroad in the United States is completed
2. 1940: Winston Churchill becomes Prime Minister of the United Kingdom
3. 1994: Nelson Mandela is inaugurated as South Africa's first black president

Births URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/5/10
Births Status: 200
Found 23 births
1. 1899: Fred Astaire, American dancer and actor
2. 1960: Bono, Irish singer and activist (U2)
3. 1946: Donovan, Scottish singer-songwriter
```

### Failed Execution (403 Error)
```
$ python debug_wiki.py

Testing Wikipedia API for May 10, 2026

Events URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/5/10
Events Status: 403
Failed to get events

Births URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/5/10
Births Status: 403
Failed to get births
```

## 🔄 Diagnostic Flow

### How Debug Results Help Agents
```
debug_wiki.py shows API status
        ↓
Identifies connection issues
        ↓
Reveals data structure
        ↓
Helps fix agent problems:

- 403 Error → Add User-Agent headers
- Timeout → Add timeout handling  
- Empty Data → Implement fallbacks
- JSON Issues → Fix parsing logic
        ↓
Agent works reliably
```

## 🔧 Purpose
- **Wikipedia API Testing**: Verify Wikipedia API accessibility
- **Data Structure Analysis**: Examine the format of returned data
- **Troubleshooting**: Debug data fetching issues in agents
- **API Response Inspection**: Understand what data is available

## 📁 Code Structure

### Main Function: `test_wikipedia_api()`

#### API Endpoints Tested
```python
events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{month}/{day}"
births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{month}/{day}"
```

#### Testing Process
1. **Get Current Date**: Uses today's date for testing
2. **Test Events API**: Fetch historical events for today
3. **Test Births API**: Fetch famous births for today  
4. **Analyze Responses**: Display status codes and data structure
5. **Show Sample Data**: Display first few entries from each category

#### Data Analysis
```python
if events_response.ok:
    events_data = events_response.json()
    events = events_data.get('events', [])
    print(f"Found {len(events)} events")
    
    # Display first 3 events
    for i, event in enumerate(events[:3], 1):
        year = event.get('year', 'Unknown')
        text = event.get('text', 'No description')
        print(f"{i}. {year}: {text}")
```

## 🔧 How It Works

### Step-by-Step Process

1. **Date Preparation**: Get current date (month and day)
2. **URL Construction**: Build Wikipedia API URLs for events and births
3. **API Calls**: Make HTTP requests to Wikipedia endpoints
4. **Status Checking**: Verify HTTP response codes
5. **Data Parsing**: Extract and analyze JSON responses
6. **Sample Display**: Show first few entries for inspection

### Example Output

#### Successful Response
```
Testing Wikipedia API for May 10, 2026

Events URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/5/10
Events Status: 200
Found 47 events
1. 1869: The First Transcontinental Railroad in the United States is completed
2. 1940: Winston Churchill becomes Prime Minister of the United Kingdom  
3. 1994: Nelson Mandela is inaugurated as South Africa's first black president

Births URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/5/10
Births Status: 200
Found 23 births
1. 1899: Fred Astaire, American dancer and actor
2. 1960: Bono, Irish singer and activist (U2)
3. 1946: Donovan, Scottish singer-songwriter
```

#### Failed Response (Common Issue)
```
Testing Wikipedia API for May 10, 2026

Events URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/5/10
Events Status: 403
Failed to get events

Births URL: https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/5/10
Births Status: 403
Failed to get births
```

## 🔍 Common Issues and Solutions

### Issue 1: 403 Forbidden Error
**Symptoms**: Status code 403, "Failed to get events/births"
**Cause**: Wikipedia blocking requests due to missing or invalid User-Agent header
**Solution**: Add proper User-Agent header in your agent code:
```python
headers = {'User-Agent': 'YourAgent/1.0 (Educational Purpose)'}
requests.get(url, headers=headers)
```

### Issue 2: Network Timeout
**Symptoms**: Script hangs or times out
**Cause**: Slow network connection or Wikipedia server issues
**Solution**: Add timeout parameter:
```python
response = requests.get(url, timeout=5)
```

### Issue 3: Empty Data
**Symptoms**: Status 200 but no events/births found
**Cause**: Some dates may have limited historical data
**Solution**: Implement fallback data in your agents

### Issue 4: Rate Limiting
**Symptoms**: Intermittent failures or slow responses
**Cause**: Too many requests to Wikipedia API
**Solution**: Add delays between requests or implement caching

## 🎯 Use Cases

### 1. Initial Development
When building your agents:
```bash
python debug_wiki.py
```
Verify Wikipedia API works and see data structure.

### 2. Troubleshooting Agents
When your agents return empty data:
- Check if Wikipedia API is accessible
- Verify data is available for the current date
- Examine the actual data structure

### 3. Data Structure Analysis
Understanding Wikipedia API responses:
- See what fields are available in events/births
- Understand the JSON structure
- Plan your data parsing logic

### 4. API Monitoring
Regular checks for Wikipedia API health:
- Monitor API availability
- Check for changes in data format
- Verify consistent data quality

## 📊 Wikipedia API Data Structure

### Events Response Format
```json
{
  "events": [
    {
      "year": 1869,
      "text": "The First Transcontinental Railroad in the United States is completed",
      "pages": [
        {
          "title": "First Transcontinental Railroad",
          "extract": "...",
          "thumbnail": {...}
        }
      ]
    }
  ]
}
```

### Births Response Format
```json
{
  "births": [
    {
      "year": 1899,
      "text": "Fred Astaire, American dancer and actor",
      "pages": [
        {
          "title": "Fred Astaire",
          "extract": "...",
          "thumbnail": {...}
        }
      ]
    }
  ]
}
```

### Key Fields
- **year**: Year the event occurred or person was born
- **text**: Brief description of the event or person
- **pages**: Array of related Wikipedia pages with additional details

## 🛠️ Configuration

### Dependencies
```python
import requests      # For HTTP requests
from datetime import datetime  # For date handling
```

### No Environment Variables Required
This script doesn't need API keys - it uses Wikipedia's free public API.

## 🚀 Usage

### Basic Testing
```bash
python debug_wiki.py
```

### Integration Testing
Use before running your agents to verify Wikipedia connectivity:
```bash
python debug_wiki.py && python simple_agent.py
```

### Automated Monitoring
Include in health check scripts:
```bash
#!/bin/bash
echo "Checking Wikipedia API..."
python debug_wiki.py
if [ $? -eq 0 ]; then
    echo "Wikipedia API is healthy"
else
    echo "Wikipedia API issues detected"
fi
```

## 🔮 Advanced Usage

### Custom Date Testing
Modify to test specific dates:
```python
# Test a specific date instead of today
from datetime import datetime
date = datetime(2024, 12, 25)  # Christmas
# Then use this date in the API calls
```

### Enhanced Error Analysis
Add more detailed error reporting:
```python
try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print(f"Headers: {response.headers}")
    if not response.ok:
        print(f"Error content: {response.text}")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
```

### Data Quality Analysis
Extend to analyze data quality:
```python
# Check for empty or malformed entries
for event in events:
    if not event.get('year') or not event.get('text'):
        print(f"Warning: Incomplete event data: {event}")
```

This Debug Wikipedia API tool is essential for maintaining reliable data fetching in your historical information agents!