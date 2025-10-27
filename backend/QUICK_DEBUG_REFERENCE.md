# Quick Debug Reference Card

## 🚀 What Changed?

Added comprehensive debug logging to help diagnose database connection issues:

1. **Startup Debug Info** - Shows Node version, working directory, environment, port
2. **DB Connection Debug** - Shows if MONGODB_URI is set and connection details
3. **Detailed Error Messages** - Specific hints for common connection problems

---

## 📋 What You'll See on Startup

### Example 1: Successful Startup ✅

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

============================================================
🚀 [Backend Startup Debug Information]
============================================================
📅 Timestamp: 2025-10-19T12:34:56.789Z
🖥️  Node Version: v20.19.5
📁 Working Directory: /var/www/indigo-cavern-546.x-cloud.app
🌍 Environment: production
🔌 Port: 5001
============================================================

🔍 [DB Connection Debug]
   MONGODB_URI: ✅ Set
   MONGODB_URI Value: mongodb://***:***@localhost:27017/startise-bookclub
   NODE_ENV: production
   PORT: 5001
   JWT_SECRET: ✅ Set
   Current Working Directory: /var/www/indigo-cavern-546.x-cloud.app
📡 Attempting to connect to MongoDB...
   URI: mongodb://***:***@localhost:27017/startise-bookclub
✅ MongoDB Connected Successfully!
   Host: localhost
   Port: 27017
   Database: startise-bookclub
   State: Connected

============================================================
✅ Server is running on port 5001
📍 Local: http://localhost:5001
📍 API: http://localhost:5001/api
============================================================
```

### Example 2: .env File Not Found ❌

```
============================================================
📦 [Environment Configuration Loading]
============================================================
📁 Current Working Directory: /var/www/indigo-cavern-546.x-cloud.app
🔍 Looking for .env at: /var/www/indigo-cavern-546.x-cloud.app/.env
❌ .env file NOT found at /var/www/indigo-cavern-546.x-cloud.app/.env
   💡 Found .env.example - copy it to .env
============================================================
```

**Fix:**
```bash
# Copy example to .env
cp /var/www/indigo-cavern-546.x-cloud.app/.env.example /var/www/indigo-cavern-546.x-cloud.app/.env

# Edit with your values
nano /var/www/indigo-cavern-546.x-cloud.app/.env

# Restart backend
pm2 restart 0 --update-env
```

---

### Example 3: MONGODB_URI Not Set ❌

```
❌ [DB Connection Error]
   Error Type: Error
   Error Message: MONGODB_URI environment variable is not defined. Please check your .env file.
   Error Code: N/A
   💡 Hint: MONGODB_URI is not set. Make sure your .env file is loaded
```

**Fix:**
```bash
pm2 restart 0 --update-env
```

---

### Example 3: MongoDB Not Running ❌

```
❌ [DB Connection Error]
   Error Type: MongooseError
   Error Message: connect ECONNREFUSED 127.0.0.1:27017
   Error Code: ECONNREFUSED
   💡 Hint: MongoDB server is not running or not accessible at the specified address
   💡 Check if MongoDB is running: sudo systemctl status mongod
```

**Fix:**
```bash
sudo systemctl start mongod
pm2 restart 0
```

---

## 🔧 Quick Troubleshooting Commands

| Problem | Command |
|---------|---------|
| View logs | `pm2 logs` |
| Check .env | `cat /var/www/indigo-cavern-546.x-cloud.app/.env` |
| Check MongoDB | `sudo systemctl status mongod` |
| Start MongoDB | `sudo systemctl start mongod` |
| Restart backend | `pm2 restart 0` |
| Restart with env | `pm2 restart 0 --update-env` |
| View error logs | `tail -f /home/indigo_cavern_54/.pm2/logs/nodejs-indigo-cavern-546.x-cloud.app-error.log` |

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] `.env` file exists with `MONGODB_URI`
- [ ] MongoDB is running: `sudo systemctl status mongod`
- [ ] Backend starts without errors: `npm start`
- [ ] API responds: `curl http://localhost:5001/api/books`
- [ ] Logs show "✅ MongoDB Connected Successfully!"

---

## 📝 Files Modified

1. **backend/src/config/db.js** - Added detailed DB connection logging
2. **backend/src/index.js** - Added startup debug information
3. **backend/DEBUG_LOGS.md** - Full debug guide (this file)
4. **backend/QUICK_DEBUG_REFERENCE.md** - Quick reference (this file)

---

## 🎯 Next Steps

1. Push changes to Git
2. Deploy to VPS
3. Restart backend with: `pm2 restart 0 --update-env`
4. Check logs: `pm2 logs`
5. Verify API works: `curl https://indigo-cavern-546.x-cloud.app/api/books`

---

## 💡 Pro Tips

- Always use `--update-env` when restarting after changing `.env`
- Check logs first when something doesn't work
- MongoDB must be running before backend starts
- MONGODB_URI must be set in `.env` file
- Use `pm2 logs --lines 100` to see more history

---

For detailed information, see: `backend/DEBUG_LOGS.md`

