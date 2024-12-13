import express, { NextFunction, Request, Response } from 'express';
import teamService from '../service/team.service';
import { TeamInput, EnrollmentInput, Role } from '../types';

const teamRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         coach:
 *           $ref: '#/components/schemas/CoachInput'
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlayerInput'
 *         schedule:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventInput'
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         coach:
 *           $ref: '#/components/schemas/CoachInput'
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlayerInput'
 *         schedule:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventInput'
 *     EnrollmentInput:
 *       type: object
 *       properties:
 *         team:
 *           $ref: '#/components/schemas/TeamInput'
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlayerInput'
 *     CoachInput:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         user:
 *           $ref: '#/components/schemas/UserInput'
 *         rank:
 *           type: string
 *         events:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EventInput'
 *     PlayerInput:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         user:
 *           $ref: '#/components/schemas/UserInput'
 *         playernumber:
 *           type: string
 *     EventInput:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         start:
 *           type: string
 *           format: date-time
 *         end:
 *           type: string
 *           format: date-time
 *     UserInput:
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
 *         password:
 *           type: string
 *         role:
 *           type: string
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the team of a coach or if the user is an admin, a list of all teams.
 *     responses:
 *       200:
 *         description: The team of a coach or if the user is an admin, a list of all teams.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
teamRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { firstName, lastName, role } = request.auth;
        const teams = await teamService.getAllTeams({ firstName, lastName, role });
        res.status(200).json(teams);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Create a new team with an existing coach.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TeamInput'
 *            example:
 *              name: "Team A"
 *              coach:
 *                id: 6
 *              players:
 *                - id: 13
 *                - id: 14
 *              schedule:
 *                - id: 9
 *                - id: 10
 *      responses:
 *         200:
 *            description: The created team.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Team'
 */
teamRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const team = <TeamInput>req.body;
        const result = await teamService.createTeam({ ...team, role });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/addPlayers:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Add players to a team.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EnrollmentInput'
 *      responses:
 *         200:
 *            description: The team with all players.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Team'
 */
teamRouter.post('/addPlayers', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = <EnrollmentInput>req.body;
        const result = await teamService.addPlayersToTeam(team);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { teamRouter };
