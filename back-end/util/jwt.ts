import jwt from 'jsonwebtoken';
import { Role } from '../types';

const generateJwtToken = ({ firstName, lastName, role }: { firstName: string; lastName: string; role: Role }): string => {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined.');
    }

    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'TeamTrackr_app' };

    try {
        return jwt.sign({ firstName, lastName, role }, secretKey, options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
};

export { generateJwtToken };
