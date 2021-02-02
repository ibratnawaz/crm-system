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
+-----------+---------------------------------+-----------------------------------------------+----------------------+
| Method    | URI                             | Description     	                      | Middleware           |
+-----------+---------------------------------+-----------------------------------------------+----------------------+
| POST      | /api/users/login                | Login registered & activated user             | 		     |
| POST      | /api/users/register             | Register a new user			      | 		     |
| GET       | /api/users/logout               | Logout a user  			              | protect, verifyToken |
| GET       | /api/users/account/activate/:id | Activate user account	                      | 	 	     |
+-----------+---------------------------------+-----------------------------------------------+----------------------+

```
