# Mental Health Tracking Application

# 🚀 Live Demo 

View live demo https://reaishma.github.io/Mood-journal-a-mental-health-tracking-application-/


![mindwell user](https://github.com/Reaishma/Mood-journal-a-mental-health-tracking-application-/blob/main/Screenshot_20250905-131549_1.jpg)

## Overview

This is a full-stack mental health tracking application built with React, Express.js, and PostgreSQL. The application allows users to track their daily moods, manage habits, write journal entries, and view analytics about their mental health journey. It features a mobile-first design with a clean, modern interface using shadcn/ui components.


## 📊 Features in Detail

### Mood Tracking

![mood tracking](https://github.com/Reaishma/Mood-journal-a-mental-health-tracking-application-/blob/main/Screenshot_20250905-131308_1.jpg)

- 5-point emotional scale with intuitive emoji interface
- Optional text notes for context
- Daily streak tracking for consistency
- Historical mood data visualization

### Habit Management
- Pre-configured wellness habits (Exercise, Meditation, Sunlight, Sleep)
- Custom habit creation with icons and targets
- Daily completion tracking with visual feedback
- Progress analytics and streaks

### Analytics Dashboard

![habbit tracking](https://github.com/Reaishma/Mood-journal-a-mental-health-tracking-application-/blob/main/Screenshot_20250905-131501_1.jpg)

- Weekly check-in percentage with progress rings
- Average mood calculation and trending
- Habit completion rates and insights
- Monthly mood distribution charts

### Journal Integration

![journal](https://github.com/Reaishma/Mood-journal-a-mental-health-tracking-application-/blob/main/Screenshot_20250905-131513_1.jpg)

- Rich text journal entries
- Mood association with entries
- Date and time stamps
- Search and filtering capabilities


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

### Database Schema
```sql
-- Mood tracking (1-5 scale with optional notes)
moods: id, value, note, date, createdAt

-- User-defined habits with customization
habits: id, name, icon, target, color, isActive

-- Daily habit completion tracking
habit_entries: id, habitId, date, completed

-- Journal entries with mood association
journal_entries: id, content, moodValue, date, createdAt
```


##  Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and types
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite integration
├── shared/                 # Shared code
│   └── schema.ts          # Database schema and types
└── mindwell-standalone.html # Standalone demo
```

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindwell-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5000`

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mindwell
NODE_ENV=development
```

## 🚀 Live Demo 

[View live demo](https://reaishma.github.io/Mood-journal-a-mental-health-tracking-application-/)

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

## 📱 Usage

### Daily Check-in
1. Select your current mood using the emoji scale
2. Optionally add notes about your day
3. Click "Save Check-in" to record your entry

### Habit Tracking

![habbit tracking](https://github.com/Reaishma/Mood-journal-a-mental-health-tracking-application-/blob/main/Screenshot_20250905-131443_1.jpg)

1. View your daily habits in the "Today's Habits" section
2. Click the circular button next to each habit to mark as complete
3. Track your progress with visual indicators

### Progress Monitoring
- View weekly check-in percentage in the progress rings
- Monitor your average mood over time
- Track your daily streak for consistency

### Navigation
- **Home**: Daily check-in and habit tracking
- **Trends**: Analytics and progress visualization
- **Journal**: Write and view journal entries
- **Profile**: User settings and preferences

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from build output directory

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
- **Database**: Uses `DATABASE_URL` environment variable for PostgreSQL connection
- **Development**: Hot reloading with Vite middleware in development mode
- **Production**: Static file serving with Express in production

### Environment Setup
- **Frontend**: Built to `dist/public` with Vite
- **Backend**: Compiled to `dist/index.js` with ESBuild
- **Database**: PostgreSQL with Drizzle migrations

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Schema**: Shared TypeScript schema definitions between client and server
- **Validation**: Zod schemas ensure data integrity at API boundaries

### API Endpoints

#### Moods
- `POST /api/moods` - Create mood entry
- `GET /api/moods/:date` - Get mood by date
- `GET /api/moods?startDate&endDate` - Get mood range

#### Habits
- `GET /api/habits` - Get all active habits
- `POST /api/habits` - Create new habit
- `PUT /api/habit-entries/:habitId/:date` - Toggle habit completion

#### Journal
- `POST /api/journal-entries` - Create journal entry
- `GET /api/journal-entries` - Get journal entries


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use React Query for server state management
- Implement responsive design patterns
- Add unit tests for new features
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, bug reports, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- **shadcn/ui** for the component library
- **Framer Motion** for smooth animations
- **TanStack Query** for server state management
- **Tailwind CSS** for the design system
- **Radix UI** for accessible primitives

---

**MindWell** - Taking care of your mental health, one day at a time. 🌱