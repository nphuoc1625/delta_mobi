# Database Setup Guide

This guide explains how to use different databases with the same MongoDB connection string in your DeltaMobi project.

## 🏗️ **Database Architecture**

### **Environment-Based Databases**
```
MongoDB Cluster/Server
├── delta_mobi_dev      (Development)
├── delta_mobi_staging  (Staging)
├── delta_mobi_prod     (Production)
└── delta_mobi_test     (Testing)
```

## 🔧 **Configuration**

### **Environment Variables**

#### **Base Connection String**
```bash
# Same connection string for all environments
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
```

#### **Database Name by Environment**
```bash
# Development
MONGODB_DB_NAME=delta_mobi_dev

# Staging  
MONGODB_DB_NAME=delta_mobi_staging

# Production
MONGODB_DB_NAME=delta_mobi_prod

# Testing
MONGODB_DB_NAME=delta_mobi_test
```

## 📁 **Environment Files**

### **Development (.env.development)**
```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=delta_mobi_dev
```

### **Staging (.env.staging)**
```bash
NODE_ENV=staging
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB_NAME=delta_mobi_staging
```

### **Production (.env.production)**
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB_NAME=delta_mobi_prod
```

## 🚀 **Usage Examples**

### **1. Development Environment**
```bash
# Start development server
npm run dev
# Connects to: delta_mobi_dev
```

### **2. Staging Environment**
```bash
# Start staging server
npm run staging
# Connects to: delta_mobi_staging
```

### **3. Production Environment**
```bash
# Start production server
npm run production
# Connects to: delta_mobi_prod
```

## 🔄 **Connection String Building**

### **How It Works**
```javascript
// Base URI (without database name)
const baseUri = "mongodb+srv://username:password@cluster.mongodb.net";

// Database name
const dbName = "delta_mobi_dev";

// Final connection string
const connectionString = `${baseUri}/${dbName}`;
// Result: mongodb+srv://username:password@cluster.mongodb.net/delta_mobi_dev
```

### **Code Implementation**
```typescript
import { getMongoDBConfig, buildConnectionString } from "@/infrac/mongoose-utils";

const config = getMongoDBConfig();
const connectionString = buildConnectionString(config.uri, config.name);
```

## 📊 **Database Collections**

Each database contains the same collections:

### **Standard Collections**
```
delta_mobi_dev/
├── categories
├── group_categories
├── products
├── users
└── orders

delta_mobi_staging/
├── categories
├── group_categories
├── products
├── users
└── orders

delta_mobi_prod/
├── categories
├── group_categories
├── products
├── users
└── orders
```

## 🛠️ **Setup Instructions**

### **1. Create Environment Files**
```bash
# Copy example files
cp env.development.example .env.development
cp env.staging.example .env.staging
cp env.production.example .env.production
```

### **2. Update Connection Strings**
```bash
# Edit each .env file with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
```

### **3. Create Databases**
```javascript
// Connect to MongoDB and create databases
use delta_mobi_dev
use delta_mobi_staging
use delta_mobi_prod
use delta_mobi_test
```

### **4. Run Migrations (if needed)**
```bash
# Development
npm run migrate:dev

# Staging
npm run migrate:staging

# Production
npm run migrate:prod
```

## 🔍 **Verification**

### **Check Current Database**
```javascript
// In your application logs
console.log(`📊 [MONGODB] Environment: ${config.environment}`);
console.log(`📊 [MONGODB] Database: ${config.name}`);
```

### **MongoDB Shell**
```bash
# Connect to specific database
mongosh "mongodb+srv://cluster.mongodb.net/delta_mobi_dev"

# List databases
show dbs

# Switch database
use delta_mobi_staging
```

## 🚨 **Best Practices**

### **1. Environment Isolation**
- ✅ Never use production data in development
- ✅ Use separate databases for each environment
- ✅ Use different user credentials per environment

### **2. Security**
- ✅ Use environment variables for sensitive data
- ✅ Never commit .env files to version control
- ✅ Use read-only users for non-production environments

### **3. Naming Conventions**
- ✅ Use consistent database naming
- ✅ Include environment in database name
- ✅ Use lowercase with underscores

### **4. Connection Management**
- ✅ Use connection pooling
- ✅ Implement proper error handling
- ✅ Monitor connection health

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Connection Refused**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

#### **2. Authentication Failed**
```bash
# Verify credentials
mongosh "mongodb+srv://username:password@cluster.mongodb.net"
```

#### **3. Database Not Found**
```bash
# Create database if it doesn't exist
use delta_mobi_dev
db.createCollection("categories")
```

#### **4. Environment Variables Not Loading**
```bash
# Check environment file
cat .env.development

# Verify NODE_ENV
echo $NODE_ENV
```

This setup allows you to use the same MongoDB cluster/server with different databases for each environment, Sir! 