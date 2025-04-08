# 📁 Environment Setup

You must create a `.env` file inside the `backend/` directory with the following structure:

```markdown
# 🌐 Server Setup
PORT=8080
JWT_SECRET=

### 🤖 OpenAI API
OPENAI_API_KEY=

### 💳 Stripe API
STRIPE_PRICE_ID_PAID_YEARLY=    
STRIPE_PRICE_ID_PAID_MONTHLY=   
STRIPE_WEBHOOK_SECRET=
CLIENT_URL=
STRIPE_BILLING_PORTAL_RETURN_URL=

### 🗄️ DigitalOcean / MongoDB
# This is set to a MongoDB Community database running locally.
DATABASE_URL=mongodb://localhost:27017 
DB_NAME=

### 📧 Nodemailer
GMAIL_ADDRESS=
GMAIL_APP_PASS=
ADMIN_EMAIL=
```

---

# 📦 Install Dependencies

Run the following command to install required packages:

```
npm install
```

---

# 🚀 Run the Server

To start the server, use:

```
node server.js
```
