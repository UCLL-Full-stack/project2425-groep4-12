import { Coach } from '../model/Coach';
import coachDb from '../repository/coach.db';

const getAllCoaches = async (): Promise<Coach[]> => coachDb.getAllCoaches();

const getCoachById = async (id: number): Promise<Coach> => {
    const coach = await coachDb.getCoachById({ id });
    if (!coach) throw new Error(`Coach with id ${id} does not exist.`);
    return coach;
};

const promoteCoach = async ({ id, rank }: { id: number; rank: string }): Promise<Coach | null> => {
    const existingCoach = await coachDb.getCoachById({ id });
    if (!existingCoach) throw new Error(`Coach with id ${id} does not exist.`);
    const coach = await coachDb.promoteCoach({ id, rank });
    return coach;
}
const createCoach = async (userId: number): Promise<void> => {
    await coachDb.createCoach(userId);
};

export default { getAllCoaches, getCoachById, createCoach, promoteCoach };
