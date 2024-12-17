import database from '../util/database';
import { Event } from '../model/Event';

const createEvent = async (event: Event): Promise<Event> => {
    try {
        const eventPrisma = await database.event.create({
            data: {
                name: event.getName(),
                description: event.getDescription(),
                location: event.getLocation(),
                start: event.getStart(),
                end: event.getEnd(),
            },
        });

        return Event.from(eventPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getEventById = async ({ id }: { id: number }): Promise<Event | null> => {
    try {
        const eventPrisma = await database.event.findUnique({
            where: { id },
        });

        return eventPrisma ? Event.from(eventPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllEvents = async (): Promise<Event[]> => {
    try {
        const eventsPrisma = await database.event.findMany({
            orderBy: { start: 'asc' },
        });
        return eventsPrisma.map((eventPrisma) => Event.from(eventPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createEvent,
    getEventById,
    getAllEvents,
};
