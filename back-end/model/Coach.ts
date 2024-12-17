import {
    Event as EventPrisma,
    Coach as CoachPrisma,
    User as UserPrisma,
} from '@prisma/client';
import { User } from './User';
import { Event } from './Event';

export class Coach {
    private id?: number;
    private user: User;
    private rank: string;
    private schedule: Event[];

    constructor(coach: { schedule: Event[]; user: User; rank: string; id?: number }) {
        this.validate(coach);

        this.id = coach.id;
        this.user = coach.user;
        this.schedule = coach.schedule;
        this.rank = coach.rank;
    }

    validate(coach: { schedule: Event[]; user: User; rank: string }) {
        if (!coach.user) {
            throw new Error('User is required');
        }
        if (!coach.rank) {
            throw new Error('Rank is required');
        }
        if (!coach.schedule) {
            throw new Error('Schedule is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getRank(): string {
        return this.rank;
    }

    getSchedule(): Event[] {
        return this.schedule;
    }

    equals(coach: Coach): boolean {
        return (
            this.id === coach.getId() &&
            this.user.equals(coach.getUser()) &&
            this.schedule.every((event, index) => event.equals(coach.getSchedule()[index])) &&
            this.rank === coach.getRank()
        );
    }

    static from({
        id,
        user,
        schedule,
        rank,
    }: CoachPrisma & { user: UserPrisma; schedule: EventPrisma[] }) {
        return new Coach({
            id,
            user: User.from(user),
            schedule: schedule.map((event) => Event.from(event)),
            rank,
        });
    }
}
