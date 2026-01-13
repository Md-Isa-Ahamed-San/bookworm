import { auth } from "./better-auth";
import { db } from "./db";

async function main() {
  console.log("--- 🧹 Cleaning Database ---");
  // Clear application data
  await db.review.deleteMany();
  await db.userBook.deleteMany();
  await db.tutorial.deleteMany();
  await db.book.deleteMany();
  await db.genre.deleteMany();

  // Clear Auth data
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  console.log("--- 👤 Seeding Users via Better Auth API ---");

  /**
   * -----------------------------
   * 1. Create Admin User
   * -----------------------------
   */
  const adminRes = await auth.api.signUpEmail({
    body: {
      email: "admin@bookworm.com",
      password: "admin@bookworm.com",
      name: "Admin User",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });
  const adminId = adminRes.user.id;
  await db.user.update({
    where: { id: adminId },
    data: { role: "ADMIN", emailVerified: true },
  });

  /**
   * -----------------------------
   * 2. Create Normal User 1
   * -----------------------------
   */
  const user1Res = await auth.api.signUpEmail({
    body: {
      email: "user1@bookworm.com",
      password: "user1@bookworm.com",
      name: "John Doe",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
  });
  const user1Id = user1Res.user.id;
  await db.user.update({
    where: { id: user1Id },
    data: { emailVerified: true },
  });

  /**
   * -----------------------------
   * 3. Create Normal User 2
   * -----------------------------
   */
  const user2Res = await auth.api.signUpEmail({
    body: {
      email: "user2@bookworm.com",
      password: "user2@bookworm.com",
      name: "Jane Smith",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
  });
  const user2Id = user2Res.user.id;
  await db.user.update({
    where: { id: user2Id },
    data: { emailVerified: true },
  });

  console.log("✅ Users created with profile photos and verified");

  console.log("--- 📚 Seeding Genres ---");
  const genres = await Promise.all([
    db.genre.create({ data: { name: "Fiction" } }),
    db.genre.create({ data: { name: "Mystery" } }),
    db.genre.create({ data: { name: "Science Fiction" } }),
    db.genre.create({ data: { name: "Fantasy" } }),
    db.genre.create({ data: { name: "Romance" } }),
    db.genre.create({ data: { name: "Thriller" } }),
    db.genre.create({ data: { name: "Horror" } }),
    db.genre.create({ data: { name: "Non-Fiction" } }),
  ]);

  console.log("--- 📖 Seeding Books ---");
  const books = await Promise.all([
    db.book.create({
      data: {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A classic American novel set in the Jazz Age.",
        coverUrl: "https://covers.openlibrary.org/b/id/7883843-L.jpg",
        totalPages: 180,
        genreId: genres[0].id,
        createdByUserId: adminId,
      },
    }),
    db.book.create({
      data: {
        title: "Dune",
        author: "Frank Herbert",
        description: "Science fiction masterpiece about desert planet Arrakis.",
        coverUrl: "https://covers.openlibrary.org/b/id/8479662-L.jpg",
        totalPages: 412,
        genreId: genres[2].id,
        createdByUserId: adminId,
      },
    }),
    db.book.create({
      data: {
        title: "Murder on the Orient Express",
        author: "Agatha Christie",
        description: "A detective novel featuring Hercule Poirot.",
        coverUrl: "https://covers.openlibrary.org/b/id/8231512-L.jpg",
        totalPages: 256,
        genreId: genres[1].id,
        createdByUserId: adminId,
      },
    }),
    db.book.create({
      data: {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description: "A fantasy adventure following Bilbo Baggins.",
        coverUrl: "https://covers.openlibrary.org/b/id/8506154-L.jpg",
        totalPages: 310,
        genreId: genres[3].id,
        createdByUserId: adminId,
      },
    }),
    db.book.create({
      data: {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "A romantic novel of manners.",
        coverUrl: "https://covers.openlibrary.org/b/id/8235657-L.jpg",
        totalPages: 432,
        genreId: genres[4].id,
        createdByUserId: adminId,
      },
    }),
  ]);

  console.log("--- 🗄️ Seeding User Shelves ---");
  await db.userBook.createMany({
    data: [
      { userId: user1Id, bookId: books[0].id, shelf: "READ", progress: 100 },
      {
        userId: user1Id,
        bookId: books[1].id,
        shelf: "CURRENTLY_READING",
        progress: 45,
      },
      {
        userId: user1Id,
        bookId: books[2].id,
        shelf: "WANT_TO_READ",
        progress: 0,
      },
      { userId: user2Id, bookId: books[3].id, shelf: "READ", progress: 100 },
      {
        userId: user2Id,
        bookId: books[4].id,
        shelf: "CURRENTLY_READING",
        progress: 60,
      },
    ],
  });

  console.log("--- 💬 Seeding Reviews ---");
  await db.review.createMany({
    data: [
      {
        userId: user1Id,
        bookId: books[0].id,
        rating: 5,
        text: "A timeless classic! Fitzgerald's prose is absolutely stunning.",
        status: "APPROVED",
      },
      {
        userId: user2Id,
        bookId: books[3].id,
        rating: 5,
        text: "An amazing adventure from start to finish.",
        status: "APPROVED",
      },
      {
        userId: user1Id,
        bookId: books[1].id,
        rating: 4,
        text: "Complex and engaging science fiction.",
        status: "PENDING",
      },
    ],
  });

  console.log("--- 🎥 Seeding Tutorials ---");
  await db.tutorial.createMany({
    data: [
      {
        title: "Top 10 Books of 2024",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Discover the best books released this year.",
        createdByUserId: adminId,
      },
      {
        title: "How to Read Faster",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Proven techniques to increase your reading speed.",
        createdByUserId: adminId,
      },
    ],
  });

  console.log("\n🎉 Database seeded successfully!\n");
  console.log("📧 Login Credentials:");
  console.log("ADMIN: admin@bookworm.com / admin@bookworm.com");
  console.log("USER 1: user1@bookworm.com / user1@bookworm.com");
  console.log("USER 2: user2@bookworm.com / user2@bookworm.com");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

//   ## 🔑 **Better Auth Compatibility prisma seed:**
// 1. ✅ **Creates Account records** with hashed passwords
// 2. ✅ **Sets `providerId: 'credential'`** - For Better Auth credential provider
// 3. ✅ **Sets `emailVerified: true`** - So users can login immediately
// 4. ✅ **Clears old seed data** - Prevents duplicates on re-seed
// 5. ✅ **Two normal users** - user1 and user2

// ---

// ## 📋 **Login Credentials:**
// ```
// ADMIN:
// Email: admin@bookworm.com
// Password: admin@bookworm.com

// USER 1:
// Email: user1@bookworm.com
// Password: user1@bookworm.com

// USER 2:
// Email: user2@bookworm.com
// Password: user2@bookworm.com
