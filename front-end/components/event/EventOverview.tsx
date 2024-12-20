import { useTranslation } from "next-i18next";
import { Event } from "@types";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EventService from "@services/EventService";



const EventOverview: React.FC = () => {

  const [events, setEvents] = useState<Array<Event>>([]);
  const [error, setError] = useState<string | null>(null);


  const getAllEvents = async () => {
    const responses = await Promise.all([
        EventService.getAllEvents()
    ]);

    setEvents(await responses[0].json());
    
  };


  useEffect(() => {
    getAllEvents();
  }, []);

  setInterval(getAllEvents, 5000);
    
    return (
        <>
            {events && (
                <div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Desription</th>
                                <th scope="col">Location</th>
                                <th scope="col">Starts at:</th>
                                <th scope="col">Ends at:</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((events, index) => (
                                <tr key={index}>
                                    <td>{events.name}</td>
                                    <td>{events.description}</td>
                                    <td>{events.location}</td>
                                    <td>{events.start.toString()}</td>
                                    <td>{events.end.getHours().toString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
};

export default EventOverview;