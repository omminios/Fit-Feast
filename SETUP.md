# FitFeast Setup Guide

This guide will walk you through setting up FitFeast locally and preparing it for deployment.

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Git (for version control)

### 2. Local Development Setup

```bash
# Navigate to the project directory
cd temp-fit-feast

# Install dependencies
npm install

# Create environment file
# Copy the example below and fill in your Supabase credentials
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**To get these values:**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings → API
3. Copy the "Project URL" and "anon public" key

### 4. Database Setup

1. **In your Supabase dashboard**, go to the SQL Editor
2. **Copy the entire contents** of `supabase-schema.sql`
3. **Paste and run** the SQL script
4. This will create all tables and populate sample data

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application!

## Supabase Configuration

### Authentication Setup

1. **Enable Email Auth**:
   - Go to Authentication → Settings
   - Enable "Enable email confirmations" (optional)
   - Add your domain to "Site URL": `http://localhost:3000`

2. **Google OAuth (Optional)**:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### Row Level Security

The database schema includes RLS policies that:
- Users can only see their own pantry items and saved recipes
- Public read access to ingredients and recipes
- Secure user data isolation

## Testing the Application

### 1. Create an Account
- Go to the landing page
- Click "Sign Up"
- Create an account with email/password or Google

### 2. Add Ingredients to Pantry
- After signing in, you'll be redirected to the dashboard
- Go to "Pantry Power-Up" tab
- Add ingredients like "chicken breast", "broccoli", "oats"

### 3. Discover Recipes
- Go to "Gainz-Fuel Recipes" tab
- See recipes that match your pantry ingredients
- Save recipes you like

### 4. View Saved Recipes
- Go to "My Stacked Recipes" tab
- See all your saved recipes

## Deployment Preparation

### For Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial FitFeast setup"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### For AWS Deployment

1. **Install AWS CLI and Docker**:
   - Install [AWS CLI](https://aws.amazon.com/cli/)
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Configure AWS**:
   ```bash
   aws configure
   ```

3. **Set Environment Variables**:
   ```powershell
   # Windows PowerShell
   $env:NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
   ```

4. **Run Deployment Script**:
   ```powershell
   .\deploy-aws.ps1
   ```

## Troubleshooting

### Common Issues

1. **"Supabase client not initialized"**:
   - Check your environment variables are set correctly
   - Restart your development server

2. **"Database connection failed"**:
   - Verify your Supabase project is active
   - Check your API keys are correct
   - Ensure the database schema is set up

3. **"Authentication not working"**:
   - Check Supabase Auth settings
   - Verify Site URL is configured correctly
   - Clear browser cache and cookies

4. **"Recipes not showing"**:
   - Make sure you've added ingredients to your pantry
   - Check that the database has sample recipes
   - Verify the recipe matching algorithm

### Getting Help

- Check the [README.md](README.md) for detailed documentation
- Review the [Supabase documentation](https://supabase.com/docs)
- Open an issue in the repository for bugs

## Next Steps

After setting up FitFeast locally:

1. **Customize the UI**: Modify colors, fonts, and layout in the components
2. **Add More Recipes**: Insert additional recipes into the database
3. **Enhance Features**: Add recipe ratings, meal planning, etc.
4. **Deploy**: Choose your preferred hosting platform
5. **Monitor**: Set up analytics and error tracking

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Regularly update dependencies
- Monitor Supabase usage and costs
- Enable HTTPS in production

---

**Happy coding! 🚀**

Your FitFeast application is now ready to help users fuel their gains while reducing food waste! 