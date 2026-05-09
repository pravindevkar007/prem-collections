"""
SIMPLE DAILY INFO AGENT
======================
A clean, single-agent system that answers questions about historical events 
and famous births on any given day using Wikipedia data and NVIDIA AI.
"""

import requests
from datetime import datetime
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from dotenv import load_dotenv
import os

load_dotenv()

class SimpleDayAgent:
    """Simple agent for historical day information"""
    
    def __init__(self):
        """Initialize agent with NVIDIA AI"""
        self.llm = ChatNVIDIA(
            model="ai-llama-3_1-70b-instruct",
            api_key=os.getenv('NVIDIA_API_KEY'),
            temperature=0.7
        )
        self.headers = {'User-Agent': 'SimpleDayAgent/2.0 (Educational)'}
    
    def get_day_info(self, date=None):
        """Fetch historical data for a specific date"""
        if not date:
            date = datetime.now()
        
        try:
            # Try Wikipedia API
            events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
            births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
            
            events_response = requests.get(events_url, headers=self.headers, timeout=5)
            births_response = requests.get(births_url, headers=self.headers, timeout=5)
            
            events = events_response.json().get('events', [])[:5] if events_response.ok else []
            births = births_response.json().get('births', [])[:5] if births_response.ok else []
            
            return {
                'events': events,
                'births': births,
                'date': date.strftime("%B %d, %Y")
            }
            
        except Exception:
            # Fallback data for common dates
            return self._get_fallback_data(date)
    
    def _get_fallback_data(self, date):
        """Provide sample data when API fails"""
        fallback_db = {
            (5, 10): {
                'events': [
                    {'year': 1869, 'text': 'First Transcontinental Railroad completed in the United States'},
                    {'year': 1940, 'text': 'Winston Churchill becomes Prime Minister of the United Kingdom'},
                    {'year': 1994, 'text': 'Nelson Mandela inaugurated as South Africa\'s first black president'}
                ],
                'births': [
                    {'year': 1899, 'text': 'Fred Astaire, American dancer and actor'},
                    {'year': 1960, 'text': 'Bono, Irish singer and U2 frontman'},
                    {'year': 1946, 'text': 'Donovan, Scottish singer-songwriter'}
                ]
            },
            (12, 25): {
                'events': [
                    {'year': 800, 'text': 'Charlemagne crowned Holy Roman Emperor'},
                    {'year': 1066, 'text': 'William the Conqueror crowned King of England'}
                ],
                'births': [
                    {'year': 1642, 'text': 'Isaac Newton, English physicist and mathematician'}
                ]
            }
        }
        
        date_key = (date.month, date.day)
        data = fallback_db.get(date_key, {'events': [], 'births': []})
        
        return {
            'events': data['events'],
            'births': data['births'],
            'date': date.strftime("%B %d, %Y")
        }
    
    def answer_query(self, user_query):
        """Main method to answer user questions"""
        # Get historical data
        day_info = self.get_day_info()
        
        # Build context
        context = f"Date: {day_info['date']}\n\n"
        
        # Add events
        context += "Historical Events:\n"
        if day_info['events']:
            for i, event in enumerate(day_info['events'], 1):
                context += f"{i}. {event.get('year')}: {event.get('text')}\n"
        else:
            context += "No specific events data available.\n"
        
        # Add births
        context += "\nFamous Births:\n"
        if day_info['births']:
            for i, birth in enumerate(day_info['births'], 1):
                context += f"{i}. {birth.get('year')}: {birth.get('text')}\n"
        else:
            context += "No specific births data available.\n"
        
        # Create AI prompt
        prompt = f"""
Context: {context}

User Question: {user_query}

Instructions:
- Answer using the historical information provided
- Be conversational and engaging
- Make history interesting with storytelling
- If no data available, be honest but helpful

Response:"""
        
        response = self.llm.invoke(prompt)
        return response.content
    
    def show_help(self):
        """Show supported questions"""
        return """
🤖 SIMPLE DAY AGENT - Supported Questions:

📅 GENERAL:
• "Tell me about today"
• "What's special about today?"
• "How was today in history?"

📜 EVENTS:
• "What happened today in history?"
• "Historical events on this day"

🎂 BIRTHS:
• "Who was born today?"
• "Famous birthdays today"

📚 SPECIFIC DATES:
• "What happened on December 25th?"
• "Tell me about July 4th"

Type 'help' anytime to see this menu!
        """

def main():
    """Main function to run the agent"""
    print("🤖 SIMPLE DAY AGENT")
    print("=" * 40)
    print("Ask me about historical events and famous births!")
    print("Type 'help' to see what I can answer.")
    print("=" * 40)
    
    # Check API key
    if not os.getenv('NVIDIA_API_KEY'):
        print("❌ ERROR: Add NVIDIA_API_KEY to .env file")
        print("Get your free key from: https://build.nvidia.com/")
        return
    
    # Initialize agent
    try:
        agent = SimpleDayAgent()
        print("✅ Agent ready!")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return
    
    # Main loop
    while True:
        print("\n" + "-" * 40)
        user_input = input("You: ").strip()
        
        if user_input.lower() in ['exit', 'quit', 'bye']:
            print("👋 Goodbye!")
            break
        
        if user_input.lower() in ['help', '?']:
            print(agent.show_help())
            continue
        
        if user_input:
            print("\nAgent: ", end="")
            try:
                response = agent.answer_query(user_input)
                print(response)
            except Exception as e:
                print(f"Sorry, error: {e}")
        else:
            print("Ask me something! Type 'help' for examples.")

if __name__ == "__main__":
    main()