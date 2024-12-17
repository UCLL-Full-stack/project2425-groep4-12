import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  // Empty the database
  await prisma.team.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.coach.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.user.deleteMany({});

  // Add new users
  const Chris = await prisma.user.create({
    data: {
      firstName: 'Coach',
      lastName: 'Chris',
      email: 'chris@example.com',
      password: await bcrypt.hash('coachpassword', 12),
      role: 'COACH',
      coach: {
        create: {
          rank: 'Senior',
        },
      },
    },
    include: {
      coach: true,
    },
  });

  const Admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Adrie',
      email: 'adrie@example.com',
      password: await bcrypt.hash('adminpassword', 12),
      role: 'ADMIN',
    },
  });

  const John = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('playerpassword', 12),
      role: 'PLAYER',
      player: {
        create: {
          playernumber: '10',
        },
      },
    },
    include: {
      player: true,
    },
  });

  const Jane = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('playerpassword', 12),
      role: 'PLAYER',
      player: {
        create: {
          playernumber: '11',
        },
      },
    },
    include: {
      player: true,
    },
  });

  const Alice = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('playerpassword', 12),
      role: 'PLAYER',
      player: {
        create: {
          playernumber: '12',
        },
      },
    },
    include: {
      player: true,
    },
  });

  // Create events
  const event1 = await prisma.event.create({
    data: {
      name: 'Training Session',
      description: 'Weekly training session',
      location: 'Stadium',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T12:00:00Z'),
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Match Day',
      description: 'Monthly match',
      location: 'Stadium',
      start: new Date('2024-01-15T14:00:00Z'),
      end: new Date('2024-01-15T16:00:00Z'),
    },
  });

  // Create a team with the coach and players
  const team = await prisma.team.create({
    data: {
      name: 'Team A',
      coach: {
        connect: { id: Chris.coach?.id },
      },
      players: {
        connect: [
          { id: John.player?.id },
          { id: Jane.player?.id },
          { id: Alice.player?.id },
        ],
      },
      schedule: {
        connect: [
          { id: event1.id },
          { id: event2.id },
        ],
      },
    },
  });

  // Update the coach with the teamId
  await prisma.coach.update({
    where: { id: Chris.coach?.id },
    data: { teams: { connect: { id: team.id } } },
  });
};

(async () => {
  try {
    await main();
    await prisma.$disconnect();
    console.log('Seed successful');
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
    console.log('Seed failed');
  }
})();