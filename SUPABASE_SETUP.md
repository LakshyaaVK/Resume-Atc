# Supabase Integration Setup Guide

## 🚀 Quick Start

Your AI Resume Screener now has full Supabase authentication and database integration! Follow these steps to get it running:

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `the-chosen-one-ai`
   - **Database Password**: (choose a strong password)
   - **Region**: (select closest to your users)

## 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root:
```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

## 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase/schema.sql`
3. Click **Run** to execute the SQL

This will create:
- `user_profiles` table for user information
- `analysis_results` table for storing analysis data
- Row Level Security (RLS) policies
- Automatic triggers for timestamps

## 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Enable **Email** authentication
3. Optionally enable **Google** OAuth:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Add your Google OAuth credentials

## 6. Test the Integration

1. Start your development server:
```bash
npm run dev
```


2. Open your browser and navigate to your app
3. Click the **Sign In** button in the header
4. Create an account or sign in
5. Run an analysis - it will be automatically saved to your database!

## 🎯 Features Added

### Authentication
- ✅ **Sign Up/Sign In** with email and password
- ✅ **Google OAuth** integration
- ✅ **User Profile** management
- ✅ **Secure session** handling

### Database Integration
- ✅ **Automatic data persistence** for analysis results
- ✅ **User-specific history** storage
- ✅ **Cross-device synchronization**
- ✅ **Data security** with Row Level Security

### UI Enhancements
- ✅ **Authentication modals** with beautiful design
- ✅ **User profile** management interface
- ✅ **Header integration** with auth buttons
- ✅ **Responsive design** for all screen sizes

## 🔧 Database Schema

### User Profiles Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- full_name (TEXT)
- avatar_url (TEXT)
- company (TEXT)
- role (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Analysis Results Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- job_description (TEXT)
- resume_text (TEXT)
- overall_score (INTEGER)
- summary (TEXT)
- strengths (TEXT[])
- weaknesses (TEXT[])
- skills_analysis (JSONB)
- experience_analysis (JSONB)
- education_analysis (JSONB)
- weights (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🛡️ Security Features

- **Row Level Security (RLS)** ensures users can only access their own data
- **JWT-based authentication** for secure API calls
- **Automatic session management** with refresh tokens
- **Secure password handling** with Supabase Auth

## 📱 User Experience

- **Seamless authentication** with beautiful modals
- **Persistent data** across devices and sessions
- **Profile management** with editable user information
- **Automatic data sync** when switching devices

## 🚨 Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Make sure your `.env.local` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **Database connection errors**
   - Verify your Supabase URL and anon key are correct
   - Check that your database schema was created successfully

3. **Authentication not working**
   - Ensure your Supabase project is set up correctly
   - Check that email authentication is enabled in Supabase dashboard

4. **Data not saving**
   - Verify RLS policies are set up correctly
   - Check browser console for any error messages

## 🎉 You're All Set!

Your AI Resume Screener now has enterprise-grade authentication and data persistence! Users can:

- Sign up and sign in securely
- Save their analysis results in the cloud
- Access their data from any device
- Manage their profile information
- Enjoy a seamless, professional experience

The app will work with or without authentication - unauthenticated users can still use the app with local storage, while authenticated users get the full cloud experience!
