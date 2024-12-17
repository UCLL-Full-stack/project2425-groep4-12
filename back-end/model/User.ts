import { Role } from "../types";
import {
    User as UserPrisma
} from '@prisma/client';


export class User {
    private id? : number ;
    private firstName : string;
    private lastName : string;
    private email : string;
    private password : string;
    private role : Role;

    constructor (user: {
        id? : number;
        firstName : string;
        lastName : string;
        email : string;
        password : string;
        role : Role;
    }) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
    }
    getid(): number | undefined {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getPassword(): string {
        return this.password;
    }

    getEmail(): string {
        return this.email;
    }

    getRole(): Role {
        return this.role;
    }

    

    validate(user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: Role;
    }) {
        
        if (!user.firstName?.trim()) {
            throw new Error('First name is required');
        }
        if (!user.lastName?.trim()) {
            throw new Error('Last name is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
        if (!user.role) {
            throw new Error('Role is required');
        }
        if (user.role !== 'ADMIN' && user.role !== 'COACH' && user.role !== 'PLAYER') {
            throw new Error('Role must be either ADMIN, COACH or PLAYER');
        }
    }

    equals(user: User): boolean {
        return (
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.role === user.getRole()
        );
    }

    static from({ id, firstName, lastName, email, password, role }: UserPrisma) {
        return new User({
            id,
            firstName,
            lastName,
            email,
            password,
            role: role as Role,
        });
    }
}
