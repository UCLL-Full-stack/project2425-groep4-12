import { Coach } from '../model/Coach';
import coachDb from '../repository/coach.db';
import { Role } from '../types';
import { UnauthorizedError } from 'express-jwt';

const getAllCoaches = async ({ firstName, lastName, role} : {firstName:string; lastName:string; role:Role}): Promise<Coach[]> => {
    if (role === 'ADMIN') {
        return coachDb.getAllCoaches();
    } else if (role === 'COACH') {
        const coach = await coachDb.getCoachByFirstAndLastName({ firstName, lastName });
        if (!coach) {
            throw new Error(`Coach ${firstName + " " + lastName} does not exist.`);
        }
        return [coach];
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
    
};

const promoteCoach = async ({ id, rank, role }: { id: number; rank: string, role: Role }): Promise<Coach | null> => {
    if (role === 'ADMIN'){
        const existingCoach = await coachDb.getCoachById({ id });
        if (!existingCoach) throw new Error(`Coach with id ${id} does not exist.`);
        const coach = await coachDb.promoteCoach({ id, rank });
        return coach;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
}

const createCoach = async (userId: number): Promise<void> => {
    await coachDb.createCoach(userId);
};

export default { getAllCoaches, createCoach, promoteCoach };
