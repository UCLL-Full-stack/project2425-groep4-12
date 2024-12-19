import express, { NextFunction, Request, Response } from 'express';
import eventService from '../service/event.service';
import { Role } from '../types';

const eventRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get an event by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The event id.
 *     responses:
 *       200:
 *         description: An event object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
eventRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await eventService.getEventById(Number(req.params.id));
        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /events:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all events
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
eventRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        try {
            console.log("hello");
        } catch (logError) {
            console.error("Logging error:", logError);
        }
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { firstName, lastName, role } = request.auth;
        const events = await eventService.getAllEvents({ firstName, lastName, role });
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

export { eventRouter };
