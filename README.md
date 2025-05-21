# MatchRight

[Live Demo 🚀](https://ai-resume-checker-eight.vercel.app/)

## 📌 Project Overview

**MatchRight** is an AI-powered platform that helps job seekers align their resumes with job descriptions. It intelligently analyzes both inputs and provides compatibility scores and actionable suggestions, making resumes more tailored and increasing the chances of getting interviews.

## 🔧 Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/matchright.git
   cd matchright
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**

   ```bash
   npm run build
   ```

## 🔑 Authentication Notes

- After signing up, users **must confirm their email** via the verification link sent to their inbox.
- Users **cannot log in** until their email is verified.
- This is handled automatically by Supabase Auth.

## ✨ Features

- ✅ AI-powered resume and job description analysis
- ✅ Compatibility score and feedback suggestions
- ✅ Clean, responsive, and modern UI
- ✅ Email-based authentication with verification
- ✅ Real-time database and secure backend

## 🛠️ Technologies Used

This project is built with:

- **Vite** — Fast build tool
- **TypeScript** — Static typing for JavaScript
- **React** — Frontend library
- **shadcn-ui** — UI components built with Radix UI and Tailwind
- **Tailwind CSS** — Utility-first CSS framework
- **Supabase** — Backend-as-a-Service (auth, DB, API)
- **Vercel** — Deployment platform
