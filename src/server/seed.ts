/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// db/seed.ts

import { hash } from 'bcryptjs';
import { db } from './db';


async function main() {
  // Clear existing BookWorm data (keep auth tables structure)
  await db.review.deleteMany();
  await db.userBook.deleteMany();
  await db.tutorial.deleteMany();
  await db.book.deleteMany();
  await db.genre.deleteMany();

  // Delete existing seed users
  await db.account.deleteMany({
    where: {
      OR: [
        { accountId: 'admin_credential' },
        { accountId: 'user1_credential' },
        { accountId: 'user2_credential' },
      ]
    }
  });
  await db.user.deleteMany({
    where: {
      email: {
        in: ['admin@bookworm.com', 'user1@bookworm.com', 'user2@bookworm.com']
      }
    }
  });

  // Create Admin User (Better Auth compatible)
  const hashedAdminPassword = await hash('admin123', 10);
  const admin = await db.user.create({
    data: {
      id: crypto.randomUUID(), // Better Auth uses UUIDs
      name: 'Admin User',
      email: 'admin@bookworm.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      emailVerified: true,
      role: 'ADMIN',
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: 'admin_credential', // Unique identifier
          providerId: 'credential', // Better Auth credential provider
          password: hashedAdminPassword,
        }
      }
    },
  });

  // Create Normal User 1
  const hashedUser1Password = await hash('user123', 10);
  const user1 = await db.user.create({
    data: {
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: 'user1@bookworm.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      emailVerified: true,
      role: 'USER',
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: 'user1_credential',
          providerId: 'credential',
          password: hashedUser1Password,
        }
      }
    },
  });

  // Create Normal User 2
  const hashedUser2Password = await hash('user123', 10);
  const user2 = await db.user.create({
    data: {
      id: crypto.randomUUID(),
      name: 'Jane Smith',
      email: 'user2@bookworm.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      emailVerified: true,
      role: 'USER',
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: 'user2_credential',
          providerId: 'credential',
          password: hashedUser2Password,
        }
      }
    },
  });

  console.log('✅ Users created:', {
    admin: admin.email,
    user1: user1.email,
    user2: user2.email,
  });

  // Create Genres
  const genres = await Promise.all([
    db.genre.create({ data: { name: 'Fiction' } }),
    db.genre.create({ data: { name: 'Mystery' } }),
    db.genre.create({ data: { name: 'Science Fiction' } }),
    db.genre.create({ data: { name: 'Fantasy' } }),
    db.genre.create({ data: { name: 'Romance' } }),
    db.genre.create({ data: { name: 'Thriller' } }),
    db.genre.create({ data: { name: 'Horror' } }),
    db.genre.create({ data: { name: 'Non-Fiction' } }),
  ]);

  console.log(`✅ Created ${genres.length} genres`);

  // Create Books
  const books = await Promise.all([
    db.book.create({
      data: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic American novel set in the Jazz Age, exploring themes of decadence, idealism, and excess.',
        coverUrl: 'https://covers.openlibrary.org/b/id/7883843-L.jpg',
        totalPages: 180,
        genreId: genres[0].id, // Fiction
        createdByUserId: admin.id,
      },
    }),
    db.book.create({
      data: {
        title: 'Dune',
        author: 'Frank Herbert',
        description: 'Science fiction masterpiece about desert planet Arrakis and the valuable spice melange.',
        coverUrl: 'https://covers.openlibrary.org/b/id/8479662-L.jpg',
        totalPages: 412,
        genreId: genres[2].id, // Science Fiction
        createdByUserId: admin.id,
      },
    }),
    db.book.create({
      data: {
        title: 'Murder on the Orient Express',
        author: 'Agatha Christie',
        description: 'A detective novel featuring Hercule Poirot investigating a murder on a luxurious train.',
        coverUrl: 'https://covers.openlibrary.org/b/id/8231512-L.jpg',
        totalPages: 256,
        genreId: genres[1].id, // Mystery
        createdByUserId: admin.id,
      },
    }),
    db.book.create({
      data: {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'A fantasy adventure following Bilbo Baggins on his unexpected journey.',
        coverUrl: 'https://covers.openlibrary.org/b/id/8506154-L.jpg',
        totalPages: 310,
        genreId: genres[3].id, // Fantasy
        createdByUserId: admin.id,
      },
    }),
    db.book.create({
      data: {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'A romantic novel of manners following Elizabeth Bennet and Mr. Darcy.',
        coverUrl: 'https://covers.openlibrary.org/b/id/8235657-L.jpg',
        totalPages: 432,
        genreId: genres[4].id, // Romance
        createdByUserId: admin.id,
      },
    }),
  ]);

  console.log(`✅ Created ${books.length} books`);

  // Create UserBooks (Shelves) for user1
  await db.userBook.create({
    data: {
      userId: user1.id,
      bookId: books[0].id, // The Great Gatsby
      shelf: 'READ',
      progress: 100,
    },
  });

  await db.userBook.create({
    data: {
      userId: user1.id,
      bookId: books[1].id, // Dune
      shelf: 'CURRENTLY_READING',
      progress: 45,
    },
  });

  await db.userBook.create({
    data: {
      userId: user1.id,
      bookId: books[2].id, // Murder on the Orient Express
      shelf: 'WANT_TO_READ',
      progress: 0,
    },
  });

  // Create UserBooks for user2
  await db.userBook.create({
    data: {
      userId: user2.id,
      bookId: books[3].id, // The Hobbit
      shelf: 'READ',
      progress: 100,
    },
  });

  await db.userBook.create({
    data: {
      userId: user2.id,
      bookId: books[4].id, // Pride and Prejudice
      shelf: 'CURRENTLY_READING',
      progress: 60,
    },
  });

  console.log('✅ Created user shelves');

  // Create Reviews (some APPROVED, some PENDING)
  await db.review.create({
    data: {
      userId: user1.id,
      bookId: books[0].id,
      rating: 5,
      text: 'A timeless classic! Fitzgerald\'s prose is absolutely stunning. The symbolism and themes are incredibly deep.',
      status: 'APPROVED',
    },
  });

  await db.review.create({
    data: {
      userId: user2.id,
      bookId: books[3].id,
      rating: 5,
      text: 'An amazing adventure from start to finish. Tolkien created such a rich and immersive world.',
      status: 'APPROVED',
    },
  });

  await db.review.create({
    data: {
      userId: user1.id,
      bookId: books[1].id,
      rating: 4,
      text: 'Complex and engaging science fiction. The world-building is exceptional, though it can be slow at times.',
      status: 'PENDING',
    },
  });

  console.log('✅ Created reviews');

  // Create Tutorials
  await db.tutorial.create({
    data: {
      title: 'Top 10 Books of 2024',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Discover the best books released this year across all genres.',
      createdByUserId: admin.id,
    },
  });

  await db.tutorial.create({
    data: {
      title: 'How to Read Faster',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Proven techniques to increase your reading speed while maintaining comprehension.',
      createdByUserId: admin.id,
    },
  });

  await db.tutorial.create({
    data: {
      title: 'Book Recommendations for Beginners',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Perfect starting points for new readers in various genres.',
      createdByUserId: admin.id,
    },
  });

  console.log('✅ Created tutorials');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📧 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ADMIN:');
  console.log('  Email: admin@bookworm.com');
  console.log('  Password: admin123');
  console.log('\nUSER 1:');
  console.log('  Email: user1@bookworm.com');
  console.log('  Password: user123');
  console.log('\nUSER 2:');
  console.log('  Email: user2@bookworm.com');
  console.log('  Password: user123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });


//   ## 🔑 **Better Auth Compatibility prisma seed:**

// 1. ✅ **Uses `crypto.randomUUID()`** - Better Auth standard
// 2. ✅ **Creates Account records** with hashed passwords
// 3. ✅ **Sets `providerId: 'credential'`** - For Better Auth credential provider
// 4. ✅ **Sets `emailVerified: true`** - So users can login immediately
// 5. ✅ **Clears old seed data** - Prevents duplicates on re-seed
// 6. ✅ **Two normal users** - user1 and user2

// ---

// ## 📋 **Login Credentials:**
// ```
// ADMIN:
// Email: admin@bookworm.com
// Password: admin123

// USER 1:
// Email: user1@bookworm.com
// Password: user123

// USER 2:
// Email: user2@bookworm.com
// Password: user123