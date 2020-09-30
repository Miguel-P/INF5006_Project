import express from 'express';
var router = express.Router();
import * as controller from './register.controller';
router.post('/register', controller.index);
export default router;