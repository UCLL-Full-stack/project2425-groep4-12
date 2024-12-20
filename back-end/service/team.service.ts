import { UnauthorizedError } from 'express-jwt';
import eventDb from '../repository/event.db';
import coachDb from '../repository/coach.db';
import teamDb from '../repository/team.db';
import playerDb from '../repository/player.db';

import { Role, TeamInput, PlayerInput, CoachInput, EventInput } from '../types';
import { Team } from '../model/Team';
import { Event } from '../model/Event';
import { ro } from 'date-fns/locale';

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
                
                const playerId = player.getId();
                if (playerId === undefined) throw new Error('Player id is required');

                const existingTeam = await teamDb.getTeamsByPlayerId({ playerId });
                if (existingTeam) throw new Error(`Player with id ${player.getId()} is already in a team`);

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

        const existingTeam = await teamDb.getTeamByPlayersAndCoach({
            playerId: players.map((player) => player.id).filter((id): id is number => id !== undefined),
            coachId: coach.id,
        });

        if (existingTeam) throw new Error('This team already exists');

        const team = new Team({ name, coach: coachData, players: playerEntities, schedule: events });
        return await teamDb.createTeam(team);
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const addPlayersToTeam = async ({ teamId, playerIds, role }: { teamId: number, playerIds: number[], role: Role }): Promise<Team | null> => {
    if (role === 'ADMIN' || role === 'COACH') {
        if (teamId === undefined) throw new Error('Team id is required');
        if (!playerIds || playerIds.length === 0) throw new Error('At least one player id is required');

        const team = await teamDb.getTeamById({ id: teamId });
        if (!team) throw new Error('Team not found');

        const players = await Promise.all(
            playerIds.map(async (playerId) => {
                const player = await playerDb.getPlayerById({ id: playerId });
                if (!player) throw new Error(`Player with id ${playerId} not found`);
                return player;
            })
        );

        players.forEach((player) => {
            team.addPlayerToTeam(player);
        });

        return await teamDb.updatePlayersOfTeam({ team });
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const getAllEventsByPlayer = async ({
    firstName,
    lastName,
    role,
}: {
    firstName: string;
    lastName: string;
    role: Role;
}): Promise<Event[]> => {
    if (role) {
        const playerId = await playerDb.getPlayerIdByFirstAndLastName({ firstName, lastName });
        const teams = await teamDb.getTeamsByPlayerId({ playerId });
        const events = teams.flatMap(team => team.getSchedule());
        return events;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const getAllEventsByCoach = async ({
    firstName,
    lastName,
    role,
}: {
    firstName: string;
    lastName: string;
    role: Role;
}): Promise<Event[]> => {
    if (role) {
        const teams = await teamDb.getTeamsByCoachFirstAndLastName( { firstName, lastName });
        const events = teams.flatMap(team => team.getSchedule());
        return events;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const deleteTeam = async ({ id, role }: { id: number, role: Role }): Promise<Team | null> => {
    if (role === 'ADMIN') {
        const team = await teamDb.getTeamById({ id });
        if (!team) throw new Error(`Team with id ${id} does not exist`);
        return teamDb.deleteTeam({ id });
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const getTeamById = async ({ id, role }: { id: number, role: Role }): Promise<Team | null> => {

    if (role) {
        if (id === undefined) throw new Error('Team id is required');
        return teamDb.getTeamById({ id });
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
}


const removePlayerFromTeam = async ({ teamId, playerId, role }: { teamId: number, playerId: number; role: Role }): Promise<Team | null> => {
    if (role === 'ADMIN' || role === 'COACH') {
        if (teamId === undefined) throw new Error('Team id is required');
        if (playerId === undefined) throw new Error('Player id is required');
        const team = await teamDb.getTeamById({ id: teamId });
        if (!team) throw new Error(`Team with id ${teamId} does not exist`);
        const updatedTeam = await teamDb.deletePlayerFromTeam({ teamId, playerId });
        if (!updatedTeam) throw new Error(`Failed to remove player with id ${playerId} from team with id ${teamId}`);
        return updatedTeam;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const addEventToTeamSchedule = async ({ teamId, event, role }: { teamId: number, event: EventInput; role: Role }): Promise<Team | null> => {
    if (role === 'COACH' || role === 'ADMIN') {
        if (teamId === undefined) throw new Error('Team id is required');

        const team = await teamDb.getTeamById({ id: teamId });
        if (!team) throw new Error(`Team with id ${teamId} does not exist`);

        const eventEntity = new Event(event);
        if (!eventEntity) throw new Error(`Failed to create event`);

        // Ensure the event is created in the database
        const createdEvent = await eventDb.createEvent(eventEntity);
        if (!createdEvent) throw new Error(`Failed to create event in the database`);

        team.addEventToSchedule(createdEvent);
        const updatedTeam = await teamDb.updateEventsOfTeam({ teamId, eventIds: team.getSchedule().map(event => event.getId()).filter((id): id is number => id !== undefined) });
        if (!updatedTeam) throw new Error(`Failed to update team schedule with new event`);
        return updatedTeam;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const removeEventFromTeamSchedule = async ({ teamId, eventId, role }: { teamId: number, eventId: number; role: Role }): Promise<Team | null> => {
    if (role === 'COACH') {

        const team = await teamDb.getTeamById({ id: teamId });
        if (!team) throw new Error(`Team with id ${teamId} does not exist`);

        const updatedTeam = await teamDb.deleteEventFromTeamSchedule({ teamId, eventId });
        if (!updatedTeam) throw new Error(`Failed to remove event with id ${eventId} from team with id ${teamId}`);
        return updatedTeam;
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
}

export default { 
    getAllTeams, 
    createTeam, 
    addPlayersToTeam, 
    getAllEventsByPlayer, 
    deleteTeam, 
    removePlayerFromTeam, 
    addEventToTeamSchedule, 
    removeEventFromTeamSchedule,
    getAllEventsByCoach,
    getTeamById

};
