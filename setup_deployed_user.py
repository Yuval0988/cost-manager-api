import requests

def create_test_user():
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
        if response.status_code == 201:
            print("Test user created successfully!")
        else:
            print("Failed to create test user")
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    print("Creating test user on deployed server...")
    create_test_user()
