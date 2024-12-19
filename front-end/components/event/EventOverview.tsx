import { useTranslation } from "next-i18next";
import { Event, User } from "@types";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type Props = {
    events: Event[];
};

const EventOverview: React.FC<Props> = ({events}) => {
    
    

    return (
        <>
            {events && (
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
            )}
        </>
    )
};

export default EventOverview;