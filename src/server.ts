import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import databaseConfiguration from './config/db/databaseConfig.config';
import authRoute from './controllers/auth/auth.controller';
import taskRoute from './controllers/task/task.controller';
import notFoundMiddleware from './handlers/404handler';
import errorHandlerMiddleware from './handlers/errorhandler';
import trackIncomingRequest from './utils/timerMiddleware.timer';
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true
}));
app.use(helmet());
const PORT: string | number = process.env.PORT as string | number|| 8000;
if (process.env.NODE_ENV as string === 'development') {
    app.use(morgan('dev'));
    console.log(morgan('dev'));
}
// Register routes
app.use(`/api/${process.env.API_VERSION}/auth`, authRoute);
app.use(`/api/${process.env.API_VERSION}/task`, taskRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(trackIncomingRequest);
const launchServer = async() => {
    try {
        await databaseConfiguration(),
        app.listen(PORT, () => {
        console.log(`Server is  owned by ${process.env.APP_NAME as string | number} 
            running on port ${PORT as string | number} ${process.env.APP_HOST as string | number} on
            api/${process.env.API_VERSION as string | number} 
            .`
        );
       });
    } catch (error) {
        console.log('Failed to connect to the database')
    }
}

launchServer();

