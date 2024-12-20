import React, { useState } from 'react';
import TeamService from '@services/TeamService';
import { Team } from '@types';
import styles from './TeamOverview.module.css';

type Props = {
    teams: Array<Team>;
    setTeams: React.Dispatch<React.SetStateAction<Team[] | undefined>>;
};

const TeamOverview: React.FC<Props> = ({ teams, setTeams }: Props) => {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const selectTeam = (team: Team) => {
        setSelectedTeam(team);
    };

    const handleRowClick = async (teamId: number) => {
        try {
            const response = await TeamService.getTeamById(teamId);
            const data = await response.json();
            selectTeam(data);
        } catch (error) {
            console.error("Error fetching team details:", error);
        }
    };

    return (
        <>
            {teams && (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope='col'>Id</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Players</th>
                            <th scope='col'>Coach</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team, index) => (
                            <tr
                                key={index}
                                onClick={() => handleRowClick(team.id)}
                                className={styles.hoverRow}
                            >
                                <td>{team.id}</td>
                                <td>{team.name}</td>
                                <td>{team.players?.length}</td>
                                <td>{team.coach.user.lastName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {selectedTeam && (
                <section className="mt-5">
                    <h2 className="text-center">Team Details</h2>
                    <div>
                        <p><strong>Team Name:</strong> {selectedTeam.name}</p>
                        <p><strong>Team ID:</strong> {selectedTeam.id}</p>
                        <p><strong>Players:</strong></p>
                        <ul>
                            {selectedTeam.players.map(player => (
                                <li key={player.id}>{player.user.firstName} {player.user.lastName}</li>
                            ))}
                        </ul>
                        <p><strong>Schedule:</strong></p>
                        <ul>
                            {selectedTeam.schedule.map(event => (
                                <li key={event.id}>{event.name} - {event.start.toLocaleString()}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </>
    );
};

export default TeamOverview;