# Lookedu - Learning Center Repository Frontend

This is a production-ready Next.js frontend for the Lookedu API.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Axios + OpenAPI TypeScript (generated)
- **Form Management**: React Hook Form + Zod
- **Icons**: Lucide React

## Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
   ```

3. **Generate API Types** (if schema changes):
   ```bash
   npm run gen:api
   ```
   *(Note: This requires the backend to be running or a local `schema.json` file)*

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Features
- **JWT Authentication**: Full login/logout flow with automatic token refresh via Axios interceptors.
- **Protected Routes**: Middleware-like protection via `AuthProvider`.
- **Responsive Design**: Premium UI built with Tailwind CSS, optimized for both desktop and mobile.
- **Dynamic Routing**: Slug-based navigation for Learning Center details.
- **Type Safety**: End-to-end type safety using generated schemas from the backend OpenAPI documentation.
