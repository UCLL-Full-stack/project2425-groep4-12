import { useTranslation } from "next-i18next";
import { Event } from "@types";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import EventService from "@services/EventService";

const EventOverview: React.FC<{ events: Event[]; refreshEvents: () => void }> = ({ events, refreshEvents }) => {
  const [showModal, setShowModal] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({ name: '', description: '', location: '', start: new Date(), end: new Date() });

  const handleAddEvent = async () => {
    if (teamId && newEvent.name && newEvent.description && newEvent.location && newEvent.start && newEvent.end) {
      try {
        console.log("Submitting new event:", newEvent);
        const addedEvent = await EventService.addEvent(teamId, newEvent);
        console.log("Event added successfully:", addedEvent);
        setShowModal(false);
        setNewEvent({ name: '', description: '', location: '', start: new Date(), end: new Date() });
        refreshEvents();
      } catch (error) {
        console.error("Failed to add event:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleRemoveEvent = async (teamId: number, eventId: number) => {
    try {
      console.log("Removing event:", { teamId, eventId });
      await EventService.removeEvent(teamId, eventId);
      console.log("Event removed successfully:", eventId);
      refreshEvents();
    } catch (error) {
      console.error("Failed to remove event:", error);
    }
  };

  return (
    <>
      {events && (
        <div className="center-table">
          <table className="table table-hover" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th scope="col" style={{ width: '10%', textAlign: 'center' }}>Name</th>
                <th scope="col" style={{ width: '30%', textAlign: 'center' }}>Description</th>
                <th scope="col" style={{ width: '10%', textAlign: 'left' }}>Location</th>
                <th scope="col" style={{ width: '10%', textAlign: 'left' }}>Starts at:</th>
                <th scope="col" style={{ width: '10%', textAlign: 'left' }}>Ends at:</th>
                <th scope="col" style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                  <td style={{ textAlign: 'center' }}>{event.name}</td>
                  <td style={{ textAlign: 'center' }}>{event.description}</td>
                  <td style={{ textAlign: 'left' }}>{event.location}</td>
                  <td style={{ textAlign: 'left' }}>{event.start.toString()}</td>
                  <td style={{ textAlign: 'left' }}>{event.end.toString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="bg-red-500 text-white font-bold py-1 px-2 rounded" onClick={() => teamId && event.id && handleRemoveEvent(teamId, event.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => setShowModal(true)}>
              Add Event
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Event</h2>
            <label className="block mb-2">
              Team ID:
              <input type="number" className="border p-2 w-full" value={teamId || ''} onChange={(e) => setTeamId(Number(e.target.value))} />
            </label>
            <label className="block mb-2">
              Name:
              <input type="text" className="border p-2 w-full" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
            </label>
            <label className="block mb-2">
              Description:
              <input type="text" className="border p-2 w-full" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
            </label>
            <label className="block mb-2">
              Location:
              <input type="text" className="border p-2 w-full" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
            </label>
            <label className="block mb-2">
              Starts at:
              <input type="datetime-local" className="border p-2 w-full" value={newEvent.start.toISOString().slice(0, 16)} onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })} />
            </label>
            <label className="block mb-2">
              Ends at:
              <input type="datetime-local" className="border p-2 w-full" value={newEvent.end.toISOString().slice(0, 16)} onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })} />
            </label>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleAddEvent}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventOverview;