import { Request, Response, Router, NextFunction } from "express";
import RequestValidator from "../middlewares/requestValidator";

const router: Router =  Router();

router.get('/products/:id', RequestValidator.validate, (req: Request, res: Response) => {
    res.status(200).json({ id: req.params.id });
});

export default router;

