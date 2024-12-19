import express, { NextFunction, Request, Response } from 'express';
import adminService from '../service/admin.service';
import { Role } from '../types';

const adminRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all admins.
 *     responses:
 *       200:
 *         description: A list of admins.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Admin'
 */
adminRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { firstName, lastName, role } = request.auth;
        const admins = await adminService.getAllAdmins({role});
        res.status(200).json(admins);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /admins/{id}:
 *  get:
 *      summary: Get a admin by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The admin id.
 *      responses:
 *          200:
 *              description: A admin object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/admin'
 */
adminRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = await adminService.getAdminById(Number(req.params.id));
        res.status(200).json(admin);
    } catch (error) {
        next(error);
    }
});

export { adminRouter };