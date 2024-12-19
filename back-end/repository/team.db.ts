import database from '../util/database';
import { Team } from '../model/Team';
import { get } from 'http';

const createTeam = async (team: Team): Promise<Team> => {
    try {
        const teamPrisma = await database.team.create({
            data: {
                name: team.getName(),
                coach: {
                    connect: { id: team.getCoach().getId() },
                },
                schedule: {
                    connect: team.getSchedule().map((event) => ({ id: event.getId() })),
                },
            },
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
            },
        });

        return Team.from(teamPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updatePlayersOfTeam = async ({ team }: { team: Team }): Promise<Team | null> => {
    try {
        const teamPrisma = await database.team.update({
            where: { id: team.getId() },
            data: {
                players: {
                    connect: team.getPlayers().map((player) => ({ id: player.getId() })),
                },
                schedule: {
                    connect: team.getSchedule().map((event) => ({ id: event.getId() })),
                },
            },
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
            },
        });
        return teamPrisma ? Team.from(teamPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllTeams = async (): Promise<Team[]> => {
    try {
        const teamsPrisma = await database.team.findMany({
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
            },
        });
        return teamsPrisma.map((teamPrisma) => Team.from(teamPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


const getTeamById = async ({ id }: { id: number }): Promise<Team | null> => {
    try {
        const teamPrisma = await database.team.findUnique({
            where: { id },
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
                
            },
        });
        return teamPrisma ? Team.from(teamPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllTeamsByCoachName = async ({
    firstName,
    lastName,
}: {
    firstName: string;
    lastName: string;
}): Promise<Team[]> => {
    try {
        const teamsPrisma = await database.team.findMany({
            where: {
                coach: {
                    user: {
                        firstName,
                        lastName,
                    },
                },
            },
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
            },
        });
        return teamsPrisma.map((teamPrisma) => Team.from(teamPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getTeamByPlayersAndCoach = async ({
    playerId,
    coachId,
}: {
    playerId: number[];
    coachId: number;
}): Promise<Team | null> => {
    try {
        const teamPrisma = await database.team.findFirst({
            where: {
                AND: [
                    { players: { some: { id: { in: playerId } } } },
                    { coachId },
                ],
            },
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
            },
        });
        return teamPrisma ? Team.from(teamPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

const getTeamsByPlayerId = async ({ playerId }: { playerId: number }): Promise<Team[]> => {
    try {
        const teamsPrisma = await database.team.findMany({
            where: {
                players: {
                    some: {
                        id: playerId,
                    },
                },
            },
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
            },
        });
        return teamsPrisma.map((teamPrisma) => Team.from(teamPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const deleteTeam = async ({ id }: { id: number }): Promise<Team | null> => {
    try {
        const teamPrisma = await database.team.delete({
            where: { id },
            include: {
                coach: { include: { user: true, schedule: true } },
                players: { include: { user: true } },
                schedule: true,
            },
        });
        return teamPrisma ? Team.from(teamPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createTeam,
    updatePlayersOfTeam,
    getAllTeams,
    getTeamById,
    getAllTeamsByCoachName,
    getTeamByPlayersAndCoach,
    getTeamsByPlayerId,
    deleteTeam,
};
