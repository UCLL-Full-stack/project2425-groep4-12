export type Role = "Admin" | "Coach" | "Player" | "Guest"

export interface User {
    userId?: number;
    firstName: string;
    lastName: string;
    password: string;
    role?: Role;
    attendance?: number;
}

export type Event = {
    id?: number;
    name: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
}

export type Team = {
    teamId?: number;
    members?: Array<User>;
    coach: User;
}

export type StatusMessage = {
    message: string;
    type: "error" | "success";
}