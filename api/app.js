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
	.then((res) => console.log(res, '==res=='))
	.catch((err) => console.log(err, '==1=============================err=='));

app.use('/api', indexRoutes);

// import sequelize from './application/config/db-connect-migration.js';
// import tm_master_test_list from './application/Migration_Scripts/tm_master_test_list.js';
// import tm_mega_question_set from './application/Migration_Scripts/tm_mega_question_set.js';
// import tm_main_topic_list from './application/Migration_Scripts/tm_main_topic_list.js';
// import tm_sub_topic_list from './application/Migration_Scripts/tm_sub_topic_list.js';

// import tm_test_user_master_list from './application/Migration_Scripts/tm_test_user_master_list.js';
// import tm_test_question_sets from './application/Migration_Scripts/tm_test_question_sets.js';

// sequelize
// 	.sync()
// 	.then(() => {})
// 	.catch((error) => console.log(error));

app.listen(process.env.PORT, () => {
	console.log('Server started on', process.env.PORT);
});
