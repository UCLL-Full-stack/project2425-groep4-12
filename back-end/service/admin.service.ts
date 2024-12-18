import { Admin } from '../model/Admin';
import adminDb from '../repository/admin.db';

const getAllAdmins = async (): Promise<Admin[]> => adminDb.getAllAdmins();

const getAdminById = async (id: number): Promise<Admin> => {
    const admin = await adminDb.getAdminById({ id });
    if (!admin) throw new Error(`Admin with id ${id} does not exist.`);
    return admin;
};

const createAdmin = async (userId: number): Promise<void> => {
    await adminDb.createAdmin(userId);
};

export default { getAllAdmins, getAdminById, createAdmin };
