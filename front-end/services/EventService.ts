import { Event, User } from "@types";

const getAllEvents = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const token = loggedInUser ? JSON.parse(loggedInUser).token : null;
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const addEvent = async (teamId: number, event: Event) => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const token = loggedInUser ? JSON.parse(loggedInUser).token : null;
  console.log("Adding event:", { teamId, event });
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/teams/addEvents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ teamId, event }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to add event:", errorText);
    throw new Error("Failed to add event");
  }
  return response.json();
};

const EventService = {
  getAllEvents,
  addEvent,
};

export default EventService;