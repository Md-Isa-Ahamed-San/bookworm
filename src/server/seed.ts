/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
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
   * 1. Create Admin User
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
   * 2. Create Normal User 1
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
   * 3. Create Normal User 2
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

  console.log("✅ Users created and verified");

  console.log("--- 📚 Seeding Genres ---");
  const genres = await Promise.all([
    db.genre.create({ data: { name: "Fiction" } }), // 0
    db.genre.create({ data: { name: "Mystery" } }), // 1
    db.genre.create({ data: { name: "Science Fiction" } }), // 2
    db.genre.create({ data: { name: "Fantasy" } }), // 3
    db.genre.create({ data: { name: "Romance" } }), // 4
    db.genre.create({ data: { name: "Thriller" } }), // 5
    db.genre.create({ data: { name: "Horror" } }), // 6
    db.genre.create({ data: { name: "Non-Fiction" } }), // 7
  ]);

  console.log("--- 📖 Seeding 50 Books ---");

  const bookData = [
    // Original 5
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A classic American novel set in the Jazz Age.",
      coverUrl: "https://covers.openlibrary.org/b/id/7883843-L.jpg",
      totalPages: 180,
      genreId: genres[0]!.id,
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      description: "Science fiction masterpiece about desert planet Arrakis.",
      coverUrl: "https://covers.openlibrary.org/b/id/8479662-L.jpg",
      totalPages: 412,
      genreId: genres[2]!.id,
    },
    {
      title: "Murder on the Orient Express",
      author: "Agatha Christie",
      description: "A detective novel featuring Hercule Poirot.",
      coverUrl: "https://covers.openlibrary.org/b/id/8231512-L.jpg",
      totalPages: 256,
      genreId: genres[1]!.id,
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description: "A fantasy adventure following Bilbo Baggins.",
      coverUrl: "https://covers.openlibrary.org/b/id/8506154-L.jpg",
      totalPages: 310,
      genreId: genres[3]!.id,
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "A romantic novel of manners.",
      coverUrl: "https://covers.openlibrary.org/b/id/8235657-L.jpg",
      totalPages: 432,
      genreId: genres[4]!.id,
    },

    // 45 New Dummy Books
    {
      title: "1984",
      author: "George Orwell",
      description: "Dystopian social science fiction novel.",
      coverUrl: "https://covers.openlibrary.org/b/id/12640516-L.jpg",
      totalPages: 328,
      genreId: genres[2]!.id,
    },
    {
      title: "The Shining",
      author: "Stephen King",
      description: "A horror novel about a haunted hotel.",
      coverUrl: "https://covers.openlibrary.org/b/id/8231938-L.jpg",
      totalPages: 447,
      genreId: genres[6]!.id,
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      description: "A brief history of humankind.",
      coverUrl: "https://covers.openlibrary.org/b/id/12711054-L.jpg",
      totalPages: 443,
      genreId: genres[7]!.id,
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      description: "A psychological thriller about a disappearance.",
      coverUrl: "https://covers.openlibrary.org/b/id/7989100-L.jpg",
      totalPages: 415,
      genreId: genres[5]!.id,
    },
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      description: "The story of Kvothe, a legendary figure.",
      coverUrl: "https://covers.openlibrary.org/b/id/8166425-L.jpg",
      totalPages: 662,
      genreId: genres[3]!.id,
    },
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      description: "A mystery thriller involving secret societies.",
      coverUrl: "https://covers.openlibrary.org/b/id/12647417-L.jpg",
      totalPages: 454,
      genreId: genres[1]!.id,
    },
    {
      title: "The Notebook",
      author: "Nicholas Sparks",
      description: "A contemporary love story.",
      coverUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
      totalPages: 214,
      genreId: genres[4]!.id,
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A novel about racial injustice in the Deep South.",
      coverUrl: "https://covers.openlibrary.org/b/id/8225266-L.jpg",
      totalPages: 281,
      genreId: genres[0]!.id,
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      description: "The definitive cyberpunk novel.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644460-L.jpg",
      totalPages: 271,
      genreId: genres[2]!.id,
    },
    {
      title: "It",
      author: "Stephen King",
      description: "A group of children face a shape-shifting entity.",
      coverUrl: "https://covers.openlibrary.org/b/id/8231941-L.jpg",
      totalPages: 1138,
      genreId: genres[6]!.id,
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      description: "An easy way to build good habits.",
      coverUrl: "https://covers.openlibrary.org/b/id/12884345-L.jpg",
      totalPages: 320,
      genreId: genres[7]!.id,
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      description: "A woman shoots her husband and stops speaking.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595151-L.jpg",
      totalPages: 336,
      genreId: genres[5]!.id,
    },
    {
      title: "Circe",
      author: "Madeline Miller",
      description: "A bold reimagining of the mythological sorceress.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595155-L.jpg",
      totalPages: 393,
      genreId: genres[3]!.id,
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      description: "A fable about following your dreams.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644465-L.jpg",
      totalPages: 163,
      genreId: genres[0]!.id,
    },
    {
      title: "Dracula",
      author: "Bram Stoker",
      description: "The classic vampire tale.",
      coverUrl: "https://covers.openlibrary.org/b/id/8231845-L.jpg",
      totalPages: 418,
      genreId: genres[6]!.id,
    },
    {
      title: "The Martian",
      author: "Andy Weir",
      description: "An astronaut stranded on Mars.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644470-L.jpg",
      totalPages: 369,
      genreId: genres[2]!.id,
    },
    {
      title: "Educated",
      author: "Tara Westover",
      description: "A memoir about escaping a survivalist family.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595160-L.jpg",
      totalPages: 334,
      genreId: genres[7]!.id,
    },
    {
      title: "The Girl on the Train",
      author: "Paula Hawkins",
      description: "A psychological thriller about memory and murder.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595165-L.jpg",
      totalPages: 326,
      genreId: genres[5]!.id,
    },
    {
      title: "A Game of Thrones",
      author: "George R.R. Martin",
      description: "Epic fantasy of noble houses in Westeros.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644475-L.jpg",
      totalPages: 694,
      genreId: genres[3]!.id,
    },
    {
      title: "Me Before You",
      author: "Jojo Moyes",
      description: "A heartbreaking romance.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595170-L.jpg",
      totalPages: 369,
      genreId: genres[4]!.id,
    },
    {
      title: "The Big Sleep",
      author: "Raymond Chandler",
      description: "Hardboiled detective fiction.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644480-L.jpg",
      totalPages: 231,
      genreId: genres[1]!.id,
    },
    {
      title: "Frankenstein",
      author: "Mary Shelley",
      description: "The original gothic science fiction.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644485-L.jpg",
      totalPages: 280,
      genreId: genres[6]!.id,
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      description: "A lone astronaut must save Earth.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595175-L.jpg",
      totalPages: 476,
      genreId: genres[2]!.id,
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      description: "The memoir of the former First Lady.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595180-L.jpg",
      totalPages: 448,
      genreId: genres[7]!.id,
    },
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      description: "A reclusive Hollywood icon tells her story.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595185-L.jpg",
      totalPages: 389,
      genreId: genres[0]!.id,
    },
    {
      title: "The Guest List",
      author: "Lucy Foley",
      description: "A murder mystery at a wedding.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595190-L.jpg",
      totalPages: 313,
      genreId: genres[1]!.id,
    },
    {
      title: "Pet Sematary",
      author: "Stephen King",
      description: "Sometimes dead is better.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644490-L.jpg",
      totalPages: 374,
      genreId: genres[6]!.id,
    },
    {
      title: "The Way of Kings",
      author: "Brandon Sanderson",
      description: "Epic fantasy on the world of Roshar.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644495-L.jpg",
      totalPages: 1007,
      genreId: genres[3]!.id,
    },
    {
      title: "Red, White & Royal Blue",
      author: "Casey McQuiston",
      description: "A royal romance.",
      coverUrl: "https://covers.openlibrary.org/b/id/12595195-L.jpg",
      totalPages: 418,
      genreId: genres[4]!.id,
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      description: "Exploration of the mind's two systems.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644500-L.jpg",
      totalPages: 499,
      genreId: genres[7]!.id,
    },
    {
      title: "The Bourne Identity",
      author: "Robert Ludlum",
      description: "A man with amnesia is hunted.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644505-L.jpg",
      totalPages: 566,
      genreId: genres[5]!.id,
    },
    {
      title: "And Then There Were None",
      author: "Agatha Christie",
      description: "Ten strangers trapped on an island.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644510-L.jpg",
      totalPages: 272,
      genreId: genres[1]!.id,
    },
    {
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      description: "The start of the epic quest.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644515-L.jpg",
      totalPages: 423,
      genreId: genres[3]!.id,
    },
    {
      title: "Outlander",
      author: "Diana Gabaldon",
      description: "Time-traveling romance in Scotland.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644520-L.jpg",
      totalPages: 850,
      genreId: genres[4]!.id,
    },
    {
      title: "The Haunting of Hill House",
      author: "Shirley Jackson",
      description: "A classic ghost story.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644525-L.jpg",
      totalPages: 182,
      genreId: genres[6]!.id,
    },
    {
      title: "Foundation",
      author: "Isaac Asimov",
      description: "The fall of a galactic empire.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644530-L.jpg",
      totalPages: 255,
      genreId: genres[2]!.id,
    },
    {
      title: "Meditations",
      author: "Marcus Aurelius",
      description: "Stoic philosophy from a Roman Emperor.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644535-L.jpg",
      totalPages: 254,
      genreId: genres[7]!.id,
    },
    {
      title: "Shutter Island",
      author: "Dennis Lehane",
      description: "Mystery on a psychiatric island.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644540-L.jpg",
      totalPages: 369,
      genreId: genres[5]!.id,
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      description: "Teenage angst and rebellion.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644545-L.jpg",
      totalPages: 234,
      genreId: genres[0]!.id,
    },
    {
      title: "Sherlock Holmes",
      author: "Arthur Conan Doyle",
      description: "The adventures of the famous detective.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644550-L.jpg",
      totalPages: 307,
      genreId: genres[1]!.id,
    },
    {
      title: "The Name of the Rose",
      author: "Umberto Eco",
      description: "Historical mystery in a monastery.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644555-L.jpg",
      totalPages: 512,
      genreId: genres[1]!.id,
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      description: "A futuristic world of genetic engineering.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644560-L.jpg",
      totalPages: 268,
      genreId: genres[2]!.id,
    },
    {
      title: "The Song of Achilles",
      author: "Madeline Miller",
      description: "A romantic retelling of the Iliad.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644565-L.jpg",
      totalPages: 378,
      genreId: genres[4]!.id,
    },
    {
      title: "Bird Box",
      author: "Josh Malerman",
      description: "Don't open your eyes.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644570-L.jpg",
      totalPages: 262,
      genreId: genres[6]!.id,
    },
    {
      title: "Quiet",
      author: "Susan Cain",
      description: "The power of introverts.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644575-L.jpg",
      totalPages: 333,
      genreId: genres[7]!.id,
    },
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      description: "A dark mystery thriller.",
      coverUrl: "https://covers.openlibrary.org/b/id/12644580-L.jpg",
      totalPages: 465,
      genreId: genres[5]!.id,
    },
  ];

  const books = await Promise.all(
    bookData.map((b) =>
      db.book.create({
        data: { ...b, createdByUserId: adminId },
      }),
    ),
  );

  console.log("--- 🗄️ Seeding User Shelves ---");
  await db.userBook.createMany({
    data: [
      { userId: user1Id, bookId: books[0]!.id, shelf: "READ", progress: 100 },
      {
        userId: user1Id,
        bookId: books[1]!.id,
        shelf: "CURRENTLY_READING",
        progress: 45,
      },
      {
        userId: user1Id,
        bookId: books[2]!.id,
        shelf: "WANT_TO_READ",
        progress: 0,
      },
      { userId: user2Id, bookId: books[3]!.id, shelf: "READ", progress: 100 },
      {
        userId: user2Id,
        bookId: books[4]!.id,
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
        bookId: books[0]!.id,
        rating: 5,
        text: "A timeless classic! Fitzgerald's prose is absolutely stunning.",
        status: "APPROVED",
      },
      {
        userId: user2Id,
        bookId: books[3]!.id,
        rating: 5,
        text: "An amazing adventure from start to finish.",
        status: "APPROVED",
      },
      {
        userId: user1Id,
        bookId: books[1]!.id,
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
