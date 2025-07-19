# FitFeast - Fuel Your Gains

A smart meal planning web application designed for fitness enthusiasts who want to reduce food waste and cook macro-friendly meals using ingredients they already have.

## Features

- **Pantry Power-Up**: Track your kitchen ingredients and never let food go to waste
- **Gainz-Fuel Recipes**: Discover high-protein, macro-friendly recipes that match your available ingredients
- **My Stacked Recipes**: Save your favorite recipes for quick access and build your personal collection
- **User Authentication**: Secure sign-up and sign-in with email/password or Google OAuth
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, and API)
- **Styling**: Tailwind CSS for utility-first styling
- **Authentication**: Supabase Auth with email/password and Google OAuth

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd temp-fit-feast

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Set Up Database Schema**:
   - In your Supabase dashboard, go to the SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the script to create all tables and sample data

3. **Configure Authentication**:
   - In Supabase dashboard, go to Authentication → Settings
   - Add your domain to the Site URL (for local development: `http://localhost:3000`)
   - Configure Google OAuth if desired (optional)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard page
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── auth/             # Authentication components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
└── lib/                  # Utility libraries
    ├── supabase.ts       # Supabase client configuration
    └── supabase-utils.ts # Supabase utility functions
```

## Database Schema

The application uses the following main tables:

- **users**: User profiles (extends Supabase Auth)
- **ingredients**: Available ingredients (pre-populated)
- **user_pantry_items**: User's current pantry items
- **recipes**: Curated fitness recipes (pre-populated)
- **recipe_ingredients**: Recipe-ingredient relationships
- **saved_recipes**: User's saved recipe collection

## Key Features Implementation

### Authentication
- Email/password authentication
- Google OAuth integration
- Session management with React Context
- Protected routes

### Pantry Management
- Add ingredients to personal pantry
- Mark ingredients as used
- View current available ingredients

### Recipe Discovery
- Algorithm to match user's pantry with available recipes
- Display macro information (protein, carbs, fats)
- Recipe saving functionality

### User Experience
- Responsive design for mobile and desktop
- Loading states and error handling
- Intuitive navigation with tabs

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Environment Variables**:
   - Add your Supabase environment variables in Vercel dashboard
   - Update Supabase Site URL to your production domain

### AWS Deployment

For AWS deployment, you can use:

1. **AWS Amplify**:
   - Connect your GitHub repository
   - Configure build settings
   - Add environment variables

2. **AWS Elastic Beanstalk**:
   - Build the application: `npm run build`
   - Deploy the `.next` folder
   - Configure environment variables

3. **Docker + ECS**:
   - Create a Dockerfile
   - Build and push to ECR
   - Deploy to ECS

## Environment Variables for Production

Make sure to set these in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Security Considerations

- Row Level Security (RLS) enabled on Supabase tables
- User data isolation
- Environment variables properly configured
- HTTPS enforced in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**FitFeast** - Transform your kitchen into a gains factory! 💪
