import React from 'react';
import { Event } from "@types";
import { useRouter } from 'next/router';
import EventService from "@services/EventService";



const EventOverview: React.FC<{ events: Event[] }> = ({ events }) => {

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
                  <td>{events.end.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default EventOverview;