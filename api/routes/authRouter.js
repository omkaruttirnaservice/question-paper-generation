import express from 'express';
import loginController from '../application/controllers/loginController.js';

const router = express.Router();

router.post('/login', loginController.login);

// getting list of databases on login page
router.get('/databases', async (req, res, next) => {
    try {
        const databasesList = await getDatabasesList({ db_type: process.env.NODE_ENV });
        return res.status(200).json({
            success: true,
            data: databasesList,
        });
    } catch (error) {
        next(error);
    }
});

const getDatabasesList = async ({ db_type }) => {
    try {
        const resp = await fetch('https://lab.uttirna.in/api/get-db-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                db_type,
                is_show_in_master: 0,
                is_show_in_qpde_panel: 1,
            }),
        });
        if (!resp.ok) {
            throw new Error('Failed to fetch database list');
        }
        const data = await resp.json();
        return data?.data || [];
    } catch (error) {
        throw error;
    }
};

export default router;
