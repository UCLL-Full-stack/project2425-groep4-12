import database from '../util/database';
import { Admin } from '../model/Admin';

const createAdmin = async (userId: number): Promise<void> => {
    try {
        await database.admin.create({
            data: {
                userId,
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllAdmins = async (): Promise<Admin[]> => {
    try {
        const adminsPrisma = await database.admin.findMany({
            include: { user: true },
        });
        return adminsPrisma.map((adminPrisma) => Admin.from(adminPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAdminById = async ({ id }: { id: number }): Promise<Admin | null> => {
    try {
        const adminPrisma = await database.admin.findUnique({
            where: { id },
            include: { user: true },
        });

        return adminPrisma ? Admin.from(adminPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createAdmin,
    getAllAdmins,
    getAdminById,
};
