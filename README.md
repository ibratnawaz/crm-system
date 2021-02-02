## APIs

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
