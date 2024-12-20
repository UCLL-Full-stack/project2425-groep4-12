import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  // Empty the database
  await prisma.event.deleteMany();
  await prisma.team.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.player.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // Encrypt passwords
  const hashedPasswordChris = await bcrypt.hash('chris123', 12);
  const hashedPasswordJohn = await bcrypt.hash('password', 12);
  const hashedPasswordJane = await bcrypt.hash('password', 12);
  const hashedPasswordAlice = await bcrypt.hash('password', 12);
  const hashedPasswordAdrie = await bcrypt.hash('adrie123', 12);
  const hashedPasswordPascal = await bcrypt.hash('pascal123', 12);

  // Create users
  const ChrisUser = await prisma.user.create({
    data: {
      firstName: 'Coach',
      lastName: 'Chris',
      email: 'chris@example.com',
      password: hashedPasswordChris,
      role: 'COACH',
    },
  });

  const PascalUser = await prisma.user.create({
    data: {
      firstName: 'Pascal',
      lastName: 'Doe',
      email: 'pascal@example.com',
      password: hashedPasswordPascal,
      role: 'PLAYER',
    },
  });

  const JohnUser = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: hashedPasswordJohn,
      role: 'PLAYER',
    },
  });

  const JaneUser = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: hashedPasswordJane,
      role: 'PLAYER',
    },
  });

  const AliceUser = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: hashedPasswordAlice,
      role: 'PLAYER',
    },
  });

  const AdrieUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Adrie',
      email: 'adrie@example.com',
      password: hashedPasswordAdrie,
      role: 'ADMIN',
    },
  });

  // Create coach
  const Chris = await prisma.coach.create({
    data: {
      rank: 'Head Coach',
      user: {
        connect: { id: ChrisUser.id },
      },
    },
  });

  // Create players
  const John = await prisma.player.create({
    data: {
      playernumber: '10',
      user: {
        connect: { id: JohnUser.id },
      },
    },
  });

  const Jane = await prisma.player.create({
    data: {
      playernumber: '11',
      user: {
        connect: { id: JaneUser.id },
      },
    },
  });

  const Alice = await prisma.player.create({
    data: {
      playernumber: '12',
      user: {
        connect: { id: AliceUser.id },
      },
    },
  });

  const Pascal = await prisma.player.create({
    data: {
      playernumber: '13',
      user: {
        connect: { id: PascalUser.id },
      },
    },
  });

  // Create admin
  const Adrie = await prisma.admin.create({
    data: {
      user: {
        connect: { id: AdrieUser.id },
      },
    },
  });

  // Create a team with the coach and players
  const team = await prisma.team.create({
    data: {
      name: 'Team A',
      coach: {
        connect: { id: Chris.id },
      },
      players: {
        connect: [
          { id: Pascal.id },
          { id: Jane.id },
          { id: Alice.id },
        ],
      },
    },
  });

  // Create events and associate them with the team
  const event1 = await prisma.event.create({
    data: {
      name: 'Event 1',
      description: 'Description for Event 1',
      location: 'Location 1',
      start: new Date('2024-01-01T10:00:00Z'),
      end: new Date('2024-01-01T12:00:00Z'),
      teams: {
        connect: { id: team.id },
      },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Event 2',
      description: 'Description for Event 2',
      location: 'Location 2',
      start: new Date('2024-01-15T14:00:00Z'),
      end: new Date('2024-01-15T16:00:00Z'),
      teams: {
        connect: { id: team.id },
      },
    },
  });

  // Update the team to include the events in the schedule
  await prisma.team.update({
    where: { id: team.id },
    data: {
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
    where: { id: Chris.id },
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
      console.log('Seed failed');
      process.exit(1);
  }
})();