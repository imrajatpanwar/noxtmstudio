# 🚀 Noxtm Studio - Full-Stack Application

A modern full-stack web application built with React, Node.js, Express, and MongoDB, deployed on Contabo VPS.

## 🏗️ Architecture

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Server**: Contabo VPS (185.137.122.61)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx

## 📁 Project Structure

```
noxtmstudio/
├── backend/           # Node.js/Express API server
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── frontend/         # React application
│   ├── src/         # React source code
│   ├── public/      # Static assets
│   └── package.json # Frontend dependencies
├── package.json      # Root package.json
└── README.md        # This file
```

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:3000
   - Frontend: http://localhost:3001

3. **Build for production:**
   ```bash
   npm run build
   ```

### Production Deployment

The application is automatically deployed on the Contabo VPS at `185.137.122.61`.

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `GET /api/version` - API version information
- `GET /*` - Serves React frontend

## 🔧 Deployment Commands

### On VPS (185.137.122.61):

```bash
# SSH to server
ssh root@185.137.122.61

# Navigate to project
cd /var/www/noxtmstudio

# Deploy updates
./deploy.sh
```

### Deployment Script (`deploy.sh`):

```bash
#!/bin/bash
cd /var/www/noxtmstudio

# Pull latest changes
git pull origin main

# Install backend dependencies
npm install

# Navigate to frontend and build
cd frontend
npm install
npm run build
cd ..

# Restart backend
pm2 restart noxtmstudio-backend

echo "Deployment completed!"
```

## 📊 Monitoring

### Check Services Status:
```bash
# PM2 processes
pm2 status

# Nginx status
systemctl status nginx

# MongoDB status
systemctl status mongod

# View logs
pm2 logs noxtmstudio-backend
```

## 🔒 Security

- Firewall configured (SSH, HTTP, HTTPS)
- Helmet.js for security headers
- CORS enabled
- Environment variables for sensitive data

## 🚀 Features

- ✅ **Full-Stack Architecture**: React + Node.js + MongoDB
- ✅ **Production Ready**: Built and optimized for production
- ✅ **Auto-Deployment**: Git-based deployment workflow
- ✅ **Process Management**: PM2 for reliable backend operation
- ✅ **Reverse Proxy**: Nginx for efficient request routing
- ✅ **Database**: MongoDB with connection pooling
- ✅ **Security**: Helmet.js, CORS, and security best practices
- ✅ **Monitoring**: Built-in health checks and status endpoints

## 🌟 Tech Stack

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Build Tools**: Vite, npm scripts
- **Deployment**: PM2, Nginx, Git
- **Server**: Ubuntu 22.04 LTS on Contabo VPS

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/noxtmstudio
NODE_ENV=production
```

## 🔄 Update Workflow

1. **Code locally** on your machine
2. **Push to GitHub**: `git push origin main`
3. **Deploy on VPS**: SSH and run `./deploy.sh`

## 📞 Support

For deployment issues or questions, check:
- PM2 logs: `pm2 logs noxtmstudio-backend`
- Nginx logs: `tail -f /var/log/nginx/error.log`
- MongoDB logs: `tail -f /var/log/mongodb/mongod.log`

---

**Deployed on**: Contabo VPS (185.137.122.61)  
**Last Updated**: August 23, 2025  
**Status**: ✅ Production Ready 