import os
import json
import time
from typing import Dict, Any, List
from dataclasses import dataclass, asdict
from enum import Enum
import requests
from dotenv import load_dotenv

# Load environment
load_dotenv()

class AgentStep(Enum):
    """Define workflow steps"""
    START = "start"
    COLLECT_INFO = "collect_info"
    VALIDATE_INFO = "validate_info"
    PROCESS_REQUEST = "process_request"
    COMPLETE = "complete"

@dataclass
class AgentState:
    """Shared state across all agents - like LangGraph's TypedDict"""
    session_id: str = ""
    current_step: AgentStep = AgentStep.START
    user_input: str = ""
    collected_data: Dict[str, Any] = None
    messages: List[Dict[str, str]] = None
    response_queue: List[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.collected_data is None:
            self.collected_data = {}
        if self.messages is None:
            self.messages = []
        if self.response_queue is None:
            self.response_queue = []

class BaseAgent:
    """Base agent class - similar to LangGraph nodes"""
    
    def __init__(self, name: str):
        self.name = name
        self.api_key = os.getenv('NVIDIA_API_KEY')
        self.api_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "meta/llama-3.1-70b-instruct"
    
    def call_llm(self, prompt: str, temperature: float = 0.7) -> str:
        """Call NVIDIA API - similar to LangChain's LLM call"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500,
            "temperature": temperature
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        except Exception as e:
            return f"Error: {str(e)}"
    
    def execute(self, state: AgentState) -> AgentState:
        """Execute agent logic - override in subclasses"""
        raise NotImplementedError

class InfoCollectorAgent(BaseAgent):
    """Collects user information - like travel details collector"""
    
    def __init__(self):
        super().__init__("InfoCollector")
        self.required_fields = ["name", "destination", "purpose"]
    
    def execute(self, state: AgentState) -> AgentState:
        print(f"\n[{self.name}] Agent Active")
        
        # Check what info we still need
        missing_fields = [field for field in self.required_fields 
                         if field not in state.collected_data or not state.collected_data[field]]
        
        if missing_fields:
            # Generate conversational prompt for missing info
            prompt = f"""You are a helpful assistant collecting travel information.
            
Current collected data: {json.dumps(state.collected_data, indent=2)}
Missing fields: {missing_fields}
User's last input: "{state.user_input}"

Generate a friendly, conversational question to ask for the next missing field.
Be specific and helpful. Only ask for ONE field at a time.
Keep it short and natural."""

            question = self.call_llm(prompt, temperature=0.3)
            
            state.response_queue.append({
                "message": question,
                "type": "question",
                "missing_fields": missing_fields
            })
            
            state.current_step = AgentStep.COLLECT_INFO
        else:
            # All info collected, move to validation
            state.current_step = AgentStep.VALIDATE_INFO
            state.response_queue.append({
                "message": "Great! I have all the information. Let me validate it.",
                "type": "info"
            })
        
        return state

class ValidationAgent(BaseAgent):
    """Validates collected information"""
    
    def __init__(self):
        super().__init__("Validator")
    
    def execute(self, state: AgentState) -> AgentState:
        print(f"\n[{self.name}] Agent Active")
        
        prompt = f"""Review this collected information and provide validation:

Collected Data: {json.dumps(state.collected_data, indent=2)}

Check if:
1. All required fields are present and valid
2. The information makes sense
3. Any potential issues or suggestions

Provide a brief, friendly summary and ask for confirmation.
Format: "I see you want to travel to [destination] for [purpose]. Is this correct?"
"""
        
        validation_response = self.call_llm(prompt, temperature=0.2)
        
        state.response_queue.append({
            "message": validation_response,
            "type": "confirmation",
            "options": ["Yes, that's correct", "No, let me change something"]
        })
        
        state.current_step = AgentStep.VALIDATE_INFO
        return state

class ProcessorAgent(BaseAgent):
    """Processes the validated request"""
    
    def __init__(self):
        super().__init__("Processor")
    
    def execute(self, state: AgentState) -> AgentState:
        print(f"\n[{self.name}] Agent Active")
        
        prompt = f"""Based on this travel request, generate helpful suggestions:

Travel Details: {json.dumps(state.collected_data, indent=2)}

Provide:
1. Best time to visit
2. Weather expectations
3. What to pack
4. Local tips

Keep it concise and helpful."""
        
        suggestions = self.call_llm(prompt, temperature=0.5)
        
        state.response_queue.append({
            "message": f"Here are some suggestions for your trip:\n\n{suggestions}",
            "type": "suggestions"
        })
        
        state.current_step = AgentStep.COMPLETE
        return state

class SimpleWorkflow:
    """Simple workflow orchestrator - like LangGraph"""
    
    def __init__(self):
        self.agents = {
            AgentStep.START: InfoCollectorAgent(),
            AgentStep.COLLECT_INFO: InfoCollectorAgent(),
            AgentStep.VALIDATE_INFO: ValidationAgent(),
            AgentStep.PROCESS_REQUEST: ProcessorAgent()
        }
    
    def route_next_step(self, state: AgentState) -> AgentStep:
        """Routing logic - like LangGraph edges"""
        if state.current_step == AgentStep.VALIDATE_INFO:
            if state.user_input and "yes" in state.user_input.lower():
                return AgentStep.PROCESS_REQUEST
            elif state.user_input and "no" in state.user_input.lower():
                return AgentStep.COLLECT_INFO
        
        return state.current_step
    
    def execute_step(self, state: AgentState) -> AgentState:
        """Execute current step"""
        current_step = self.route_next_step(state)
        
        if current_step in self.agents:
            agent = self.agents[current_step]
            state = agent.execute(state)
        
        return state

def parse_user_input(user_input: str, state: AgentState) -> AgentState:
    """Parse user input and update state"""
    state.user_input = user_input
    
    # Simple parsing logic
    if state.current_step == AgentStep.COLLECT_INFO:
        missing_fields = ["name", "destination", "purpose"]
        for field in missing_fields:
            if field not in state.collected_data or not state.collected_data[field]:
                # Try to extract this field from user input
                if field == "name" and not state.collected_data.get("name"):
                    state.collected_data["name"] = user_input
                elif field == "destination" and not state.collected_data.get("destination"):
                    state.collected_data["destination"] = user_input
                elif field == "purpose" and not state.collected_data.get("purpose"):
                    state.collected_data["purpose"] = user_input
                break
    
    return state

def main():
    """Main interactive loop"""
    print("Multi-Agent System - NVIDIA Powered")
    print("=" * 50)
    
    # Initialize state
    state = AgentState(
        session_id="demo_session",
        current_step=AgentStep.START
    )
    
    # Initialize workflow
    workflow = SimpleWorkflow()
    
    print("Hi! I'm your travel assistant. Let's plan your trip!")
    
    while state.current_step != AgentStep.COMPLETE:
        # Execute current step
        state = workflow.execute_step(state)
        
        # Display responses
        for response in state.response_queue:
            print(f"\nAI: {response['message']}")
            
            if response.get('options'):
                print("Options:", " | ".join(response['options']))
        
        # Clear response queue
        state.response_queue = []
        
        # Get user input (interrupt point)
        if state.current_step != AgentStep.COMPLETE:
            user_input = input("\nYou: ").strip()
            state = parse_user_input(user_input, state)
    
    print("\nWorkflow Complete!")
    print(f"Final collected data: {json.dumps(state.collected_data, indent=2)}")

if __name__ == "__main__":
    main()