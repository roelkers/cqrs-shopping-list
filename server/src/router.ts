import { Router } from "express";
import events from "./events";
import lists from "./lists";
import products from "./products";

const router = Router();

router.use(events);
router.use(products);
router.use(lists);

export default router;
