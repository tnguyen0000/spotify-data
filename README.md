To run, you will need 2 '.env' files, one in the './backend' and the other in './frontend'.

The backend .env file should contain:
```
PORT=*YOUR BACKEND PORT HERE*
PORT_FRONT=*YOUR FRONTEND PORT HERE*

CLIENT_ID=*SPOTIFY APP CLIENT ID*
SECRET_ID=*SPOTIFY APP SECRET ID*

STATE=*ANY STRING*

MONGO_DB=*NAME OF YOUR MONGODB DB* # This is an optional field
```

The frontend .env file should contain:
```
PORT=*YOUR FRONTEND PORT HERE*
VITE_PORT_BACK=*YOUR BACKEND PORT HERE*
```