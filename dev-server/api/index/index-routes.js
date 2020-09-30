import express from 'express';
const router = express.Router();
import * as controller from './index-controller';

// The controller task will perform the action
router.get('/indexes',controller.get_all);

router.get('/indexes/:indexCode/date/:date',controller.get_index);

export default router;