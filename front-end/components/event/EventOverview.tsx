import { useTranslation } from "next-i18next";
import { Event, User } from "@types";

type Props = {
    events: Array<Event>
    user: Array<User>
}

const EventOverview: React.FC<Props> = ({events, user}: Props) => {
    
    return (
        <>
            {events && (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Hour</th>
                            <th scope="col">Sports hall</th>
                            <th scope="col">Square</th>
                            <th scope="col">Registered</th>
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