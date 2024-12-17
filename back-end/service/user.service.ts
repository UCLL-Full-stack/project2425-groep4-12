import userDB from '../repository/user.db';
import playerService from './player.service';
import coachService from './coach.service';
import { User } from '../model/User';
import { AuthenticationResponse, UserInput } from '../types';
import { generateJwtToken } from '../util/jwt';
import bcrypt from 'bcrypt';


const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();

const getUserByUsername = async ({ firstName, lastName }: { firstName: string; lastName: string }): Promise<User> => {
    const user = await userDB.getUserByFirstAndLastname({ firstName, lastName });
    if (!user) {
        throw new Error(`User ${firstName + " " + lastName} does not exist.`);
    }
    return user;
};

const createUser = async ({
    firstName,
    lastName,
    email,
    password,
    role,
}: UserInput): Promise<User> => {
    const existingUser = await userDB.getUserByFirstAndLastname({ firstName, lastName });

    if (existingUser) {
        throw new Error(`User ${firstName + " " + lastName} is already registered.`);
    }

    const hashedpassword = await bcrypt.hash(password, 12);
    const user = new User({ firstName, lastName, password: hashedpassword, email, role });

    const createdUser = await userDB.createUser(user);

    if (role === 'PLAYER') {
        await playerService.createPlayer(createdUser.getid()!);
    } else if (role === 'COACH') {
        await coachService.createCoach(createdUser.getid()!);
    }

    return createdUser;
};

const authenticate = async ({ firstName, lastName, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await getUserByUsername({ firstName, lastName });

    const isValidPassword = await bcrypt.compare(password, user.getPassword());

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }
    return {
        token: generateJwtToken({ firstName: user.getFirstName(), lastName: user.getLastName(), role: user.getRole() }),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        role: user.getRole(),
    };
};

export default { getUserByUsername, createUser, getAllUsers, authenticate };
