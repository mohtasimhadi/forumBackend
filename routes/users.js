import express from 'express'

import { signin, signup} from '../controllers/user.js'
const router = express.Router()

router.post('/signIn', signin)
router.post('/signUp', signup)

export default router;