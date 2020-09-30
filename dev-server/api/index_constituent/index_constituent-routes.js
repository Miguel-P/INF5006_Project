import express from 'express';
const router = express.Router();
import * as controller from './index_constituent-controller';

// The controller task will perform the action
router.get('/index_constituents',controller.get_all);

router.get('/index_constituents/:constituentCode/index/:indexCode/date/:date',controller.get_constituent);

export default router;