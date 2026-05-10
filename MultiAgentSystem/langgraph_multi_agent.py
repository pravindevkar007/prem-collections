"""
Simple Working LangGraph Multi-Agent System
==========================================

This is a simplified LangGraph implementation that actually works without infinite loops.
"""

import os
import json
import time
from typing import TypedDict, Literal
import requests
from dotenv import load_dotenv

# LangGraph imports
from langgraph.graph import StateGraph, END

# Load environment
load_dotenv()

# ============================================================================
# SIMPLE STATE DEFINITION
# ============================================================================

class SimpleState(TypedDict):
    """Simple state that works reliably"""
    step: str
    name: str
    destination: str
    purpose: str
    message: str
    complete: bool

# ============================================================================
# RATE LIMITED API
# ============================================================================

class SimpleNvidiaAPI:
    """Simple NVIDIA API wrapper with rate limiting"""
    
    def __init__(self):
        self.api_key = os.getenv('NVIDIA_API_KEY')
        self.api_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "meta/llama-3.1-70b-instruct"
        self.last_call = 0
    
    def call(self, prompt: str) -> str:
        """Make a rate-limited API call"""
        # Rate limiting
        now = time.time()
        if now - self.last_call < 1:
            time.sleep(1 - (now - self.last_call))
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 200,
            "temperature": 0.7
        }
        
        try:
            self.last_call = time.time()
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=20)
            
            if response.status_code == 429:
                print("Rate limited, using fallback...")
                return "I'm experiencing high demand. Let me give you a simple response."
            
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
            
        except Exception as e:
            print(f"API error: {e}")
            return "I'm having connection issues. Let me continue with a basic response."

# Initialize API
api = SimpleNvidiaAPI()

# ============================================================================
# SIMPLE AGENT NODES
# ============================================================================

def start_node(state: SimpleState) -> SimpleState:
    """Starting node"""
    print("\n[Start] Initializing...")
    return {
        **state,
        "step": "collect_name",
        "message": "Hi! I'm your travel assistant. What's your name?",
        "complete": False
    }

def collect_name_node(state: SimpleState) -> SimpleState:
    """Collect user's name"""
    print("\n[NameCollector] Active")
    
    if not state.get("name"):
        return {
            **state,
            "step": "waiting_name",
            "message": "Hi! I'm your travel assistant. What's your name?"
        }
    else:
        return {
            **state,
            "step": "collect_destination",
            "message": f"Nice to meet you, {state['name']}! Where are you planning to travel?"
        }

def collect_destination_node(state: SimpleState) -> SimpleState:
    """Collect destination"""
    print("\n[DestinationCollector] Active")
    
    if not state.get("destination"):
        return {
            **state,
            "step": "waiting_destination",
            "message": f"Hi {state.get('name', 'there')}! Where would you like to travel?"
        }
    else:
        return {
            **state,
            "step": "collect_purpose",
            "message": f"Great! {state['destination']} sounds interesting. What's the purpose of your trip?"
        }

def collect_purpose_node(state: SimpleState) -> SimpleState:
    """Collect travel purpose"""
    print("\n[PurposeCollector] Active")
    
    if not state.get("purpose"):
        return {
            **state,
            "step": "waiting_purpose",
            "message": "What's the purpose of your trip (business, vacation, family, etc.)?"
        }
    else:
        return {
            **state,
            "step": "validate",
            "message": f"Perfect! So you're {state['name']}, traveling to {state['destination']} for {state['purpose']}. Is this correct? (yes/no)"
        }

def validate_node(state: SimpleState) -> SimpleState:
    """Validate information"""
    print("\n[Validator] Active")
    
    return {
        **state,
        "step": "waiting_validation",
        "message": f"Let me confirm: You're {state.get('name', 'N/A')}, traveling to {state.get('destination', 'N/A')} for {state.get('purpose', 'N/A')}. Is this correct? (yes/no)"
    }

def process_node(state: SimpleState) -> SimpleState:
    """Process and provide suggestions"""
    print("\n[Processor] Active")
    
    # Try to get AI suggestions
    prompt = f"Give brief travel tips for {state.get('destination', 'travel')} for {state.get('purpose', 'a trip')}. Keep it under 100 words."
    
    suggestions = api.call(prompt)
    
    if "connection issues" in suggestions or "high demand" in suggestions:
        suggestions = f"For your {state.get('purpose', 'trip')} to {state.get('destination', 'your destination')}, remember to check weather, pack essentials, and research local customs. Have a great trip!"
    
    return {
        **state,
        "step": "complete",
        "message": f"Here are some suggestions for your trip:\\n\\n{suggestions}",
        "complete": True
    }

# ============================================================================
# ROUTING FUNCTIONS
# ============================================================================

