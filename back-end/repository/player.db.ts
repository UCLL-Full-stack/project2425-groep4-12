import database from '../util/database';
import { Player } from '../model/Player';

const createPlayer = async (userId: number): Promise<void> => {
    try {
        await database.player.create({
            data: {
                userId,
                playernumber: `P${userId}`, // Example player number, you can customize this
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllPlayers = async (): Promise<Player[]> => {
    try {
        const playersPrisma = await database.player.findMany({
            include: { user: true },
        });
        return playersPrisma.map((playerPrisma) => Player.from(playerPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getPlayerById = async ({ id }: { id: number }): Promise<Player | null> => {
    try {
        const playerPrisma = await database.player.findUnique({
            where: { id },
            include: { user: true },
        });

        return playerPrisma ? Player.from(playerPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createPlayer,
    getAllPlayers,
    getPlayerById,
};
