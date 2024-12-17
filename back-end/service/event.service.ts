import { Event } from '../model/Event';
import eventDB from '../repository/event.db';

const getEventById = async (id: number): Promise<Event> => {
    const event = await eventDB.getEventById({ id });
    if (!event) throw new Error(`Event with id ${id} does not exist.`);
    return event;
};

const getAllEvents = async (): Promise<Event[]> => eventDB.getAllEvents();



export default { getEventById, getAllEvents };
