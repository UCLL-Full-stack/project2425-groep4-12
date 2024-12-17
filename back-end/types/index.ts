type Role = "ADMIN" | "COACH" | "PLAYER";

type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    attendance: number | null;
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
};


export {
    Role, UserInput,
}