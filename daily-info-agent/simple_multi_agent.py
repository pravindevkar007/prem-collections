import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import json

load_dotenv()

class SimpleMultiQuestionDayAgent:
    def __init__(self):
        """Initialize the agent with NVIDIA AI"""
        self.api_key = os.getenv('NVIDIA_API_KEY')
        self.base_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "meta/llama-3.1-70b-instruct"
        self.supported_questions = self._get_supported_questions()
    
    def _get_supported_questions(self):
        """Define what types of questions the agent can handle"""
        return {
            "historical_events": [
                "what happened today", "historical events", "events on this day",
                "what occurred", "history of today", "significant events"
            ],
            "famous_births": [
                "who was born today", "famous birthdays", "births on this day",
                "celebrities born", "notable people born"
            ],
            "famous_deaths": [
                "who died today", "deaths on this day", "people who passed away",
                "notable deaths", "famous deaths"
            ],
            "holidays": [
                "holidays today", "special days", "observances", 
                "celebrations", "what holiday is it"
            ],
            "date_info": [
                "today's date", "what day is it", "current date",
                "date and time", "today's information"
            ],
            "tomorrow": [
                "tomorrow", "next day", "what about tomorrow",
                "tomorrow's events", "preview tomorrow"
            ],
            "general": [
                "tell me about today", "how was today", "today's significance",
                "what's special about today", "daily briefing"
            ]
        }
    
    def get_historical_data(self, date=None):
        """Fetch historical data for a specific date"""
        if not date:
            date = datetime.now()
        
        headers = {'User-Agent': 'DailyInfoAgent/2.0 (Educational Purpose)'}
        
        try:
            # Try Wikipedia API
            events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
            births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
            deaths_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/{date.month}/{date.day}"
            
            events_response = requests.get(events_url, headers=headers, timeout=5)
            births_response = requests.get(births_url, headers=headers, timeout=5)
            deaths_response = requests.get(deaths_url, headers=headers, timeout=5)
            
            return {
                'events': events_response.json().get('events', [])[:5] if events_response.ok else [],
                'births': births_response.json().get('births', [])[:5] if births_response.ok else [],
                'deaths': deaths_response.json().get('deaths', [])[:5] if deaths_response.ok else [],
                'date': date.strftime("%B %d, %Y"),
                'day_name': date.strftime("%A")
            }
        except Exception as e:
            print(f"API Error: {e}")
            return self._get_fallback_data(date)
    
    def _get_fallback_data(self, date):
        """Provide fallback data when API fails"""
        return {
            'events': [
                {'year': 1969, 'text': 'Apollo 11 moon landing (example)'},
                {'year': 1989, 'text': 'Berlin Wall falls (example)'}
            ],
            'births': [
                {'year': 1955, 'text': 'Bill Gates, Microsoft founder (example)'}
            ],
            'deaths': [
                {'year': 1963, 'text': 'John F. Kennedy (example)'}
            ],
            'date': date.strftime("%B %d, %Y"),
            'day_name': date.strftime("%A")
        }
    
    def classify_question(self, question):
        """Determine what type of question the user is asking"""
        question_lower = question.lower()
        
        for category, keywords in self.supported_questions.items():
            if any(keyword in question_lower for keyword in keywords):
                return category
        
        return "general"
    
    def call_nvidia_api(self, prompt):
        """Call NVIDIA API directly"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 600
        }
        
        try:
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content']
        except Exception as e:
            return f"Sorry, I encountered an error: {e}"
    
    def answer_question(self, user_question):
        """Main method to answer any user question"""
        question_type = self.classify_question(user_question)
        
        # Handle different date requests
        if "tomorrow" in user_question.lower():
            date = datetime.now() + timedelta(days=1)
        else:
            date = datetime.now()
        
        # Get historical data
        data = self.get_historical_data(date)
        
        # Create context based on question type
        context = self._build_context(data, question_type)
        
        # Generate response
        prompt = f"""
