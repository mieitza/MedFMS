import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import vehicleRoutes from './vehicles.js';
import driverRoutes from './drivers.js';
import fuelRoutes from './fuel.js';
import maintenanceRoutes from './maintenance.js';
import materialRoutes from './materials.js';
import systemRoutes from './system.js';
import documentRoutes from './documents.js';
import reportRoutes from './reports.js';
import adminRoutes from './admin.js';
import dashboardRoutes from './dashboard.js';
import vehicleInventoryRoutes from './vehicleInventory.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/fuel', fuelRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/materials', materialRoutes);
router.use('/vehicle-inventory', vehicleInventoryRoutes);
router.use('/system', systemRoutes);
router.use('/documents', documentRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      vehicles: '/api/vehicles',
      drivers: '/api/drivers',
      fuel: '/api/fuel',
      maintenance: '/api/maintenance',
      materials: '/api/materials',
      vehicleInventory: '/api/vehicle-inventory',
      system: '/api/system',
      documents: '/api/documents',
      reports: '/api/reports',
      admin: '/api/admin',
      dashboard: '/api/dashboard'
    }
  });
});

export default router;