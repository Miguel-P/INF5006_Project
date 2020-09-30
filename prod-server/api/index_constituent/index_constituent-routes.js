import express from 'express';
var router = express.Router();
import * as controller from './index_constituent-controller'; // in other words, whenever these routes are
// accessed, the controller task will perform the action

router.get('/index_constituents', controller.get_all);
export default router;