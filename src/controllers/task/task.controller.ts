import express from 'express';
import { authToken } from '../../middleware/auth/auth.middleware';

import { createTask, fetchTasks, fetchTask, updateTask, removeTask, searchTask } from '../../services/task/task.service';
import schemaValidator from '../../helper/schemaValidator';
const router = express.Router();
router.post('/create-task',
    authToken,
    schemaValidator("/task/create-task"),
    createTask
);
router.get('/fetch-tasks',
    authToken,
    fetchTasks
);
router.get('/fetch-task/:id',
    authToken,
    fetchTask
);
router.put('/update-task/:id',
    authToken,
    updateTask
);
router.delete('/remove-task/:id',
    authToken,
    removeTask
);
router.get('/search-task',
    authToken,
    searchTask
)
export default router;
