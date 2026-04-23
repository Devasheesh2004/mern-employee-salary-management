import express from "express";
import {
    viewDataOvertime,
    viewDataOvertimeByID,
    createDataOvertime,
    deleteDataOvertime
} from "../controllers/DataOvertimeController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/data_overtime', verifyUser, adminOnly, viewDataOvertime);
router.get('/data_overtime/id/:id', verifyUser, adminOnly, viewDataOvertimeByID);
router.post('/data_overtime', verifyUser, adminOnly, createDataOvertime);
router.delete('/data_overtime/:id', verifyUser, adminOnly, deleteDataOvertime);

export default router;