def route_from_name(state: SimpleState) -> Literal["collect_destination", "collect_name"]:
    """Route after name collection"""
    if state.get("name"):
        return "collect_destination"
    return "collect_name"

def route_from_destination(state: SimpleState) -> Literal["collect_purpose", "collect_destination"]:
    """Route after destination collection"""
    if state.get("destination"):
        return "collect_purpose"
    return "collect_destination"

def route_from_purpose(state: SimpleState) -> Literal["validate", "collect_purpose"]:
    """Route after purpose collection"""
    if state.get("purpose"):
        return "validate"
    return "collect_purpose"

def route_from_validation(state: SimpleState) -> Literal["process", "collect_name", "validate"]:
    """Route after validation"""
    # This will be handled by user input processing
    return "process"

# ============================================================================
# WORKFLOW CREATION
# ============================================================================

def create_simple_workflow():
    """Create a simple working workflow"""
    
    workflow = StateGraph(SimpleState)
    
    # Add nodes
    workflow.add_node("start", start_node)
    workflow.add_node("collect_name", collect_name_node)
    workflow.add_node("collect_destination", collect_destination_node)
    workflow.add_node("collect_purpose", collect_purpose_node)
    workflow.add_node("validate", validate_node)
    workflow.add_node("process", process_node)
    
    # Set entry point
    workflow.set_entry_point("start")
    
    # Add edges (simplified)
    workflow.add_edge("start", "collect_name")
    workflow.add_conditional_edges("collect_name", route_from_name)
    workflow.add_conditional_edges("collect_destination", route_from_destination)
    workflow.add_conditional_edges("collect_purpose", route_from_purpose)
    workflow.add_edge("validate", "process")
    workflow.add_edge("process", END)
    
    return workflow.compile()

# ============================================================================
# SIMPLE EXECUTION
# ============================================================================

def run_simple_langgraph():
    """Run the workflow with manual control"""
    print("Simple LangGraph Multi-Agent System")
    print("=" * 40)
    
    # Initialize state
    state = {
        "step": "start",
        "name": "",
        "destination": "",
        "purpose": "",
        "message": "",
        "complete": False
    }
    
    # Create workflow
    app = create_simple_workflow()
    
    try:
        # Manual step-by-step execution
        while not state.get("complete", False):
            
            # Execute current step
            if state["step"] == "start":
                state = start_node(state)
                print(f"\\nAI: {state['message']}")
                
            elif state["step"] == "collect_name":
                if not state.get("name"):
                    print(f"\\nAI: Hi! I'm your travel assistant. What's your name?")
                    user_input = input("You: ").strip()
                    state["name"] = user_input
                    state["step"] = "collect_destination"
                    print(f"\\nAI: Nice to meet you, {state['name']}! Where are you planning to travel?")
                    
            elif state["step"] == "collect_destination":
                if not state.get("destination"):
                    user_input = input("You: ").strip()
                    state["destination"] = user_input
                    state["step"] = "collect_purpose"
                    print(f"\\nAI: Great! {state['destination']} sounds interesting. What's the purpose of your trip?")
                    
            elif state["step"] == "collect_purpose":
                if not state.get("purpose"):
                    user_input = input("You: ").strip()
                    state["purpose"] = user_input
                    state["step"] = "validate"
            elif state["step"] == "validate":
                print(f"\\nAI: Let me confirm: You're {state['name']}, traveling to {state['destination']} for {state['purpose']}. Is this correct? (yes/no)")
                user_input = input("You: ").strip().lower()
                
                if "yes" in user_input or "correct" in user_input:
                    state["step"] = "process"
                elif "no" in user_input:
                    state["name"] = ""
                    state["destination"] = ""
                    state["purpose"] = ""
                    state["step"] = "collect_name"
            elif state["step"] == "process":
                print("\\n[Processing] Getting travel suggestions...")
                prompt = f"Give brief travel tips for {state['destination']} for {state['purpose']}. Keep it under 100 words."
                suggestions = api.call(prompt)
                
                if "connection issues" in suggestions or "high demand" in suggestions:
                    suggestions = f"For your {state['purpose']} to {state['destination']}, remember to check weather, pack essentials, and research local customs. Have a great trip!"
                
                print(f"\\nAI: Here are some suggestions for your trip:\\n\\n{suggestions}")
                state["complete"] = True
                break
    
    except KeyboardInterrupt:
        print("\\n\\nWorkflow interrupted.")
    except Exception as e:
        print(f"\\nError: {e}")
    
    print("\\nWorkflow Complete!")
    print(f"Final data: {json.dumps({k: v for k, v in state.items() if k in ['name', 'destination', 'purpose']}, indent=2)}")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    run_simple_langgraph()