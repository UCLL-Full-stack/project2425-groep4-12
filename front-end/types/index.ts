export type Role = "ADMIN" | "COACH" | "PLAYER";

export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
}

export type Coach = {
    id?: number;
    user: User;
    rank: string;
    events: Event[];
}

export type Player = {
    id?: number;
    user: User;
    playernumber: string;
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
    id: number;
    name: string;
    coach: Coach;
    players: Player[];
    schedule: Event[];
}

export type AuthenticationResponse = {
    token: string;
    firstName: string;
    lastName: string;
    role: string;
}

export type Enrollment = {
    team: Team;
    players: Player[];
}

export type StatusMessage = {
    message: string;
    type: "error" | "success";
}