# Jeuwei Backend

Backend API for the Jeuwei life gamification application.

## Prerequisites

- Node.js (v16 or later)
- MongoDB (v4.4 or later)
- Clerk account for authentication

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

#### Option 1: Local MongoDB

1. Install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
   - Windows: MongoDB should run as a service after installation
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. Verify MongoDB is running: `mongo` (or `mongosh` for newer versions)

#### Option 2: MongoDB Atlas (Cloud)

1. Create an account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient)
3. Set up database access:
   - Create a database user with password
   - Set network access to allow your IP
4. Get your connection string from the Connect dialog

### 3. Environment Configuration

1. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

2. Update the following values in the `.env` file:
   - `CLERK_SECRET_KEY`: Your Clerk API secret key
   - `MONGODB_URI`: Your MongoDB connection string
     - Local: `mongodb://localhost:27017/jeuwei`
     - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/jeuwei?retryWrites=true&w=majority`

### 4. Run the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Routes

- **Auth**: Handled by Clerk
- **Users**:
  - `GET /api/user/profile`: Get user profile
  - `POST /api/user/init`: Initialize user in database
  - `PUT /api/user/profile`: Update user profile
- **Journal**:
  - `POST /api/journal`: Create journal entry
  - `GET /api/journal`: Get user's journal entries
  - `GET /api/journal/:id`: Get specific journal entry
- **Stats**:
  - `GET /api/stats/exp`: Get user's EXP statistics
  - `GET /api/stats/activities`: Get recent activities
  - `GET /api/stats/history`: Get EXP history

## Database Schema

### User
- `clerkId`: String (from Clerk auth)
- `email`: String
- `username`: String
- `firstName`: String (optional)
- `lastName`: String (optional)
- `totalExp`: Number
- `stats`: Object (financial, habits, knowledge, skills, experiences, network)

### Journal Entry
- `userId`: String (reference to User)
- `content`: String
- `processedContent`: String (optional)
- `date`: Date
- `expGained`: Number
- `activities`: Array of Activities

### Activity
- `action`: String
- `category`: String (financial, habits, knowledge, skills, experiences, network)
- `expValue`: Number
- `date`: Date

### EXP History
- `userId`: String (reference to User)
- `date`: Date
- `totalExp`: Number
- `levelUp`: Boolean
- `newLevel`: Number (optional)
- `activities`: Array of Activities
- `categoryExp`: Object

## Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running: `mongosh` or `mongo`
- Check your connection string format
- Ensure network permissions are set correctly
- For Atlas: Check IP whitelisting

### Clerk Authentication Issues

- Verify your Clerk API key is correct
- Ensure your Clerk application is properly configured
- Check that your frontend is sending the correct authentication headers