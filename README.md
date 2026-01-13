This is the updated, professional `README.md` for your project, now including the dedicated **API Architecture** section with the directory tree.

---

# 📚 BookWorm

**BookWorm** is a personalized book recommendation and reading tracker application designed to make discovering and tracking books engaging and seamless. Built with a "cozy library" aesthetic, it allows users to build their own digital bookshelves, track reading progress, and receive smart recommendations based on their habits.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Components)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/) (Reading stats & Admin analytics)
- **Forms:** React Hook Form + Zod Validation

### Backend & Database
- **Language:** TypeScript
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Hosted on Neon)
- **State Management:** TanStack Query (React Query)
- **Image Hosting:** [Cloudinary](https://cloudinary.com/)

### Authentication & Security
- **Provider:** [Better Auth](https://www.better-auth.com/)
- **Strategy:** Database-backed Sessions (See "Architecture Decisions" below)
- **Middleware:** Next.js Edge Middleware for Role-Based Access Control (RBAC)

---

## ✨ Key Features

### 👤 User Features
- **Personal Library:** Manage books across three shelves: *Want to Read*, *Currently Reading*, and *Read*.
- **Progress Tracking:** Log reading progress (percentage or page count) for active books.
- **Smart Recommendations:** A personalized engine that suggests books based on your most-read genres and high-rated community reviews.
- **Reviews & Ratings:** Share your thoughts and rate books (1-5 stars).
- **Reading Dashboard:** Visualize your reading habits with charts showing books read per year and genre breakdowns.
- **Tutorials:** Access a curated list of book-related YouTube content.

### 🛡️ Admin Features
- **User Management:** Promote/demote users and manage account statuses.
- **Book CRUD:** Full control over the book catalog, including Cloudinary-powered cover uploads.
- **Genre Management:** Create and organize book categories.
- **Review Moderation:** A dedicated pipeline to approve or delete user-submitted reviews.
- **Tutorial Management:** Manage the embedded video library.

---

## 🏗️ Architecture Decisions

### Why Better Auth instead of manual JWT?
While many traditional MERN stacks rely on manual `jsonwebtoken` and `bcrypt` implementation, this project utilizes **Better Auth**. 
- **Security:** Better Auth uses the **Scrypt** hashing algorithm, which is more resistant to brute-force attacks than standard Bcrypt.
- **Session Management:** Instead of stateless JWTs which are difficult to revoke, we use **Database Sessions**. This allows for instant session invalidation (e.g., if a user is banned or logs out) and better security tracking.
- **Role-Based Access:** RBAC is integrated directly into the session object, allowing our Edge Middleware to protect routes with zero-latency overhead.

### Traffic Controller Logic
The application features a "No Public Homepage" policy. The root route (`/`) acts as a **Traffic Controller**:
- **Unauthenticated users** are redirected to `/login`.
- **Admins** are automatically routed to `/admin/dashboard`.
- **Regular Users** are routed to `/library`.

---

## 🛣️ API Architecture

The backend follows a modular RESTful structure within the Next.js App Router:

```text
src/app/api/
├── books/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── genres/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── reviews/
│   ├── route.ts (POST)
│   ├── book/[bookId]/route.ts (GET)
│   ├── pending/route.ts (GET)
│   ├── user/route.ts (GET)
│   └── [id]/
│       ├── moderate/route.ts (PUT)
│       └── route.ts (DELETE)
├── library/
│   └── shelves/
│       ├── route.ts (GET, POST)
│       └── [id]/route.ts (PUT, DELETE)
├── recommendations/route.ts (GET)
├── tutorials/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── users/
│   ├── route.ts (GET)
│   └── [id]/role/route.ts (PUT)
├── admin/stats/route.ts (GET)
└── upload/route.ts (POST)
```

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/bookworm.git
cd bookworm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 4. Database Setup
```bash
npx prisma db push
npx prisma db seed
```
*Note: The seed script creates an initial Admin user (`admin@bookworm.com` / `admin@bookworm.com`) and sample book data.*

### 5. Run the development server
```bash
npm run dev
```

---

## 📊 Database Schema
The project uses a relational PostgreSQL schema optimized for performance:
- **User:** Stores profile data and roles (Admin/User).
- **Book:** Core book metadata linked to Genres.
- **UserBook:** A junction table managing the "Shelves" and reading progress.
- **Review:** Handles ratings and moderation status.
- **Tutorial:** Stores curated YouTube embeds.

---

## 🎨 Design Philosophy
The UI is built to evoke a **"Cozy Library"** feel. 
- **Typography:** Poppins for a clean, modern, yet friendly look.
- **Color Palette:** Warm backgrounds (`bg-background`) and soft card surfaces (`bg-card`) to reduce eye strain during long browsing sessions.
- **Responsiveness:** Fully optimized for mobile, tablet, and desktop using Tailwind's mobile-first approach.

---

## 📄 License
This project is developed for educational purposes as part of a personalized portfolio.

---
*Developed with passion by Md Isa Ahamed San*
