"""
SIMPLE DAILY INFO AGENT
======================

A clean, single-agent system that answers questions about historical events 
and famous births on any given day using Wikipedia data and NVIDIA AI.

SUPPORTED QUESTIONS:
- "What happened today in history?"
- "Who was born today?"
- "Tell me about today"
- "How was May 10th in history?"
- "What's special about today?"
- Any general question about historical significance of dates

HOW IT WORKS:
1. Fetches historical data from Wikipedia API
2. Falls back to sample data if API fails
3. Uses NVIDIA AI to create engaging responses
4. Combines factual data with conversational AI
"""

import requests
from datetime import datetime
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class CleanDayAgent:
    """
    A simple agent that provides historical information about any day.
    
    Features:
    - Wikipedia API integration for real historical data
    - NVIDIA AI for engaging responses
    - Fallback data when API is unavailable
    - Clean, conversational interface
    """
    
    def __init__(self):
        """Initialize the agent with NVIDIA AI model"""
        self.llm = ChatNVIDIA(
            model="ai-llama-3_1-70b-instruct",
            api_key=os.getenv('NVIDIA_API_KEY'),
            temperature=0.7  # Balanced creativity
        )
        
        # API configuration
        self.headers = {
            'User-Agent': 'CleanDayAgent/2.0 (Educational Purpose)'
        }
        
        print("✅ Agent initialized successfully!")
    
    def fetch_historical_data(self, date=None):
        """
        Fetch historical events and births for a specific date.
        
        Args:
            date (datetime, optional): Target date. Defaults to today.
            
        Returns:
            dict: Contains events, births, and formatted date
        """
        if not date:
            date = datetime.now()
        
        print(f"🔍 Fetching data for {date.strftime('%B %d, %Y')}...")
        
        try:
            # Wikipedia API endpoints
            events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
            births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
            
            # Make API requests
            events_response = requests.get(events_url, headers=self.headers, timeout=5)
            births_response = requests.get(births_url, headers=self.headers, timeout=5)
            
            # Parse responses
            events = events_response.json().get('events', [])[:5] if events_response.ok else []
            births = births_response.json().get('births', [])[:5] if births_response.ok else []
            
            print(f"📊 Found {len(events)} events and {len(births)} births")
            
            return {
                'events': events,
                'births': births,
                'date': date.strftime("%B %d, %Y"),
                'day_name': date.strftime("%A")
            }
            
        except Exception as e:
            print(f"⚠️ API failed, using fallback data: {e}")
            return self._get_fallback_data(date)
    
    def _get_fallback_data(self, date):
        """
        Provide sample historical data when Wikipedia API is unavailable.
        
        Args:
            date (datetime): Target date
            
        Returns:
            dict: Sample historical data
        """
        # Sample data for common dates
        fallback_database = {
            (5, 10): {  # May 10th
                'events': [
                    {'year': 1869, 'text': 'First Transcontinental Railroad completed in the United States'},
                    {'year': 1940, 'text': 'Winston Churchill becomes Prime Minister of the United Kingdom'},
                    {'year': 1994, 'text': 'Nelson Mandela inaugurated as South Africa\\'s first black president'}
                ],
                'births': [
                    {'year': 1899, 'text': 'Fred Astaire, American dancer and actor'},
                    {'year': 1960, 'text': 'Bono, Irish singer and U2 frontman'},
                    {'year': 1946, 'text': 'Donovan, Scottish singer-songwriter'}
                ]
            },
            (12, 25): {  # Christmas
                'events': [
                    {'year': 800, 'text': 'Charlemagne crowned Holy Roman Emperor'},
                    {'year': 1066, 'text': 'William the Conqueror crowned King of England'}
                ],
                'births': [
                    {'year': 1642, 'text': 'Isaac Newton, English physicist and mathematician'}
                ]
            },
            (7, 4): {  # July 4th
                'events': [
                    {'year': 1776, 'text': 'United States Declaration of Independence signed'},
                    {'year': 1826, 'text': 'Thomas Jefferson and John Adams both die on 50th anniversary of Declaration'}
                ],
                'births': [
                    {'year': 1872, 'text': 'Calvin Coolidge, 30th President of the United States'}
                ]
            }
        }\n        \n        # Get data for this specific date or return empty\n        date_key = (date.month, date.day)\n        data = fallback_database.get(date_key, {'events': [], 'births': []})\n        \n        return {\n            'events': data['events'],\n            'births': data['births'],\n            'date': date.strftime(\"%B %d, %Y\"),\n            'day_name': date.strftime(\"%A\")\n        }\n    \n    def create_context(self, data):\n        \"\"\"\n        Build context string from historical data for AI processing.\n        \n        Args:\n            data (dict): Historical data containing events and births\n            \n        Returns:\n            str: Formatted context for AI prompt\n        \"\"\"\n        context = f\"Date: {data['date']} ({data['day_name']})\\n\\n\"\n        \n        # Add historical events\n        context += \"Historical Events on this day:\\n\"\n        if data['events']:\n            for i, event in enumerate(data['events'], 1):\n                year = event.get('year', 'Unknown')\n                text = event.get('text', 'No description')\n                context += f\"{i}. {year}: {text}\\n\"\n        else:\n            context += \"No specific historical events data available.\\n\"\n        \n        # Add famous births\n        context += \"\\nFamous people born on this day:\\n\"\n        if data['births']:\n            for i, birth in enumerate(data['births'], 1):\n                year = birth.get('year', 'Unknown')\n                text = birth.get('text', 'No description')\n                context += f\"{i}. {year}: {text}\\n\"\n        else:\n            context += \"No specific births data available.\\n\"\n        \n        return context\n    \n    def answer_question(self, user_question):\n        \"\"\"\n        Main method to answer user questions about historical dates.\n        \n        Args:\n            user_question (str): User's question about historical information\n            \n        Returns:\n            str: AI-generated response with historical information\n        \"\"\"\n        # Step 1: Get historical data\n        historical_data = self.fetch_historical_data()\n        \n        # Step 2: Create context for AI\n        context = self.create_context(historical_data)\n        \n        # Step 3: Create AI prompt\n        prompt = f\"\"\"\nContext: {context}\n\nUser Question: {user_question}\n\nInstructions:\n- Answer the user's question using the historical information provided\n- Be conversational, engaging, and educational\n- If they ask generally about the day, highlight the most interesting events and births\n- If no specific data is available, use your knowledge but mention the limitation\n- Make history come alive with storytelling\n- Keep the response informative but not overwhelming\n\nResponse:\"\"\"\n        \n        # Step 4: Get AI response\n        print(\"🤖 Generating response...\")\n        response = self.llm.invoke(prompt)\n        return response.content\n    \n    def show_capabilities(self):\n        \"\"\"\n        Display what questions the agent can answer.\n        \"\"\"\n        capabilities = \"\"\"\n🤖 CLEAN DAY AGENT - What I Can Answer:\n\n📅 GENERAL DAY QUESTIONS:\n• \"Tell me about today\"\n• \"What's special about today?\"\n• \"How was today in history?\"\n• \"Give me today's historical briefing\"\n\n📜 HISTORICAL EVENTS:\n• \"What happened today in history?\"\n• \"What historical events occurred today?\"\n• \"What significant events happened on this day?\"\n\n🎂 FAMOUS BIRTHS:\n• \"Who was born today?\"\n• \"What famous people were born today?\"\n• \"Any notable birthdays today?\"\n\n📚 SPECIFIC DATES:\n• \"What happened on December 25th?\"\n• \"Tell me about July 4th in history\"\n• \"What's significant about January 1st?\"\n\n💡 EXAMPLES:\n• \"What happened on May 10th throughout history?\"\n• \"Who are some famous people born on Christmas?\"\n• \"Tell me something interesting about today\"\n• \"What makes this day special in history?\"\n\n🎯 HOW IT WORKS:\n1. Fetches real data from Wikipedia API\n2. Uses fallback data if API is unavailable  \n3. Combines facts with AI storytelling\n4. Provides engaging, educational responses\n        \"\"\"\n        return capabilities\n\ndef main():\n    \"\"\"\n    Main function to run the Clean Day Agent.\n    \"\"\"\n    print(\"🤖 CLEAN DAY AGENT\")\n    print(\"=\" * 50)\n    print(\"Ask me about historical events and famous births on any day!\")\n    print(\"Type 'help' to see what I can answer.\")\n    print(\"=\" * 50)\n    \n    # Check for API key\n    if not os.getenv('NVIDIA_API_KEY'):\n        print(\"❌ ERROR: NVIDIA_API_KEY not found in .env file\")\n        print(\"Please add your API key from https://build.nvidia.com/\")\n        return\n    \n    # Initialize agent\n    try:\n        agent = CleanDayAgent()\n    except Exception as e:\n        print(f\"❌ Failed to initialize agent: {e}\")\n        return\n    \n    # Main interaction loop\n    while True:\n        print(\"\\n\" + \"-\" * 50)\n        user_input = input(\"Ask me anything: \").strip()\n        \n        # Handle exit commands\n        if user_input.lower() in ['exit', 'quit', 'bye', 'goodbye']:\n            print(\"👋 Thanks for using Clean Day Agent! Goodbye!\")\n            break\n        \n        # Handle help command\n        if user_input.lower() in ['help', '?', 'capabilities']:\n            print(agent.show_capabilities())\n            continue\n        \n        # Handle empty input\n        if not user_input:\n            print(\"Please ask me something! Type 'help' for examples.\")\n            continue\n        \n        # Process question\n        try:\n            print(\"\\n\" + \"=\" * 50)\n            response = agent.answer_question(user_input)\n            print(f\"🤖 Agent: {response}\")\n            print(\"=\" * 50)\n        except Exception as e:\n            print(f\"❌ Sorry, I encountered an error: {e}\")\n            print(\"Please try asking your question differently.\")\n\nif __name__ == \"__main__\":\n    main()"