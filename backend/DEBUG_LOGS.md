# Backend Debug Logs Guide

## Overview
The backend now includes comprehensive debug logging for database connections and startup information. This helps diagnose issues quickly.

---

## Environment Configuration Loading

When the backend starts, it first checks for the `.env` file:

```
============================================================
📦 [Environment Configuration Loading]
============================================================
📁 Current Working Directory: /var/www/indigo-cavern-546.x-cloud.app
🔍 Looking for .env at: /var/www/indigo-cavern-546.x-cloud.app/.env
✅ .env file found!
   Size: 156 bytes
   Last Modified: 2025-10-19T12:34:56.789Z
   Variables loaded: 4
     • MONGODB_URI
     • PORT
     • NODE_ENV
     • JWT_SECRET
============================================================
```

### ✅ .env File Found

```
✅ .env file found!
   Size: 156 bytes
   Last Modified: 2025-10-19T12:34:56.789Z
   Variables loaded: 4
     • MONGODB_URI
     • PORT
     • NODE_ENV
     • JWT_SECRET
```

### ❌ .env File NOT Found

```
❌ .env file NOT found at /var/www/indigo-cavern-546.x-cloud.app/.env
   💡 Found .env.example - copy it to .env
```

**Solution:**
```bash
# Copy example to .env
cp /var/www/indigo-cavern-546.x-cloud.app/.env.example /var/www/indigo-cavern-546.x-cloud.app/.env

# Edit with your values
nano /var/www/indigo-cavern-546.x-cloud.app/.env

# Restart backend
pm2 restart 0 --update-env
```

---

## Startup Debug Information

After .env is loaded, you'll see startup information:

```
============================================================
🚀 [Backend Startup Debug Information]
============================================================
📅 Timestamp: 2025-10-19T12:34:56.789Z
🖥️  Node Version: v20.19.5
📁 Working Directory: /var/www/gentle-garden-502.x-cloud.app
🌍 Environment: production
🔌 Port: 5001
============================================================
```

---

## Database Connection Debug Logs

### ✅ Successful Connection

```
🔍 [DB Connection Debug]
   MONGODB_URI: ✅ Set
   MONGODB_URI Value: mongodb://***:***@localhost:27017/startise-bookclub
   NODE_ENV: production
   PORT: 5001
   JWT_SECRET: ✅ Set
   Current Working Directory: /var/www/gentle-garden-502.x-cloud.app
📡 Attempting to connect to MongoDB...
   URI: mongodb://***:***@localhost:27017/startise-bookclub
✅ MongoDB Connected Successfully!
   Host: localhost
   Port: 27017
   Database: startise-bookclub
   State: Connected
```

### ❌ Connection Failed - MONGODB_URI Not Set

```
❌ [DB Connection Error]
   Error Type: Error
   Error Message: MONGODB_URI environment variable is not defined. Please check your .env file.
   Error Code: N/A
   💡 Hint: MONGODB_URI is not set. Make sure your .env file is loaded
```

**Solution:**
```bash
# Check if .env file exists
cat /var/www/indigo-cavern-546.x-cloud.app/.env

# Restart with --update-env flag
pm2 restart 0 --update-env
```

---

### ❌ Connection Failed - MongoDB Not Running

```
❌ [DB Connection Error]
   Error Type: MongooseError
   Error Message: connect ECONNREFUSED 127.0.0.1:27017
   Error Code: ECONNREFUSED
   💡 Hint: MongoDB server is not running or not accessible at the specified address
   💡 Check if MongoDB is running: sudo systemctl status mongod
```

**Solution:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Restart backend
pm2 restart 0
```

---

### ❌ Connection Failed - Wrong Host/Port

```
❌ [DB Connection Error]
   Error Type: MongooseError
   Error Message: getaddrinfo ENOTFOUND mongodb-server.invalid
   Error Code: ENOTFOUND
   💡 Hint: Cannot resolve MongoDB hostname. Check your MONGODB_URI
```

**Solution:**
```bash
# Update .env with correct MongoDB address
nano /var/www/indigo-cavern-546.x-cloud.app/.env

# Example:
# MONGODB_URI=mongodb://localhost:27017/startise-bookclub

# Restart backend
pm2 restart 0 --update-env
```

---

### ❌ Connection Failed - Authentication Error

```
❌ [DB Connection Error]
   Error Type: MongooseError
   Error Message: authentication failed
   Error Code: 13
   💡 Hint: MongoDB authentication failed. Check username/password in MONGODB_URI
```

**Solution:**
```bash
# Update .env with correct credentials
nano /var/www/indigo-cavern-546.x-cloud.app/.env

# Example with authentication:
# MONGODB_URI=mongodb://username:password@localhost:27017/startise-bookclub

# Restart backend
pm2 restart 0 --update-env
```

---

## Server Startup Success

After successful database connection:

```
============================================================
✅ Server is running on port 5001
📍 Local: http://localhost:5001
📍 API: http://localhost:5001/api
============================================================
```

---

## How to View Logs on VPS

### View Real-time Logs
```bash
pm2 logs
```

### View Specific App Logs
```bash
pm2 logs nodejs-indigo-cavern-546.x-cloud.app
```

### View Last 100 Lines
```bash
pm2 logs --lines 100
```

### View Error Logs Only
```bash
tail -f /home/indigo_cavern_54/.pm2/logs/nodejs-indigo-cavern-546.x-cloud.app-error.log
```

### View Output Logs Only
```bash
tail -f /home/indigo_cavern_54/.pm2/logs/nodejs-indigo-cavern-546.x-cloud.app-out.log
```

---

## Common Issues & Solutions

| Issue | Error Message | Solution |
|-------|---------------|----------|
| .env not loaded | `MONGODB_URI is not defined` | `pm2 restart 0 --update-env` |
| MongoDB not running | `ECONNREFUSED` | `sudo systemctl start mongod` |
| Wrong MongoDB address | `ENOTFOUND` | Check MONGODB_URI in .env |
| Auth failed | `authentication failed` | Check username/password in MONGODB_URI |
| Port already in use | `EADDRINUSE` | Change PORT in .env or kill process on that port |

---

## Environment Variables Checklist

Make sure your `.env` file has:

```bash
# Required
MONGODB_URI=mongodb://localhost:27017/startise-bookclub
PORT=5001

# Recommended
NODE_ENV=production
JWT_SECRET=your-secret-key
```

---

## Testing the Connection

After backend starts successfully:

```bash
# Test API endpoint
curl http://localhost:5001/api/books

# Test with authentication
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bookclub.com","password":"admin123"}'
```

---

## Need Help?

1. Check the debug logs: `pm2 logs`
2. Verify .env file: `cat /var/www/indigo-cavern-546.x-cloud.app/.env`
3. Check MongoDB: `sudo systemctl status mongod`
4. Restart with env update: `pm2 restart 0 --update-env`

