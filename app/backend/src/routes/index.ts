import { Router } from 'express';
import authRoutes from './auth.js';
import vehicleRoutes from './vehicles.js';
import driverRoutes from './drivers.js';
import fuelRoutes from './fuel.js';
import materialRoutes from './materials.js';
import systemRoutes from './system.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/fuel', fuelRoutes);
router.use('/materials', materialRoutes);
router.use('/system', systemRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      drivers: '/api/drivers',
      fuel: '/api/fuel',
      materials: '/api/materials',
      system: '/api/system'
    }
  });
});

export default router;