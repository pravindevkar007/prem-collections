import requests
from datetime import datetime, timedelta
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from dotenv import load_dotenv
import os

load_dotenv()

# Base Agent Class
class BaseAgent:
    def __init__(self):
        self.llm = ChatNVIDIA(
            model="ai-llama-3_1-70b-instruct",
            api_key=os.getenv('NVIDIA_API_KEY'),
            temperature=0.7
        )

# Specialized Agent 1: Historical Events
class HistoricalEventsAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.specialty = "Historical Events"
    
    def can_handle(self, question):
        keywords = ["events", "happened", "history", "occurred", "historical"]
        return any(keyword in question.lower() for keyword in keywords)
    
    def get_events_data(self, date):
        headers = {'User-Agent': 'HistoricalAgent/1.0'}
        try:
            url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
            response = requests.get(url, headers=headers, timeout=5)
            return response.json().get('events', [])[:5] if response.ok else []
        except:
            return [
                {'year': 1869, 'text': 'First Transcontinental Railroad completed'},
                {'year': 1940, 'text': 'Winston Churchill becomes UK Prime Minister'}
            ]
    
    def answer(self, question, date=None):
        if not date:
            date = datetime.now()
        
        events = self.get_events_data(date)
        context = f"Historical events on {date.strftime('%B %d, %Y')}:\n"
        
        for i, event in enumerate(events, 1):
            context += f"{i}. {event.get('year')}: {event.get('text')}\n"
        
        prompt = f"""
        {context}
        
        User Question: {question}
        
        As a Historical Events specialist, provide an engaging answer about historical events on this day.
        """
        
        response = self.llm.invoke(prompt)
        return f"🏛️ **Historical Events Agent**: {response.content}"

# Specialized Agent 2: Famous Births
class FamousBirthsAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.specialty = "Famous Births"
    
    def can_handle(self, question):
        keywords = ["born", "birth", "birthday", "celebrities", "famous people"]
        return any(keyword in question.lower() for keyword in keywords)
    
    def get_births_data(self, date):
        headers = {'User-Agent': 'BirthsAgent/1.0'}
        try:
            url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
            response = requests.get(url, headers=headers, timeout=5)
            return response.json().get('births', [])[:5] if response.ok else []
        except:
            return [
                {'year': 1899, 'text': 'Fred Astaire, American dancer and actor'},
                {'year': 1960, 'text': 'Bono, Irish singer (U2)'}
            ]
    
    def answer(self, question, date=None):
        if not date:
            date = datetime.now()
        
        births = self.get_births_data(date)
        context = f"Famous people born on {date.strftime('%B %d, %Y')}:\n"
        
        for i, birth in enumerate(births, 1):
            context += f"{i}. {birth.get('year')}: {birth.get('text')}\n"
        
        prompt = f"""
        {context}
        
        User Question: {question}
        
        As a Famous Births specialist, provide an engaging answer about notable people born on this day.
        """
        
        response = self.llm.invoke(prompt)
        return f"🎂 **Famous Births Agent**: {response.content}"

# Specialized Agent 3: Date & Time
class DateTimeAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.specialty = "Date & Time Information"
    
    def can_handle(self, question):
        keywords = ["date", "time", "today", "day", "when", "current"]
        return any(keyword in question.lower() for keyword in keywords)
    
    def answer(self, question, date=None):
        if not date:
            date = datetime.now()
        
        context = f"""
        Current Date & Time Information:
        - Date: {date.strftime('%B %d, %Y')}
        - Day: {date.strftime('%A')}
        - Time: {date.strftime('%I:%M %p')}
        - Week of Year: {date.strftime('%U')}
        - Day of Year: {date.strftime('%j')}
        """
        
        prompt = f"""
        {context}
        
        User Question: {question}
        
        As a Date & Time specialist, provide current date and time information.
        """
        
        response = self.llm.invoke(prompt)
        return f"📅 **Date & Time Agent**: {response.content}"

