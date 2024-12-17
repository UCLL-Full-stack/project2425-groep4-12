
import express, { NextFunction, Request, Response } from 'express';
import teamService from '../service/team.service';
import { TeamInput, Role, CoachInput, EventInput } from '../types';

const scheduleRouter = express.Router();

/**
 * @swagger
 * /schedules:
 *   get:
 *     
 *     summary: Get the schedule of a lecturer or if the user is an admin, a list of all schedules.
 *     responses:
 *       200:
 *         description: The schedule of a lecturer or if the user is an admin, a list of all schedules.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
scheduleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Create a new schedule for an existing lecturer and course.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ScheduleInput'
 *      responses:
 *         200:
 *            description: The created schedule.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Schedule'
 */
scheduleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schedule = <ScheduleInput>req.body;
        const result = await scheduleService.createSchedule(schedule);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules/enroll:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Enroll students to a schedule.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EnrollmentInput'
 *      responses:
 *         200:
 *            description: The schedule with all students enrolled.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Schedule'
 */
scheduleRouter.post('/enroll', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schedule = <EnrollmentInput>req.body;
        const result = await scheduleService.addStudentsToSchedule(schedule);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { scheduleRouter };
