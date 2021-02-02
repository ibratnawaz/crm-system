# CRM SYSTEM API

## Getting Started

```
  Create .env file and add your mongoURI, jwtSecret key and other private credentials
```

```bash
  npm install
  npm run serve # Runs on http://localhost:5000
```

## API Usage & Endpoints

```
+-----------+---------------------------------+-----------------------------------------------+-----------------------------+
| Method    | URI                             | Description     	                      | Middleware     	 	    |
+-----------+---------------------------------+-----------------------------------------------+-----------------------------+
| POST      | /api/users/login                | Login registered & activated user             | 		 	    |
| POST      | /api/users/register             | Register a new user			      | 		 	    |
| GET       | /api/users/logout               | Logout a user  			              | protect, verifyToken	    |
| GET       | /api/users/account/activate/:id | Activate user account	                      |                     	    |
| POST      | /api/users/forgot/password      | Send Email with temporary password to the user|	                     	    |
| GET       | /api/users/profile/me           | View user profile	                      | protect, verifyToken	    |
| PUT       | /api/users/profile/me           | Update user profile	                      | protect, verifyToken        |
| GET       | /api/users/all	              | Get all users		                      | protect, verifyToken, admin |
| GET       | /api/users/:id                  | Delete user by ID	                      | protect, verifyToken, admin |
| PUT       | /api/users/:id                  | Get user by ID		                      | protect, verifyToken, admin |
| DELET     | /api/users/:id                  | Update user by ID	                      | protect, verifyToken, admin |
+-----------+---------------------------------+-----------------------------------------------+-----------------------------+

```
