import { Router } from 'express';
import restaurantRoutes from './restaurants';
import { adminController } from '../controllers';

const router = Router();

router.use('/restaurants', restaurantRoutes);
router.post('/admin/reload', adminController.reloadData);

export { router as apiRoutes };
export { adminController };
