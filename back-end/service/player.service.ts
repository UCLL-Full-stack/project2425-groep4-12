import { Player } from '../model/Player';
import playerDb from '../repository/player.db';

const getAllPlayers = async (): Promise<Player[]> => playerDb.getAllPlayers();

const getPlayerById = async (id: number): Promise<Player> => {
    const player = await playerDb.getPlayerById({ id });
    if (!player) throw new Error(`Player with id ${id} does not exist.`);
    return player;
};

const createPlayer = async (userId: number): Promise<void> => {
    await playerDb.createPlayer(userId);
};

export default { getAllPlayers, getPlayerById, createPlayer };
