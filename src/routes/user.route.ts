import express from 'express';

const router = express.Router();
import { find, get, update, remove, create } from '../controller/user.controller';

router.get("/", find);
router.post("/", create);
router.get("/:id", get);
router.put("/:id", update);
router.delete('/:id', remove)


export = router