import requests
from datetime import datetime

def test_wikipedia_api():
    date = datetime.now()
    print(f"Testing Wikipedia API for {date.strftime('%B %d, %Y')}")
    
    # Test events
    events_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{date.month}/{date.day}"
    print(f"\nEvents URL: {events_url}")
    
    try:
        events_response = requests.get(events_url)
        print(f"Events Status: {events_response.status_code}")
        
        if events_response.ok:
            events_data = events_response.json()
            events = events_data.get('events', [])
            print(f"Found {len(events)} events")
            
            for i, event in enumerate(events[:3], 1):
                year = event.get('year', 'Unknown')
                text = event.get('text', 'No description')
                print(f"{i}. {year}: {text}")
        else:
            print("Failed to get events")
    except Exception as e:
        print(f"Events error: {e}")
    
    # Test births
    births_url = f"https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/{date.month}/{date.day}"
    print(f"\nBirths URL: {births_url}")
    
    try:
        births_response = requests.get(births_url)
        print(f"Births Status: {births_response.status_code}")
        
        if births_response.ok:
            births_data = births_response.json()
            births = births_data.get('births', [])
            print(f"Found {len(births)} births")
            
            for i, birth in enumerate(births[:3], 1):
                year = birth.get('year', 'Unknown')
                text = birth.get('text', 'No description')
                print(f"{i}. {year}: {text}")
        else:
            print("Failed to get births")
    except Exception as e:
        print(f"Births error: {e}")

if __name__ == "__main__":
    test_wikipedia_api()