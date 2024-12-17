import express, { NextFunction, Request, Response } from 'express';
import coachService from '../service/coach.service';

const coachRouter = express.Router();

/**
 * @swagger
 * /coaches:
 *   get:
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
        const coaches = await coachService.getAllCoaches();
        res.status(200).json(coaches);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /coaches/{id}:
 *  get:
 *      summary: Get a coach by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The coach id.
 *      responses:
 *          200:
 *              description: A coach object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Coach'
 */
coachRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coach = await coachService.getCoachById(Number(req.params.id));
        res.status(200).json(coach);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /coaches/promote:
 *   post:
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
        const coach = await coachService.promoteCoach({ id: Number(req.body.id), rank: req.body.rank });
        res.status(200).json(coach);
    } catch (error) {
        next(error);
    }
});

export { coachRouter };
