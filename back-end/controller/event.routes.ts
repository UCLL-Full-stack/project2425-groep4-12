
import express, { NextFunction, Request, Response } from 'express';
import eventService from '../service/event.service';

const eventRouter = express.Router();

/**
 * @swagger
 * /events/{id}:
 *  get:
 *      security:
 *      summary: Get a event by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The event id.
 *      responses:
 *          200:
 *              description: A event object.
 *              content:
 *                  application/json:
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
 *     summary: Get a list of all events
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Event'
 */

eventRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await eventService.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
});

export { eventRouter };
