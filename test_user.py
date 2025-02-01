import requests

def create_test_user():
    print("Creating test user...")
    url = "https://cost-manager-api.onrender.com/api/users"
    
    user_data = {
        "_id": "123123",
        "first_name": "Test",
        "last_name": "User",
        "birthday": "1990-01-01",
        "marital_status": "single"
    }
    
    try:
        response = requests.post(url, json=user_data)
        print("Status Code:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Error:", str(e))

def get_user_details():
    print("\nGetting user details...")
    url = "https://cost-manager-api.onrender.com/api/users/123123"
    
    try:
        response = requests.get(url)
        print("Status Code:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    print("1. Creating user")
    create_test_user()
    print("\n2. Getting user details")
    get_user_details()
