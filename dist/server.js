import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import databaseConfiguration from './config/db/databaseConfig.config';
import authRoutes from './controllers/auth/auth.controller';
import notFoundMiddleware from './handlers/404handler';
import errorHandlerMiddleware from './handlers/errorhandler';
import trackIncomingRequest from './utils/timerMiddleware.timer';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(helmet());
const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(morgan('dev'));
}
app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(trackIncomingRequest);
const launchServer = async () => {
    try {
        await databaseConfiguration(),
            app.listen(PORT, () => {
                console.log(`Server is  owned by ${process.env.APP_NAME} 
            running on port ${PORT} ${process.env.APP_HOST} on
            api/${process.env.API_VERSION} 
            .`);
            });
    }
    catch (error) {
        console.log('Failed to connect to the database');
    }
};
launchServer();
//# sourceMappingURL=server.js.map