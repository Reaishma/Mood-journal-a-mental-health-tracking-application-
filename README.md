# Mental Health Tracking Application

## Overview

This is a full-stack mental health tracking application built with React, Express.js, and PostgreSQL. The application allows users to track their daily moods, manage habits, write journal entries, and view analytics about their mental health journey. It features a mobile-first design with a clean, modern interface using shadcn/ui components.

## 🌟 Features

### Core Functionality
- **Daily Mood Tracking**: 5-point mood scale with emoji interface (😢 😟 😐 😊 🤗)
- **Habit Management**: Track daily wellness habits with visual progress indicators
- **Journal Entries**: Write thoughts and reflections with mood correlation
- **Analytics Dashboard**: Weekly progress tracking and trend visualization
- **Streak Tracking**: Monitor daily check-in consistency

### User Experience
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Advanced Animations**: Smooth transitions using Framer Motion
- **Real-time Feedback**: Toast notifications for user actions
- **Progressive Web App**: App-like experience in the browser
- **Accessible UI**: Built with shadcn/ui components for accessibility


## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **Animations**: Framer Motion for smooth interactions

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **Development**: Hot reloading with Vite in development mode

### Database Schema
The application uses PostgreSQL with four main tables:
- **moods**: Stores daily mood ratings (1-5 scale) with optional notes
- **habits**: User-defined habits with icons, colors, and targets
- **habit_entries**: Daily habit completion tracking
- **journal_entries**: Text-based journal entries with optional mood associations

## Key Components

### Data Flow
1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express.js routes handle CRUD operations
3. **Storage Layer**: Currently uses in-memory storage (MemStorage class) with interface for future database integration
4. **Database**: Drizzle ORM provides type-safe database operations

### Core Features
- **Mood Tracking**: Daily 1-5 scale mood logging with emoji interface
- **Habit Management**: Create, track, and visualize habit completion
- **Journal Writing**: Rich text journal entries with mood correlation
- **Analytics Dashboard**: Progress tracking and trend visualization
- **Mobile-First Design**: Responsive design optimized for mobile devices

### UI/UX Design
- **Design System**: Custom color palette focused on mental health aesthetics
- **Component Library**: Consistent shadcn/ui components throughout
- **Navigation**: Bottom tab navigation for mobile-first experience
- **Animations**: Smooth transitions and micro-interactions for engagement

## Data Flow

1. **User Interaction**: User interacts with React components
2. **Query Management**: TanStack Query handles API calls and caching
3. **API Requests**: HTTP requests to Express.js REST endpoints
4. **Data Processing**: Express routes validate data using Zod schemas
5. **Storage Operations**: Storage interface abstracts data persistence
6. **Response Handling**: JSON responses with error handling and loading states

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **framer-motion**: Animation library for smooth interactions
- **zod**: Schema validation for API requests

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from build output directory

### Environment Configuration
- **Database**: Uses `DATABASE_URL` environment variable for PostgreSQL connection
- **Development**: Hot reloading with Vite middleware in development mode
- **Production**: Static file serving with Express in production

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Schema**: Shared TypeScript schema definitions between client and server
- **Validation**: Zod schemas ensure data integrity at API boundaries




