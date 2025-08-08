"""
🧪 Authentication Test Script
Testing the login system because even fake therapy needs quality assurance.

"Testing authentication faster than we test your patience!"
"""

import requests
import json


def test_auth_endpoints():
    """Test authentication endpoints"""
    base_url = "http://localhost:5000/api/auth"
    
    print("🤖🪞 Testing Mirror Mirror Authentication System")
    print("=" * 50)
    
    # Test data
    test_user = {
        "username": "test_user",
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        # Test registration
        print("1. Testing user registration...")
        response = requests.post(f"{base_url}/register", json=test_user)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            token = response.json()['data']['token']
            print(f"✅ Registration successful! Token: {token[:50]}...")
        else:
            print("❌ Registration failed!")
            return
        
        print("\n" + "-" * 50)
        
        # Test login
        print("2. Testing user login...")
        login_data = {
            "username": test_user["username"],
            "password": test_user["password"]
        }
        
        response = requests.post(f"{base_url}/login", json=login_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            token = response.json()['data']['token']
            print(f"✅ Login successful! Token: {token[:50]}...")
        else:
            print("❌ Login failed!")
            return
        
        print("\n" + "-" * 50)
        
        # Test token verification
        print("3. Testing token verification...")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{base_url}/verify", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Token verification successful!")
        else:
            print("❌ Token verification failed!")
        
        print("\n" + "-" * 50)
        
        # Test profile access
        print("4. Testing profile access...")
        response = requests.get(f"{base_url}/profile", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Profile access successful!")
        else:
            print("❌ Profile access failed!")
        
        print("\n" + "-" * 50)
        
        # Test profile update
        print("5. Testing profile update...")
        profile_data = {
            "bio": "Just a test user seeking therapeutic disappointment",
            "preferences": {
                "therapy_style": "brutal_honesty",
                "roast_level": "medium_rare"
            }
        }
        
        response = requests.put(f"{base_url}/profile", json=profile_data, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Profile update successful!")
        else:
            print("❌ Profile update failed!")
        
        print("\n" + "=" * 50)
        print("🎉 Authentication system test completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the Flask app is running!")
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")


if __name__ == "__main__":
    test_auth_endpoints()
