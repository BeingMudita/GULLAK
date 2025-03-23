# 🏺 GULLAK - Your Personal Memory Vault 🏺

GULLAK is a MERN (MongoDB, Express, React, Node.js) web application that allows users to store and cherish their memories. Users can add, update, and delete memories, upload photos, and search for memories by a specific date or date range.

## ✨ Features

✅ **User Authentication**: Sign up and login securely.  
📸 **Story Creation**: Add and save your precious memories with a featured image.  
📝 **Story Editing**: Modify your existing stories anytime.  
🔍 **Story Searching & Filtering**: Find memories by specific dates or date ranges.  
📌 **Pin Favorite Stories**: Keep your cherished memories at the top.  
🗑 **Delete Story**: Remove any memory you no longer need.  

## 🚀 Installation

### Prerequisites
- 📌 Node.js
- 📌 MongoDB
- 📌 npm or yarn

### Steps to Run Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/beingmudita/gullak.git
   cd gullak
   ```

2. Install dependencies for both backend and frontend:
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables (`.env` file in the backend directory):
   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```sh
   cd backend
   npm start
   ```

5. Start the frontend server:
   ```sh
   cd frontend
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack
- 🎨 **Frontend**: React.js
- ⚙ **Backend**: Node.js, Express.js
- 🗄 **Database**: MongoDB
- 🔐 **Authentication**: JWT (JSON Web Tokens)
- ☁ **Storage**: Cloudinary (for image uploads, optional)

## 🤝 Contribution
We welcome contributions! Feel free to fork the repository and submit a pull request for any improvements.

