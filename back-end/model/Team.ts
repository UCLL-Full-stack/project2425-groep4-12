import {
    Event as EventPrisma,
    Coach as CoachPrisma,
    Team as TeamPrisma,
    Player as PlayerPrisma,
    User as UserPrisma,
} from '@prisma/client';
import { Event } from './Event';
import { Coach } from './Coach';
import { Player } from './Player';

export class Team {
    private id?: number;
    private name: string;
    private coach: Coach;
    private players: Player[];
    private schedule: Event[];

    constructor(team: {
        id?: number;
        name: string;
        coach: Coach;
        players: Player[];
        schedule: Event[];
    }) {
        this.validate(team);

        this.id = team.id;
        this.name = team.name;
        this.coach = team.coach;
        this.players = team.players || [];
        this.schedule = team.schedule || [];
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getCoach(): Coach {
        return this.coach;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getSchedule(): Event[] {
        return this.schedule;
    }

    validate(team: { name: string; coach: Coach }) {
        if (!team.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!team.coach) {
            throw new Error('Coach is required');
        }
    }

    addPlayerToTeam(player: Player) {
        if (!player) throw new Error('Player is required');
        if (this.players.includes(player))
            throw new Error('Player is already enrolled in this team');
        this.players.push(player);
    }

    removePlayerFromTeam(player: Player) {
        if (!player) throw new Error('Player is required');
        if (!this.players.includes(player))
            throw new Error('Player is not enrolled in this team');
        this.players = this.players.filter((teamPlayer) => teamPlayer.getId() !== player.getId());
    }

    addEventToSchedule(event: Event) {
        if (!event) throw new Error('Event is required');
        if (this.schedule.includes(event))
            throw new Error('Event is already in this team schedule');
        this.schedule.push(event);
    }

    removeEventFromSchedule(event: Event) {
        if (!event) throw new Error('Event is required');
        if (!this.schedule.includes(event))
            throw new Error('Event is not in this team schedule');
        this.schedule = this.schedule.filter((teamEvent) => teamEvent.getId() !== event.getId());
    }

    equals(team: Team): boolean {
        return (
            this.id === team.getId() &&
            this.name === team.getName() &&
            this.coach.equals(team.getCoach()) &&
            this.players.every((player, index) => player.equals(team.getPlayers()[index]))
        );
    }

    static from({
        id,
        name,
        coach,
        players,
        schedule,
    }: TeamPrisma & {
        coach: CoachPrisma & {
            user: UserPrisma;
            schedule: EventPrisma[];
        };
        players: (PlayerPrisma & { user: UserPrisma })[];
        schedule: EventPrisma[];
    }) {
        return new Team({
            id,
            name,
            coach: Coach.from(coach),
            players: players.map((player) => Player.from(player)),
            schedule: schedule.map((event) => Event.from(event)),
        });
    }
}
