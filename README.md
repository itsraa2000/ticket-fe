# Ticket System Frontend

A modern, responsive Next.js frontend for the Ticket Management System with advanced features including real-time updates, advanced filtering, sorting, and pagination.

## 🚀 Features

- **Modern UI/UX** with Tailwind CSS and Shadcn/ui components
- **Real-time Updates** for tickets and queue monitoring
- **Advanced Filtering** by status, priority, and search
- **Smart Pagination** with customizable page sizes (10, 20, 50, 100)
- **Sortable Columns** with clickable headers
- **Responsive Design** that works on all devices
- **Queue Monitoring** dashboard with job tracking
- **Form Validation** with comprehensive error handling
- **Toast Notifications** for user feedback
- **TypeScript** throughout for type safety

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Form Handling**: Custom form components
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## ⚙️ Prerequisites

Before running the frontend, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Backend API** running on `http://localhost:3001` (see backend README)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ticket-fe
```

### 2. Install Dependencies

```=
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Development Settings
NODE_ENV=development
```

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🖥️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📋 Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Backend API running on `http://localhost:3001`
- [ ] Environment variables configured
- [ ] Development server started (`npm run dev`)
- [ ] Application accessible at `http://localhost:3000`
- [ ] Test ticket creation working
- [ ] Queue monitoring accessible

**Frontend is ready!** 🎉