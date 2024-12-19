import { Event } from '../model/Event';
import coachDb from '../repository/coach.db';
import eventDB from '../repository/event.db';
import teamDb from '../repository/team.db';
import { Role } from '../types';
import teamService from './team.service';

const getEventById = async (id: number): Promise<Event> => {
    const event = await eventDB.getEventById({ id });
    if (!event) throw new Error(`Event with id ${id} does not exist.`);
    return event;
};

const getAllEvents = async ({firstName, lastName, role}: {firstName:string, lastName:string, role:Role}): Promise<Event[]> => {
    if (role === 'ADMIN') {
        return eventDB.getAllEvents();
    } else if (role === 'COACH') {
        const coach = coachDb.getCoachByFirstAndLastName({ firstName, lastName });
        if (!coach) {
            throw new Error(`Coach ${firstName + " " + lastName} does not exist.`);
        }
        return (await coach).getSchedule();
    } else if (role === 'PLAYER') {
        return teamService.getAllEventsByPlayer({ firstName, lastName, role });
    } else {
        throw new Error('You are not authorized to access this resource.');
    }

};

export default { getEventById, getAllEvents };