# Specialized Agent 4: Holidays & Special Days
class HolidaysAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.specialty = "Holidays & Special Days"
    
    def can_handle(self, question):
        keywords = ["holiday", "celebration", "special day", "observance", "festival"]
        return any(keyword in question.lower() for keyword in keywords)
    
    def get_holidays_data(self, date):
        # Simple holiday data
        month_day = f"{date.month:02d}-{date.day:02d}"
        holidays = {
            "01-01": ["New Year's Day"],
            "02-14": ["Valentine's Day"],
            "12-25": ["Christmas Day"],
            "07-04": ["Independence Day (US)"],
            "10-31": ["Halloween"]
        }
        return holidays.get(month_day, [])
    
    def answer(self, question, date=None):
        if not date:
            date = datetime.now()
        
        holidays = self.get_holidays_data(date)
        context = f"Holidays and special days on {date.strftime('%B %d, %Y')}:\n"
        
        if holidays:
            for holiday in holidays:
                context += f"- {holiday}\n"
        else:
            context += "No major holidays today, but every day is special!\n"
        
        prompt = f"""
        {context}
        
        User Question: {question}
        
        As a Holidays specialist, provide information about holidays and special observances.
        """
        
        response = self.llm.invoke(prompt)
        return f"🎉 **Holidays Agent**: {response.content}"

# Master Coordinator Agent
class CoordinatorAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        # Initialize all specialized agents
        self.agents = {
            'historical': HistoricalEventsAgent(),
            'births': FamousBirthsAgent(),
            'datetime': DateTimeAgent(),
            'holidays': HolidaysAgent()
        }
    
    def route_question(self, question):
        """Determine which agent(s) should handle the question"""
        capable_agents = []
        
        for name, agent in self.agents.items():
            if agent.can_handle(question):
                capable_agents.append((name, agent))
        
        return capable_agents
    
    def handle_question(self, question):
        """Main method to coordinate between agents"""
        print(f"\n🎯 **Coordinator**: Analyzing your question...")
        
        # Route to appropriate agents
        capable_agents = self.route_question(question)
        
        if not capable_agents:
            # General question - use multiple agents
            print("📋 **Coordinator**: This seems like a general question. Let me consult multiple specialists...")
            
            responses = []
            for name, agent in self.agents.items():
                try:
                    response = agent.answer(question)
                    responses.append(response)
                except:
                    continue
            
            return responses
        
        else:
            # Specific question - use targeted agents
            agent_names = [name for name, _ in capable_agents]
            print(f"🎯 **Coordinator**: Routing to {', '.join(agent_names)} specialist(s)...")
            
            responses = []
            for name, agent in capable_agents:
                try:
                    response = agent.answer(question)
                    responses.append(response)
                except Exception as e:
                    responses.append(f"❌ {agent.specialty} Agent encountered an error: {e}")
            
            return responses

# Main Multi-Agent System
class TrueMultiAgentSystem:
    def __init__(self):
        self.coordinator = CoordinatorAgent()
    
    def ask(self, question):
        """Public interface to ask questions"""
        return self.coordinator.handle_question(question)
    
    def show_agents(self):
        """Show all available agents"""
        print("\n🤖 **MULTI-AGENT SYSTEM** - Available Specialists:")
        print("=" * 60)
        for name, agent in self.coordinator.agents.items():
            print(f"• {agent.specialty} Agent")
        print("• Coordinator Agent (Routes questions)")

def main():
    print("🤖 TRUE MULTI-AGENT SYSTEM")
    print("=" * 50)
    
    # Check API key
    if not os.getenv('NVIDIA_API_KEY'):
        print("❌ ERROR: Add your NVIDIA_API_KEY to .env file")
        return
    
    # Initialize multi-agent system
    try:
        system = TrueMultiAgentSystem()
        system.show_agents()
        print("\n✅ Multi-Agent System ready!")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return
    
    # Main interaction loop
    while True:
        print("\n" + "-" * 50)
        user_input = input("Ask the multi-agent system: ").strip()
        
        if user_input.lower() in ['exit', 'quit', 'bye']:
            print("👋 All agents say goodbye!")
            break
        
        if user_input.lower() == 'agents':
            system.show_agents()
            continue
        
        if user_input:
            try:
                responses = system.ask(user_input)
                print("\n" + "=" * 60)
                for response in responses:
                    print(f"{response}\n")
                print("=" * 60)
            except Exception as e:
                print(f"❌ System error: {e}")

if __name__ == "__main__":
    main()