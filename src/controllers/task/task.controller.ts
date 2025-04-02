import express from 'express';
import { authToken } from '../../middleware/auth/auth.middleware';
import { createTask, fetchTasks, fetchTask, updateTask, removeTask } from '../../services/task/task.service';
const router = express.Router();
router.post('/create-task',
    authToken,
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
)
export default router;
