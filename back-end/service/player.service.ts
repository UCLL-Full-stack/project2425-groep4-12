import { ro } from 'date-fns/locale';
import { Player } from '../model/Player';
import playerDb from '../repository/player.db';
import { Role } from '../types';

const getAllPlayers = async ({ firstName, lastName, role }: { firstName: string; lastName: string; role: Role }): Promise<Player[]> => {
    if (role === 'ADMIN') {
        return playerDb.getAllPlayers();
    } else if (role === 'COACH') {
        return playerDb.getAllPlayersByCoachName({ firstName, lastName });
    } else if (role === 'PLAYER') {
        return playerDb.getAllPlayersFromTeamByPlayerName({ firstName, lastName });
    } else {
        throw new Error('You are not authorized to access this resource.');
    }
};

const getPlayerById = async (id: number): Promise<Player> => {
    const player = await playerDb.getPlayerById({ id });
    if (!player) throw new Error(`Player with id ${id} does not exist.`);
    return player;
};

const createPlayer = async (userId: number): Promise<void> => {
    await playerDb.createPlayer(userId);
};

export default { getAllPlayers, getPlayerById, createPlayer };

