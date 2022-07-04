import { entryIn, entryOut, getEntries, deleteEntry } from "../controllers/entryController.js";
import { Router } from "express";
import validateUser from "../middleware/validateUser.js";
import validateEntryIn from "../middleware/validateEntryIn.js";
import validateEntryOut from "../middleware/validateEntryOut.js";

const router = Router();

router.post("/entryin", validateEntryIn,entryIn)
router.post("/entryout", validateEntryOut, entryOut)
router.get("/entries", validateUser, getEntries)
router.delete("/entries/:id", deleteEntry)

export default router;