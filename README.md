<h1 align="center">🌟 QuickBlog: AI-Enhanced Full-Stack Blogging Platform 🌟</h1>

<p align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/Spring%20Boot-darkgreen?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/React.js-blue?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/mongoDB-red?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/tailwind%20CSS-purple?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/jwt-orange?style=for-the-badge">
  <img alt="Static Badge" src="https://img.shields.io/badge/Gemini%20API-pink?style=for-the-badge">
</p>

## Table of contents

1. [Descripiton](#description)
2. [Live](#live)
3. [How to run?](#how-to-run)

## Description
- Developed a comprehensive full-stack blogging platform featuring both a public blog and a secure administrator panel, significantly enhancing content creation and user interaction. Leveraged Google Gemini API for advanced AI capabilities.
-	Implemented a feature for administrators to generate new blog post using AI and also to provide concise summaries of blog post content.
-	Built a secure backend using Spring Boot, implemented robust user registration and login with JSON Web Tokens (JWT) for stateless session management and role-based access control.
-	Enabled authorized users to create, view, publish, and delete blog posts and manage associated comments.
-	Integrated with MongoDB database for efficient and reliable data storage.
-	Designed a responsive user interface using React and Tailwind CSS for a seamless user experience.

## Live

🌐 [Quickblog](https://quickblog-ai-enhanced.netlify.app)

## How to run?

### Step 1: Clone the Repository

2. Clone the repository to your local machine.

```sh
git clone https://github.com/<your-username>/QuickBlog-AI-Enhanced-Full-Stack-Blogging-Platform
```

### Step 2: Setting up database configurations

- Configure the following credentials in the [`application.yml`](https://github.com/Shashank-TS/QuickBlog-AI-Enhanced-Full-Stack-Blogging-Platform/blob/main/quickblog/src/main/resources/application.yml) file.

```properties
spring.application.name=quickblog
spring.data.mongodb.uri=${DB_URL}
spring.data.mongodb.repositories.type=auto

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
frontend.url=${FRONTEND_URL}
gemini.api.uri=${GEMINI_API_URL}
gemini.api.key=${GEMINI_API_KEY}
email.blog.link=${EMAIL_BLOG_LINK}
email=${GMAIL_ADDRESS}

spring.mail.username=${GMAIL_ADDRESS}
spring.mail.password=${GMAIL_APP_PASSWORD}
```

### Step 3: Run the backend.

- Run the backend application. It will automatically create the required tables.

### Step 4: Run the frontend

1. Navigate to [client direcory](https://github.com/Shashank-TS/QuickBlog-AI-Enhanced-Full-Stack-Blogging-Platform/tree/main/client).
```
cd ./client
```

2. Install dependencies.
```
npm install
```

3. Run the app.
```
npm run dev
```

-Access the application at [`http://localhost:5173/`](http://localhost:5173/).
-To get started create a new account.
