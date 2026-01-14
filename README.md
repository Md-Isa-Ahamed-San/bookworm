# 📚 BookWorm

## 🚀 Tech Stack

### **Frontend**

* **Next.js 15 (App Router)**
* **React 19**
* **TypeScript**
* **Tailwind CSS v4**
* **shadcn/ui** (Radix-based UI patterns)
* **Lucide Icons**
* **Recharts** (Data visualization)
* **Swiper / Embla Carousel**
* **Next Themes** (Dark mode support)

---

### **Backend**

* **Next.js Server Actions**
* **Node.js (ESM)**
* **Better Auth** (Modern authentication)
* **Cloudinary** (Image upload & management)

---

### **State & Data Management**

* **TanStack Query (React Query v5)**
* **React Hook Form**
* **Zod** (Schema validation)
* **@hookform/resolvers**

---

### **Database & ORM**

* **PostgreSQL**
* **Prisma ORM**
* **@auth/prisma-adapter**
* **Prisma Migrate & Studio**


### **Environment & Configuration**

* **@t3-oss/env-nextjs** (Type-safe environment variables)

---

### **Developer Experience & Tooling**

* **ESLint v9**
* **Prettier + Tailwind Plugin**
* **TypeScript v5**
* **Prisma Generate (Postinstall)**

---

### **UI Utilities**
* **sonner** (Toast notifications)
* **react-resizable-panels**

---

### **Deployment & Build**

* **Next.js Turbo Dev**
* **Optimized Production Builds**
* **Database seed via Prisma**

---


## 📂 Project Structure (Condensed)

```
bookworm/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── book-actions.ts
│   │   └── .. (admin, genre, review, shelf, user actions)
│
│   ├── app/
│   │   ├── (admin)/
│   │   ├── (auth)/
│   │   ├── (user)/
│   │   └── api/
│   │       ├── auth/
│   │       └── .. (other API routes)
│
│   ├── hooks/
│   │   ├── books/
│   │   │   ├── use-books.ts
│   │   │   ├── use-create-book.ts
│   │   │   └── .. (update, delete, debounce hooks)
│   │   ├── user/
│   │   │   ├── use-session.ts
│   │   │   └── .. (responsive & user hooks)
│   │   └── .. (admin, genre, review, tutorial hooks)
│
│   ├── server/
│   │   └── better-auth/
│   │       ├── client.ts
│   │       └── .. (server, config, index)
│
│   ├── lib/
│   │   ├── db.ts
│   │   └── seed.ts
│
│   ├── components/
│   ├── providers/
│   └── queries/
│
├── middleware.ts
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## 🧠 Architecture Overview

### 🔹 Server Actions (`src/actions`)

Encapsulates all server-side business logic such as authentication, CRUD operations, and role-based access control.
Keeps API logic **type-safe, colocated, and secure**.

### 🔹 App Router (`src/app`)

Uses **route groups** to separate concerns:

* `(admin)` → Admin dashboard
* `(auth)` → Login & registration
* `(user)` → Authenticated user experience

### 🔹 Custom Hooks (`src/hooks`)

Reusable client-side logic for:

* Data fetching & mutations
* Auth/session state
* Performance optimizations (debouncing)
* Responsive behavior

### 🔹 Authentication (`src/server/better-auth`)

Centralized Better Auth setup for:

* Client usage
* Server validation
* Provider configuration

### 🔹 Database Layer (`src/lib`)

* `db.ts` → Prisma client singleton
* `seed.ts` → Database seeding

---

## ⚙️ Environment Setup

1. Clone the repository
2. Install dependencies

   ```bash
   npm install
   ```
3. Configure environment variables

   ```bash
   cp .env.example .env
   ```
4. Run database migrations

   ```bash
   npx prisma migrate dev
   ```
5. Start the development server

   ```bash
   npm run dev
   ```

---

## ✅ Key Features

* Role-based authentication
* Admin & user dashboards
* Book, shelf, review, and tutorial management
* Scalable and maintainable folder structure
* Production-ready configuration

---

## 📌 Notes

* Built with **scalability and DX in mind**
* Follows **modern Next.js App Router best practices**
* Easily extensible for future features

---

