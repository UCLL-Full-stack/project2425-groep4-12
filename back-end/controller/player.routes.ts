import express, { NextFunction, Request, Response } from 'express';
import playerService from '../service/player.service';

const playerRouter = express.Router();

/**
 * @swagger
 * /players:
 *   get:
 *     
 *     summary: Get a list of all players.
 *     responses:
 *       200:
 *         description: A list of players.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Player'
 */
playerRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const players = await playerService.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /players/{id}:
 *  get:
 *      summary: Get a player by id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The player id.
 *      responses:
 *          200:
 *              description: A player object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/player'
 */
playerRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const player = await playerService.getPlayerById(Number(req.params.id));
        res.status(200).json(player);
    } catch (error) {
        next(error);
    }
});

export { playerRouter };