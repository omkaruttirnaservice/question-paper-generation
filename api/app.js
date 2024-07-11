import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import upload from 'express-fileupload';
import indexRoutes from './routes/indexRoutes.js';
import cors from 'cors';
import sequelize from './application/config/db-connect-migration.js';

const app = express();
dotenv.config();

app.use(upload());
app.use(cors());
app.use(json({ limit: '1024mb' }));
app.use(urlencoded({ extended: true, limit: '1024mb' }));
app.use(cookieParser());

sequelize
	.authenticate()
	.then()
	.catch((err) =>
		console.log(err, '==1=======database connection======================err==')
	);

app.use('/api', indexRoutes);

app.listen(process.env.PORT, () => {
	console.log('Server started on', process.env.PORT);
});
