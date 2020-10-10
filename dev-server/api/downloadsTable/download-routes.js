import express from 'express';
const router = express.Router();
import * as controller from './download-controller';

// The controller task will perform the action
router.get('/downloads',controller.get_all);

router.get('/downloads/dates',controller.get_dates);

router.get('/downloads/indextable/:proxy/date/:date/period/:period',controller.get_indextable);

router.get('/downloads/sharetable/:proxy/date/:date/period/:period',controller.get_sharetable);

export default router;