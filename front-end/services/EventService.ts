import { Event, User } from "@types";

const getAllEvents = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const getEventById = (eventId: (string)) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/events/${eventId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const createEvent = (event: Event) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
    });
}

const registerEvent = (eventId: (string), user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            auction: getEventById(eventId),
            user: user,
        }),
    });
}

const EventService = {
    getAllEvents,
    getEventById,
    createEvent,
    registerEvent,
};

export default EventService;