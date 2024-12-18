type Role = "ADMIN" | "COACH" | "PLAYER";

type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
}

type CoachInput = {
    id?: number;
    user: UserInput;
    rank: string;
    events: EventInput[];
};

type PlayerInput = {
    id?: number;
    user: UserInput;
    playernumber: string;
};

type EventInput = {
    id?: number;
    name:        String;
    description: String;
    location:    String;
    start:       Date;
    end:         Date;
};

type TeamInput = {
    id?: number;
    name: string;
    coach: CoachInput;
    players: PlayerInput[];
    schedule: EventInput[];
};

type AuthenticationResponse = {
    token: string;
    firstName: string;
    lastName: string;
    role: string;
};

type EnrollmentInput = {
    team: TeamInput;
    players: PlayerInput[];
};

export {
    Role, UserInput, CoachInput, PlayerInput, EventInput, TeamInput, AuthenticationResponse, EnrollmentInput
}