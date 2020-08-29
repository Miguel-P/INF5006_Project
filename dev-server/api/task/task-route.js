import express from 'express';
const router = express.Router();
import * as controller from './tasks-controller';

// in other words, whenever these routes are
// accessed, the controller task will perform the action

router.post('/task', controller.create);

router.get('/task',controller.show);

router.get('/task/:id', controller.update);

router.put('/task', controller.create);

router.delete('/task', controller.remove);

export default router;