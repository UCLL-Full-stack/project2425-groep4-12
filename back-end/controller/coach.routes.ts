import express, { NextFunction, Request, Response } from 'express';
import coachService from '../service/coach.service';
import { Role } from '../types';

const coachRouter = express.Router();

/**
 * @swagger
 * /coaches:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all coaches.
 *     responses:
 *       200:
 *         description: A list of coaches.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Coach'
 */
coachRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { firstName, lastName, role } = request.auth;
        const coaches = await coachService.getAllCoaches({ firstName, lastName, role });
        res.status(200).json(coaches);
    } catch (error) {
        next(error);
    }
});



/**
 * @swagger
 * /coaches/promote:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Promote a coach to a higher rank
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  rank:
 *                      type: string
 *      responses:
 *         200:
 *            description: The promoted coach object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Coach'
 */

coachRouter.post('/promote', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const coach = await coachService.promoteCoach({ id: Number(req.body.id), rank: req.body.rank, role });
        res.status(200).json(coach);
    } catch (error) {
        next(error);
    }
});

export { coachRouter };
