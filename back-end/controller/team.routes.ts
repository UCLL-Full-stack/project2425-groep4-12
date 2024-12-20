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
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *         schedule:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         coach:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *         schedule:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *     EnrollmentInput:
 *       type: object
 *       properties:
 *         team:
 *           $ref: '#/components/schemas/TeamInput'
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               user:
 *                 $ref: '#/components/schemas/UserInput'
 *               playernumber:
 *                 type: string
 *     EventInput:
 *       type: object
 *       properties:
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
 *     Coach:
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
 *         rank:
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
 *                  example:
 *                    name: "Team A"
 *                    coach:
 *                      id: 6
 *                    players:
 *                      - id: 13
 *                      - id: 14
 *                    schedule:
 *                      - id: 9
 *                      - id: 10
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
 *              type: object
 *              properties:
 *                teamId:
 *                  type: number
 *                playerIds:
 *                  type: array
 *                  items:
 *                    type: number
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
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const { teamId, playerIds } = req.body;
        const result = await teamService.addPlayersToTeam({ teamId, playerIds, role });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a team by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team to delete.
 *     responses:
 *       200:
 *         description: The deleted team.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 */
teamRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const id = { id: Number(req.params.id) };
        const result = await teamService.deleteTeam({...id, role});
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/removePlayer:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Remove a player from a team.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                teamId:
 *                  type: number
 *                playerId:
 *                  type: number
 *      responses:
 *         200:
 *            description: The updated team after removing the player.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Team'
 */
teamRouter.post('/removePlayer', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const { teamId, playerId } = req.body;
        const result = await teamService.removePlayerFromTeam({ teamId, playerId, role });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/addEvents:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Add events to a team's schedule.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                teamId:
 *                  type: number
 *                event:
 *                  $ref: '#/components/schemas/EventInput'
 *      responses:
 *         200:
 *            description: The team with the updated schedule.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Team'
 */
teamRouter.post('/addEvents', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const { teamId, event } = req.body;
        const result = await teamService.addEventToTeamSchedule({ teamId, event, role });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/removeEvent:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Remove an event from a team's schedule.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                teamId:
 *                  type: number
 *                eventId:
 *                  type: number
 *      responses:
 *         200:
 *            description: The team with the updated schedule after removing the event.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Team'
 */
teamRouter.post('/removeEvent', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const { teamId, eventId } = req.body;
        const result = await teamService.removeEventFromTeamSchedule({ teamId, eventId, role });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a team by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the team to retrieve.
 *     responses:
 *       200:
 *         description: The team with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 */
teamRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { firstName: string; lastName: string; role: Role } };
        const { role } = request.auth;
        const id = Number(req.params.id);
        const result = await teamService.getTeamById({ id, role });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { teamRouter };
