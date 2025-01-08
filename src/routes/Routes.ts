import { Request, Response, Router } from "express";
import RequestValidator from "../middlewares/requestValidator";

const router: Router =  Router();


router.use(RequestValidator.validate)
router.get('/products/:id', (req: Request, res: Response) => {
    res.status(200).json('Helo World');
});

export default router;