Context: {context}

User Question: {user_question}

Instructions:
- Answer the user's question using the provided historical information
- Be conversational, engaging, and informative
- If asking about specific categories (events, births, deaths), focus on those
- If asking generally, provide a nice overview
- If no data is available, be honest but still helpful
- Make it interesting and educational
- Keep response under 300 words

Response:"""
        
        return self.call_nvidia_api(prompt)
    
    def _build_context(self, data, question_type):
        """Build appropriate context based on question type"""
        context = f"Date: {data['date']} ({data['day_name']})\n\n"
        
        if question_type in ["historical_events", "general"]:
            context += "Historical Events:\n"
            if data['events']:
                for i, event in enumerate(data['events'], 1):
                    context += f"{i}. {event.get('year')}: {event.get('text')}\n"
            else:
                context += "No specific events data available.\n"
            context += "\n"
        
        if question_type in ["famous_births", "general"]:
            context += "Famous Births:\n"
            if data['births']:
                for i, birth in enumerate(data['births'], 1):
                    context += f"{i}. {birth.get('year')}: {birth.get('text')}\n"
            else:
                context += "No specific births data available.\n"
            context += "\n"
        
        if question_type in ["famous_deaths", "general"]:
            context += "Notable Deaths:\n"
            if data['deaths']:
                for i, death in enumerate(data['deaths'], 1):
                    context += f"{i}. {death.get('year')}: {death.get('text')}\n"
            else:
                context += "No specific deaths data available.\n"
            context += "\n"
        
        if question_type == "date_info":
            context += f"Current Date Information:\n"
            context += f"Today is {data['date']}, a {data['day_name']}\n\n"
        
        return context
    
    def show_help(self):
        """Show what questions the agent can answer"""
        help_text = """
🤖 SIMPLE MULTI-QUESTION DAY AGENT - What I Can Answer:

📅 DATE & TIME:
• "What's today's date?"
• "What day is it?"
• "Today's date and time"

📜 HISTORICAL EVENTS:
• "What happened today in history?"
• "Historical events on this day"
• "Significant events today"

🎂 FAMOUS BIRTHS:
• "Who was born today?"
• "Famous birthdays today"
• "Celebrities born on this day"

⚰️ NOTABLE DEATHS:
• "Who died on this day?"
• "Famous deaths today"
• "Notable people who passed away"

🔮 TOMORROW'S INFO:
• "What about tomorrow?"
• "Tomorrow's historical events"
• "Preview of tomorrow"

📚 GENERAL BRIEFING:
• "Tell me about today"
• "How was today in history?"
• "Today's significance"
• "Daily briefing"

Type 'help' anytime to see this menu again!
        """
        return help_text

def main():
    print("🤖 SIMPLE MULTI-QUESTION DAY AGENT")
    print("=" * 50)
    
    # Check API key
    if not os.getenv('NVIDIA_API_KEY'):
        print("❌ ERROR: Add your NVIDIA_API_KEY to .env file")
        return
    
    # Initialize agent
    try:
        agent = SimpleMultiQuestionDayAgent()
        print("✅ Agent ready! Type 'help' to see what I can answer.")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return
    
    # Main chat loop
    while True:
        print("\n" + "-" * 50)
        user_input = input("Ask me anything: ").strip()
        
        if user_input.lower() in ['exit', 'quit', 'bye', 'goodbye']:
            print("👋 Goodbye! Thanks for using the Day Agent!")
            break
        
        if user_input.lower() in ['help', '?']:
            print(agent.show_help())
            continue
        
        if user_input:
            print("\n🤖 Agent:")
            try:
                response = agent.answer_question(user_input)
                print(response)
            except Exception as e:
                print(f"Sorry, I encountered an error: {e}")
        else:
            print("Please ask me something! Type 'help' for examples.")

if __name__ == "__main__":
    main()