import { UnauthorizedError } from 'express-jwt';
import eventDb from '../repository/event.db';
import coachDb from '../repository/coach.db';
import teamDb from '../repository/team.db';
import playerDb from '../repository/player.db';

import { Role, TeamInput, PlayerInput, CoachInput, EventInput } from '../types';
import { Team } from '../model/Team';
import { Event } from '../model/Event';

const getAllTeams = async ({
    firstName,
    lastName,
    role,
}: {
    firstName: string;
    lastName: string;
    role: Role;
}): Promise<Team[]> => {
    if (role === 'ADMIN') {
        return teamDb.getAllTeams();
    } else if (role === 'COACH') {
        return teamDb.getAllTeamsByCoachName({ firstName, lastName });
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const createTeam = async ({
    name,
    coach,
    players,
    schedule,
    role,
}: {
    name: string;
    coach: CoachInput;
    players: PlayerInput[];
    schedule: EventInput[];
    role: Role;
    
}): Promise<Team> => {
    if (role === 'ADMIN'){
        if (!coach.id) throw new Error('Coach id is required');
        const coachData = await coachDb.getCoachById({ id: coach.id });
        if (!coachData) throw new Error(`Coach with id ${coach.id} not found`);
        const playerEntities = await Promise.all(
            players.map(async (playerInput) => {
                if (!playerInput.id) throw new Error('Player id is required');
                const player = await playerDb.getPlayerById({ id: playerInput.id });
                if (!player) throw new Error(`Player with id ${playerInput.id} not found`);
                return player;
            })
        );
        const events = await Promise.all(
            schedule.map(async (eventInput): Promise<Event> => {
            if (!eventInput.id) throw new Error('Event id is required');
            const event = await eventDb.getEventById({ id: eventInput.id });
            if (!event) throw new Error(`Event with id ${eventInput.id} not found`);
            return event;
        }),
        );
        

        if (!coach) throw new Error('Coach not found');
        if (!players) throw new Error('Players not found');

        const existingTeam = await teamDb.getTeamByPlayersAndCoach({
            playerId: players.map((player) => player.id).filter((id): id is number => id !== undefined),
            coachId: coach.id,
        });

        if (existingTeam) throw new Error('This team already exists');

        let team = new Team({ name, coach: coachData, players: playerEntities, schedule: events });
        return await teamDb.createTeam(team);
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const addPlayersToTeam = async ({
    team: teamInput,
    players: playersInput,
}: {
    team: TeamInput;
    players: PlayerInput[];
}): Promise<Team | null> => {
    if (!teamInput.id) throw new Error('Schedule id is required');
    if (!playersInput) throw new Error('At least one pla is required');

    const team = await teamDb.getTeamById({ id: teamInput.id });
    if (!team) throw new Error('Schedule not found');

    const players = await Promise.all(
        playersInput.map(async (playerInput) => {
            if (!playerInput.id) throw new Error('Player id is required');
            const player = await playerDb.getPlayerById({ id: playerInput.id });
            if (!player) throw new Error(`Player with id ${playerInput.id} not found`);
            return player;
        })
    );

    players.forEach((player) => {
        team.addPlayerToTeam(player);
    });

    return await teamDb.updatePlayersOfTeam({ team });
};

export default { getAllTeams, createTeam, addPlayersToTeam };
