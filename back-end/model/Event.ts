import { Event as EventPrisma } from '@prisma/client';

export class Event {
    private id?: number;
    private name: string;
    private description: string;
    private location: string;
    private start: Date;
    private end: Date;

    constructor(event: {
        id?: number;
        name: string;
        description: string;
        location: string;
        start: Date;
        end: Date;
    }) {
        this.validate(event);

        this.id = event.id;
        this.name = event.name;
        this.description = event.description;
        this.location = event.location;
        this.start = event.start;
        this.end = event.end;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getLocation(): string {
        return this.location;
    }

    getStart(): Date {
        return this.start;
    }

    getEnd(): Date {
        return this.end;
    }

    validate(event: { name: string; description: string; location: string; start: Date; end: Date }) {
        if (!event.start || !event.end) {
            throw new Error('Start and end date are required');
        }
        if (event.start < new Date()) {
            throw new Error('Start date cannot be in the past');
        }
        if (event.end < new Date()) {
            throw new Error('End date cannot be in the past');
        }
        if (event.start === event.end) {
            throw new Error('Start and end date cannot be the same');
        }
        if (event.start > event.end) {
            throw new Error('Start date cannot be after end date');
        }
        if (!event.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!event.description?.trim()) {
            throw new Error('Description is required');
        }
        if (!event.location.trim()) {
            throw new Error('Location is required');
        }
    }

    equals(event: Event): boolean {
        return (
            this.name === event.getName() &&
            this.description === event.getDescription() &&
            this.location === event.getLocation() &&
            this.start === event.start &&
            this.end === event.end
        );
    }

    static from({ id, name, description, location, start, end }: EventPrisma) {
        return new Event({
            id,
            name,
            description,
            location,
            start,
            end,
        });
    }
}
