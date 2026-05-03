import express from 'express'
import tryCatch from '../../../utils/tryCatch';
import { tokenController } from '../controller/token.controller';

const router = express.Router();

router.route("/new").get(tryCatch(tokenController))
export default router;