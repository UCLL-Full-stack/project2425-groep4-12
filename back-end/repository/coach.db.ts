import database from '../util/database';
import { Coach } from '../model/Coach';

const getAllCoaches = async (): Promise<Coach[]> => {
    try {
        const coachesPrisma = await database.coach.findMany({
            include: { user: true, schedule: true },
        });
        return coachesPrisma.map((coachPrisma) => Coach.from(coachPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createCoach = async (userId: number): Promise<void> => {
    try {
        await database.coach.create({
            data: {
                userId,
                rank: 'Junior',
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const promoteCoach = async ({ id, rank }: { id: number; rank: string }): Promise<Coach | null> => {

    try {
        const coachPrisma = await database.coach.update({
            where: { id },
            include: { user: true, schedule: true },
            data: { rank },
        });

        return coachPrisma ? Coach.from(coachPrisma) : null;

    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getCoachById = async ({ id }: { id: number }): Promise<Coach | null> => {
    try {
        const coachPrisma = await database.coach.findUnique({
            where: { id },
            include: { user: true, schedule: true },
        });

        return coachPrisma ? Coach.from(coachPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllCoaches,
    createCoach,
    getCoachById,
    promoteCoach,
};
