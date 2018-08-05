# handpicks API Guidelines
> developed for the handpicks team

### 📒 Table of Contents
1. [Global Config](#global-config)
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

### 🌏 1. Global Config

🔐	For configuration: each API client must have a private name, public name and API key.
All API requests must contain an **Authorization** header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`  |

### 📍 [2. API Endpoints][api-endpoints]

#### Users

#### • user sign in

⚠️ User authentication is handled with Firebase Auth. If the user signs in for the first time, server creates a new user and logs in. If user already exists in DB, then only logs in.


❗️**Input:** 

| Request Type  | Endpoint | Content–Type | Request Body | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `POST`  | `/api/v1/users/`  | `application/json` | `{ user: { username, email, name, lastname, avatar, token } }` | Request body must contain user object with username, email, name, lastname, avatar (string: url address), token (Firebase Auth idToken).



⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ user: { %userData% } }`  | user exists, successfully logged in  |
| `201`  | `{ user: { %userData% } }`  | new user created, successfully logged in |
| `400`  | `–`  | request body data is insufficient or validation error   |
| `500`  | `–`  | request body is okay, but an error occurred on the server  |


------------

#### • update user

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |


❗️**Input:** 

| Request Type  | Endpoint | Content–Type | Request Body | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `PUT`  | `/api/v1/users/{userId}`  | `application/json` | `{ user: { username, name, lastname, avatar } }` | Request body must contain user object. Only username, name, lastname, avatar (string: url address) values can be update. Client just need to provide the value want to change.



⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ user: { %userData% } }`  | user exists, successfully logged in  |
| `201`  | `{ user: { %userData% } }`  | new user created, successfully logged in |
| `400`  | `–`  | request body data is insufficient or validation error   |
| `500`  | `–`  | request body is okay, but an error occurred on the server  |


------------

#### • get user by userId

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |

❗️**Input:** 

| Request Type  | Endpoint |
| ------------- | ------------- |
| `GET`  | `/api/v1/users/{userId}`  |


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ user: { %userData% } }`  | successful request  |
| `400`  | `–`  | requested userId is not true  |
| `404`  | `–`  | requested user is not found  |
| `500`  | `–`  | request true, user exists, but an error occurred on the server  |

--------

#### • user log out
🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |


❗️**Input:** 

| Request Type  | Endpoint | Content–Type | Request Body | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `POST`  | `/api/v1/users/{userId}/logout`  | `application/json` | `{ user: { token } }` | Request body must contain user object with token (Firebase Auth idToken).



⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `204`  | `-`  | successfully logged out  |
| `400`  | `–`  | token does not match with stored token   |
| `404`  | `–`  | requested user is not found  |
| `422`  | `–`  | invalid token, token validation error  |

--------

#### • delete user

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |


❗️**Input:** 

| Request Type  | Endpoint | Content–Type | Request Body | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `DELETE`  | `/api/v1/users/{userId}`  | `application/json` | `-` | -


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `204`  | `-`  | successfully deleted  |
| `404`  | `–`  | requested user is not found   |
| `500`  | `–`  | request true, user exists, but an error occurred on the server  |

--------

#### • add new link

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |


❗️**Input:** 

| Request Type  | Endpoint | Content–Type | Request Body | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `POST`  | `/api/v1/users/{userId}/links`  | `application/json` | `{ link: { url, topicId } }` | Request body must contain link object with url and topicId values.



⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `201`  | `{ link: { %linkData% } }`  | successfully added  |
| `400`  | `–`  | request body data is insufficient or validation error   |
| `404`  | `–`  | requested user or link topic is not found  |
| `500`  | `–`  | request true, user and link topic exist, but an error occurred on the server  |

------------

#### • get user link by linkId

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |

❗️**Input:** 

| Request Type  | Endpoint |
| ------------- | ------------- |
| `GET`  | `/api/v1/users/{userId}/links/{linkId}`  |


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ link: { %linkData% } }`  | successful request  |
| `400`  | `–`  | requested userId is not true  |
| `404`  | `–`  | requested user or link is not found  |
| `500`  | `–`  | request true, user and link exist, but an error occurred on the server  |

------------

#### • get user links by topicId

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |

❗️**Input:** 

| Request Type  | Endpoint |
| ------------- | ------------- |
| `GET`  | `/api/v1/users/{userId}/links/topics/:topicId`  |


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ links: [ {%linkData%} ] }`  | successful request  |
| `400`  | `–`  | requested userId or topicId is not true  |
| `404`  | `–`  | requested user, topic or link is not found  |
| `500`  | `–`  | request true, user, topic and link exist, but an error occurred on the server  |

------------

#### • get user all links

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |

❗️**Input:** 

| Request Type  | Endpoint |
| ------------- | ------------- |
| `GET`  | `/api/v1/users/{userId}/links`  |


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ links: [ {%linkData%} ] }`  | successful request  |
| `400`  | `–`  | requested userId is not true  |
| `404`  | `–`  | requested user or link is not found  |
| `500`  | `–`  | request true, user and link exist, but an error occurred on the server  |

--------

#### • delete link

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |


❗️**Input:** 

| Request Type  | Endpoint | Content–Type | Request Body | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `DELETE`  | `/api/v1/users/{userId}/links/{linkId}`  | `application/json` | `-` | -


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `204`  | `-`  | successfully deleted  |
| `400`  | `–`  | requested userId or linkId is not true  |
| `404`  | `–`  | requested user or link is not found   |
| `500`  | `–`  | request true, user exists, but an error occurred on the server  |

------------

#### • user follow/unfollow topic

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |

❗️**Input:** 

| Request Type  | Endpoint |
| ------------- | ------------- |
| `GET`  | `/api/v1/users/{userId}/topics/:topicId`  |


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ topicFollow: { %topicData% }  }`  | successful request, followed |
| `204`  | `-`  | successful request, unfollowed |
| `400`  | `–`  | requested userId or topicId is not true  |
| `404`  | `–`  | requested user or topic is not found  |
| `500`  | `–`  | request true, user and topic exist, but an error occurred on the server  |

------------

#### • get user posts

🔑 Requires Authentication: user must be authenticated with Firebase. Client must assign Firebase idToken in the Authorization header.

**Headers**

| Key  | Value |
| ------------- | ------------- |
| Authorization  | name=`{publicName}`, apiKey=`{apiKey}`, token=`{idToken}`  |

❗️**Input:** 

| Request Type  | Endpoint |
| ------------- | ------------- |
| `GET`  | `/api/v1/users/{userId}/posts`  |


⭕️ **Output:**

| Status Code  | Body | Description |
| ------------- | ------------- | ------------- |
| `200`  | `{ posts: [ { %postData% } ] }`  | successful request, return posts in user-followed topics  |
| `400`  | `–`  | requested userId is not true  |
| `404`  | `–`  | requested user, followed topic or posts is not found |
| `500`  | `–`  | request true, user and post exist, but an error occurred on the server  |
