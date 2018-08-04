# handpicks API Guidelines
> developed for the handpicks team

### 📒 Table of Contents
1. [Global Config]( #global-config "Global Config")
2. API Endpoints
	- Users
		- user sign in
		- update user
		- get user by userId
		- user log out
		- delete user
		- add new link
		- get user link by linkId
		- get user links by topicId
		- get user all links
		- delete link
		- user follow/unfollow topic
		- get user posts

### 🌏 [1. Global Config][global-config]
 🔐	For configuration: each API client must have a private name, public name and API key.
All API requests must contain an **Authorization** header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`  |

### 📍 [2. API Endpoints][api-endpoints]
####[Users][users] 

##### • user sign in
⚠️ User authentication is handled with Firebase Auth. If the user signs in for the first time, server creates a new user and logs in. If user already exists in DB, then only logs in.


❗️`Input: `

| Request Type  | Endpoint | Content–Type | Request Body | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `POST`  | `/api/v1/users/`  | `application/json` | `{ user: { username, email, name, lastname, avatar, token } }` | Request body must contain user object with username, email, name, lastname, avatar (string: url address), token (Firebase Auth idToken).



⭕️ `Output:`

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ user: { %userData% } }`  | user exists, successfully logged in  |
| `201`  | `{ user: { %userData% } }`  | new user created, successfully logged in |
| `400`  | `–`  | request body data is insufficient or validation error   |
| `500`  | `–`  | request body is okay, but an error occurred on the server  |


------------

##### • get user by userId
🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |

❗️`Input: `

| Request Type  | Endpoint |
| ------------- | ------------- |
| `GET`  | `/api/v1/users/{userId}`  |


⭕️ `Output:`

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ user: { %userData% } }`  | successful request  |
| `404`  | `–`  | requested user is not found  |
| `400`  | `–`  | requested userId not true  |
| `500`  | `–`  | request true, user exists, but an error occurred on the server  |


[global-config]: # "Global Config"
[api-endpoints]: # "API endpoints"
[users]: # "Users"