/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { auth } from "./better-auth";
import { db } from "./db";

async function main() {
  console.log("--- 🧹 Cleaning Database ---");
  await db.review.deleteMany();
  await db.userBook.deleteMany();
  await db.tutorial.deleteMany();
  await db.book.deleteMany();
  await db.genre.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  console.log("--- 👤 Seeding 20 Users (Influencers & Celebs) ---");

  const userData = [
    { name: "Jhankar Mahbub", email: "jhankar@hero.com", role: "ADMIN" as const },
    { name: "Sumit Saha", email: "sumit@lws.com", role: "ADMIN" as const },
    { name: "Anisul Islam", email: "anisul@cs.com", role: "USER" as const },
    { name: "Rabbil Hasan", email: "rabbil@dev.com", role: "USER" as const },
    { name: "Tamim Shahriar Subeen", email: "subeen@dimik.com", role: "USER" as const },
    { name: "Hablu Programmer", email: "hablu@yt.com", role: "USER" as const },
    { name: "Sharif Chowdhury", email: "sharif@cp.com", role: "USER" as const },
    { name: "Hasin Hayder", email: "hasin@learnwith.com", role: "ADMIN" as const },
    { name: "Shakib Al Hasan", email: "shakib@cricket.com", role: "USER" as const },
    { name: "Tamim Iqbal", email: "tamim@cricket.com", role: "USER" as const },
    { name: "Chanchal Chowdhury", email: "chanchal@actor.com", role: "USER" as const },
    { name: "Mosharraf Karim", email: "mosharraf@actor.com", role: "USER" as const },
    { name: "Jaya Ahsan", email: "jaya@actor.com", role: "USER" as const },
    { name: "Mehazabien Chowdhury", email: "mehazabien@actor.com", role: "USER" as const },
    { name: "Afran Nisho", email: "nisho@actor.com", role: "USER" as const },
    { name: "Tahsan Khan", email: "tahsan@singer.com", role: "USER" as const },
    { name: "Pori Moni", email: "pori@actor.com", role: "USER" as const },
    { name: "Siam Ahmed", email: "siam@actor.com", role: "USER" as const },
    { name: "Bidya Sinha Mim", email: "mim@actor.com", role: "USER" as const },
    { name: "Isa Ahamed", email: "isa@tech.com", role: "USER" as const },
  ];

  const users = [];
  for (const u of userData) {
    const res = await auth.api.signUpEmail({
      body: {
        email: u.email,
        password: "password123",
        name: u.name,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
      },
    });
    const userId = res.user.id;
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: u.role, emailVerified: true },
    });
    users.push(updatedUser);
  }

  console.log("--- 📚 Seeding Genres ---");
  const genreNames = ["Fiction", "Mystery", "Sci-Fi", "Fantasy", "Romance", "Thriller", "Horror", "Non-Fiction", "Self-Help", "Biography"];
  const genres = await Promise.all(genreNames.map(name => db.genre.create({ data: { name } })));

  console.log("--- 📖 Seeding 100 Books ---");
  const books = [];
  for (let i = 1; i <= 100; i++) {
    const genre = genres[i % genres.length]!;
    const book = await db.book.create({
      data: {
        title: `Book Title ${i}`,
        author: `Author ${((i * 7) % 20) + 1}`,
        description: `This is a detailed description for book number ${i}. It explores deep themes in the ${genre.name} genre.`,
        coverUrl: `https://picsum.photos/seed/book${i}/400/600`,
        totalPages: 150 + (i * 5),
        genreId: genre.id,
        createdByUserId: users[i % users.length]!.id,
      }
    });
    books.push(book);
  }

  console.log("--- 🎥 Seeding 20 Tutorials ---");
  const tutorialTitles = [
    "React for Beginners", "Next.js Mastery", "Prisma 101", "Better Auth Setup", 
    "Tailwind CSS Tips", "Node.js Backend", "Python for Data Science", "Machine Learning Basics",
    "Competitive Programming Guide", "Laravel for Pros", "WordPress Theme Dev", "Nginx Configuration",
    "JavaScript Deep Dive", "TypeScript Benefits", "Dockerizing Apps", "AWS Deployment",
    "SQL vs NoSQL", "Unit Testing in Jest", "Microservices Architecture", "Career in Tech"
  ];

  for (let i = 0; i < 20; i++) {
    await db.tutorial.create({
      data: {
        title: tutorialTitles[i]!,
        youtubeUrl: `https://www.youtube.com/watch?v=sample${i}`,
        description: `Learn everything about ${tutorialTitles[i]} in this comprehensive tutorial by our experts.`,
        createdByUserId: users[i % 8]!.id, // Assigned to the first 8 (the tech influencers)
      }
    });
  }

  console.log("--- 🗄️ Seeding 120 UserBook Entries (Shelves) ---");
  const shelfTypes = ["READ", "CURRENTLY_READING", "WANT_TO_READ"] as const;
  for (let i = 0; i < 120; i++) {
    const user = users[i % users.length]!;
    const book = books[(i * 3) % books.length]!;
    const shelf = shelfTypes[i % 3]!;
    
    await db.userBook.upsert({
      where: { userId_bookId: { userId: user.id, bookId: book.id } },
      update: {},
      create: {
        userId: user.id,
        bookId: book.id,
        shelf: shelf,
        progress: shelf === "READ" ? book.totalPages! : Math.floor(Math.random() * book.totalPages!),
      }
    });
  }

  console.log("--- 💬 Seeding 110 Reviews ---");
  const reviewTexts = [
    "Absolutely loved it!", "A bit slow but worth it.", "Masterpiece.", "Not my cup of tea.",
    "Highly recommended for everyone.", "The plot twist was insane!", "Great character development.",
    "I've read better, but this was okay.", "Changed my perspective on life.", "A must-read classic."
  ];

  for (let i = 0; i < 110; i++) {
    const user = users[(i + 5) % users.length]!;
    const book = books[(i + 10) % books.length]!;
    
    await db.review.upsert({
      where: { userId_bookId: { userId: user.id, bookId: book.id } },
      update: {},
      create: {
        userId: user.id,
        bookId: book.id,
        rating: (i % 5) + 1,
        text: reviewTexts[i % reviewTexts.length]!,
        status: i % 10 === 0 ? "PENDING" : "APPROVED",
      }
    });
  }

  console.log(`
✅ Seeding Complete!
-------------------------------
Users: ${await db.user.count()}
Books: ${await db.book.count()}
Genres: ${await db.genre.count()}
Tutorials: ${await db.tutorial.count()}
Reviews: ${await db.review.count()}
UserBooks: ${await db.userBook.count()}
-------------------------------
Default Password: password123
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });