import { Admin } from '../model/Admin';
import adminDb from '../repository/admin.db';
import { Role } from '../types';
import { UnauthorizedError } from 'express-jwt';

const getAllAdmins = async ({role}: {role: Role}): Promise<Admin[]> => {
    if (role === 'ADMIN') {
        return adminDb.getAllAdmins();
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};
const getAdminById = async (id: number): Promise<Admin> => {
    const admin = await adminDb.getAdminById({ id });
    if (!admin) throw new Error(`Admin with id ${id} does not exist.`);
    return admin;
};

const createAdmin = async (userId: number): Promise<void> => {
    await adminDb.createAdmin(userId);
};

export default { getAllAdmins, getAdminById, createAdmin };
