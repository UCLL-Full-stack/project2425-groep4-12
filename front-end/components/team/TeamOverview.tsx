import React from 'react';
import { Team } from '@types';
import { useRouter } from 'next/router';
import TeamService from '@services/TeamService';

const TeamOverview: React.FC<{teams: Team[]}> = ({teams}) => {

    return (
        <>
            {teams && (
                <div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope='col'>Team nr.</th>
                                <th scope='col'>Member count</th>
                                <th scope='col'>Coach</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team, index) => (
                                <tr key={index}>
                                    <td>Team {team.teamId}</td>
                                    <td>{team.members?.length}</td>
                                    <td>{team.coach.firstName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default TeamOverview;