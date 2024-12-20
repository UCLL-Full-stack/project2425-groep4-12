import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { playerRouter } from './controller/player.routes';
import { coachRouter } from './controller/coach.routes';
import { eventRouter } from './controller/event.routes';
import { teamRouter } from './controller/team.routes';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import { adminRouter } from './controller/admin.routes';

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            connectSrc: ["'self'", 'https://api.ucll.be'],
        },
    })
);

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
        requestProperty: 'auth',
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/signup', '/status'],
    })
);

app.use(cors({ origin: ['http://localhost:8080'] }));
app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/players', playerRouter);
app.use('/coaches', coachRouter);
app.use('/events', eventRouter);
app.use('/teams', teamRouter);
app.use('/admins', adminRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'TeamTrackr API is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TeamTrackrs API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'TeamTrackrsError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

app.listen(port, () => {
    console.log(`TeamTrackrs API is running on port ${port}.`);
});
