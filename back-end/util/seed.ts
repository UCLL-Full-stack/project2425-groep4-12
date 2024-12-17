import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  // Empty the database
  await prisma.event.deleteMany();
  await prisma.team.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.player.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const ChrisUser = await prisma.user.create({
    data: {
      firstName: 'Chris',
      lastName: 'Evans',
      email: 'chris@example.com',
      password: 'password',
      role: 'COACH',
    },
  });

  const JohnUser = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'PLAYER',
    },
  });

  const JaneUser = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password',
      role: 'PLAYER',
    },
  });

  const AliceUser = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'password',
      role: 'PLAYER',
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

  // Create a team with the coach and players
  const team = await prisma.team.create({
    data: {
      name: 'Team A',
      coach: {
        connect: { id: Chris.id },
      },
      players: {
        connect: [
          { id: John.id },
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });