import express, { NextFunction, Request, Response } from 'express';
import adminService from '../service/admin.service';

const adminRouter = express.Router();

/**
 * @swagger
 * /admins:
 *   get:
 *     
 *     summary: Get a list of all admins.
 *     responses:
 *       200:
 *         description: A list of admins.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/admin'
 */
adminRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admins = await adminService.getAllAdmins();
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