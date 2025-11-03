import { getDb, initDatabase } from './index.js';
import {
  maintenanceTypes,
  maintenanceWorkOrders,
  maintenanceSchedules,
  maintenanceHistory,
  maintenanceAlerts
} from './schema/maintenance.js';
import { vehicles } from './schema/vehicles.js';
import { users } from './schema/users.js';
import { logger } from '../utils/logger.js';

async function seedMaintenanceData() {
  try {
    logger.info('Starting maintenance data seeding...');

    // Initialize database connection
    await initDatabase();
    const db = getDb();

    // First, let's get some existing vehicles and users
    const existingVehicles = await db.select().from(vehicles).limit(10);
    const existingUsers = await db.select().from(users).limit(5);

    if (existingVehicles.length === 0) {
      logger.warn('No vehicles found. Please seed vehicles first.');
      return;
    }

    if (existingUsers.length === 0) {
      logger.warn('No users found. Please seed users first.');
      return;
    }

    // Insert maintenance types
    const maintenanceTypesData = [
      {
        typeCode: 'OIL_CHANGE',
        typeName: 'Oil Change',
        category: 'preventive',
        description: 'Regular engine oil and filter change',
        estimatedDuration: 60,
        estimatedCost: 75.00,
        priority: 3
      },
      {
        typeCode: 'BRAKE_INSPECT',
        typeName: 'Brake Inspection',
        category: 'inspection',
        description: 'Comprehensive brake system inspection',
        estimatedDuration: 90,
        estimatedCost: 120.00,
        priority: 2
      },
      {
        typeCode: 'TIRE_ROTATION',
        typeName: 'Tire Rotation',
        category: 'preventive',
        description: 'Rotate tires for even wear',
        estimatedDuration: 45,
        estimatedCost: 50.00,
        priority: 4
      },
      {
        typeCode: 'ENGINE_REPAIR',
        typeName: 'Engine Repair',
        category: 'corrective',
        description: 'Engine diagnostic and repair',
        estimatedDuration: 480,
        estimatedCost: 800.00,
        priority: 1
      },
      {
        typeCode: 'AC_SERVICE',
        typeName: 'A/C Service',
        category: 'preventive',
        description: 'Air conditioning system service',
        estimatedDuration: 120,
        estimatedCost: 150.00,
        priority: 3
      },
      {
        typeCode: 'BATTERY_TEST',
        typeName: 'Battery Test',
        category: 'inspection',
        description: 'Battery and charging system test',
        estimatedDuration: 30,
        estimatedCost: 25.00,
        priority: 3
      },
      {
        typeCode: 'TRANSMISSION',
        typeName: 'Transmission Service',
        category: 'preventive',
        description: 'Transmission fluid change and inspection',
        estimatedDuration: 180,
        estimatedCost: 250.00,
        priority: 2
      },
      {
        typeCode: 'EMERGENCY_REPAIR',
        typeName: 'Emergency Repair',
        category: 'emergency',
        description: 'Urgent roadside or emergency repair',
        estimatedDuration: 120,
        estimatedCost: 300.00,
        priority: 1
      }
    ];

    const insertedMaintenanceTypes = await db.insert(maintenanceTypes)
      .values(maintenanceTypesData)
      .onConflictDoNothing()
      .returning();

    logger.info(`Inserted ${insertedMaintenanceTypes.length} maintenance types`);

    // Get all maintenance types for work orders
    const allMaintenanceTypes = await db.select().from(maintenanceTypes);

    // Create work orders with various statuses
    const workOrdersData = [];
    const statuses = ['pending', 'approved', 'in_progress', 'completed', 'cancelled'];
    const priorities = [1, 2, 3, 4, 5];

    for (let i = 0; i < 25; i++) {
      const vehicle = existingVehicles[i % existingVehicles.length];
      const maintenanceType = allMaintenanceTypes[i % allMaintenanceTypes.length];
      const user = existingUsers[i % existingUsers.length];
      const status = statuses[i % statuses.length];
      const priority = priorities[i % priorities.length];

      // Generate work order number
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
      const workOrderNumber = `WO${date.toISOString().slice(0, 10).replace(/-/g, '')}${String(i + 1).padStart(3, '0')}`;

      // Generate scheduled date (future for pending/approved, past for completed)
      let scheduledDate = new Date();
      if (status === 'pending' || status === 'approved') {
        scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 14)); // Next 2 weeks
      } else {
        scheduledDate.setDate(scheduledDate.getDate() - Math.floor(Math.random() * 14)); // Last 2 weeks
      }

      const workOrder = {
        workOrderNumber,
        vehicleId: vehicle.id,
        maintenanceTypeId: maintenanceType.id,
        title: `${maintenanceType.typeName} - ${vehicle.vehicleCode}`,
        description: `Scheduled ${maintenanceType.typeName.toLowerCase()} for ${vehicle.make} ${vehicle.model}`,
        priority,
        status,
        scheduledDate,
        requestedDate: date,
        estimatedCost: maintenanceType.estimatedCost + (Math.random() * 100 - 50), // Add some variance
        requestedBy: user.id,
        notes: status === 'pending' ? 'Awaiting approval' :
               status === 'approved' ? 'Approved for scheduling' :
               status === 'in_progress' ? 'Work in progress' :
               status === 'completed' ? 'Work completed successfully' :
               'Cancelled due to budget constraints',
        createdAt: date,
        updatedAt: new Date()
      };

      // Add approval info for non-pending orders
      if (status !== 'pending') {
        workOrder.approvedBy = existingUsers[0].id; // First user as manager
        workOrder.approvedAt = new Date(date.getTime() + 24 * 60 * 60 * 1000); // Next day
      }

      // Add start/completion dates for in-progress and completed orders
      if (status === 'in_progress') {
        workOrder.startedDate = new Date(scheduledDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
      } else if (status === 'completed') {
        workOrder.startedDate = new Date(scheduledDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        workOrder.completedDate = new Date(workOrder.startedDate.getTime() + maintenanceType.estimatedDuration * 60 * 1000);
        workOrder.laborHours = maintenanceType.estimatedDuration / 60 + (Math.random() * 2 - 1); // Add variance
      }

      workOrdersData.push(workOrder);
    }

    const insertedWorkOrders = await db.insert(maintenanceWorkOrders)
      .values(workOrdersData)
      .onConflictDoNothing()
      .returning();

    logger.info(`Inserted ${insertedWorkOrders.length} new work orders`);

    // If no new work orders were inserted, get existing ones for history creation
    let allWorkOrders = insertedWorkOrders;
    if (allWorkOrders.length === 0) {
      allWorkOrders = await db.select().from(maintenanceWorkOrders).limit(50);
      logger.info(`Using ${allWorkOrders.length} existing work orders for history creation`);
    }

    // Skip schedules and alerts for now - focus on maintenance history
    // They can be added after proper database migration
    /*
    // Create maintenance schedules for vehicles
    const schedulesData = [];
    for (let i = 0; i < existingVehicles.length; i++) {
      const vehicle = existingVehicles[i];

      // Oil change schedule (every 5000 km or 3 months)
      const oilChangeType = allMaintenanceTypes.find(t => t.typeCode === 'OIL_CHANGE');
      if (oilChangeType) {
        schedulesData.push({
          vehicleId: vehicle.id,
          maintenanceTypeId: oilChangeType.id,
          intervalType: 'kilometers',
          intervalValue: 5000,
          lastMaintenanceKm: vehicle.mileage || 0,
          nextMaintenanceKm: (vehicle.mileage || 0) + 5000,
          reminderKmBefore: 500,
          active: true
        });
      }

      // Brake inspection (every 12 months)
      const brakeType = allMaintenanceTypes.find(t => t.typeCode === 'BRAKE_INSPECT');
      if (brakeType) {
        const lastDate = new Date();
        lastDate.setMonth(lastDate.getMonth() - Math.floor(Math.random() * 6)); // Random in last 6 months
        const nextDate = new Date(lastDate);
        nextDate.setFullYear(nextDate.getFullYear() + 1);

        schedulesData.push({
          vehicleId: vehicle.id,
          maintenanceTypeId: brakeType.id,
          intervalType: 'months',
          intervalValue: 12,
          lastMaintenanceDate: lastDate,
          nextMaintenanceDate: nextDate,
          reminderDaysBefore: 30,
          active: true
        });
      }
    }

    if (schedulesData.length > 0) {
      const insertedSchedules = await db.insert(maintenanceSchedules)
        .values(schedulesData)
        .returning();
      logger.info(`Inserted ${insertedSchedules.length} maintenance schedules`);
    }

    // Create some maintenance alerts
    const alertsData = [];
    for (let i = 0; i < 10; i++) {
      const vehicle = existingVehicles[i % existingVehicles.length];
      const alertTypes = ['due', 'overdue', 'upcoming', 'critical'];
      const alertType = alertTypes[i % alertTypes.length];

      const dueDate = new Date();
      if (alertType === 'overdue') {
        dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 30)); // Past due
      } else if (alertType === 'upcoming') {
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7)); // Due soon
      }

      alertsData.push({
        vehicleId: vehicle.id,
        alertType,
        alertTitle: `${alertType.charAt(0).toUpperCase() + alertType.slice(1)} Maintenance Required`,
        alertMessage: `${vehicle.vehicleCode} requires ${alertType} maintenance attention`,
        priority: alertType === 'critical' ? 1 : alertType === 'overdue' ? 2 : 3,
        dueDate,
        dueKilometers: (vehicle.mileage || 0) + Math.floor(Math.random() * 1000),
        acknowledged: Math.random() > 0.7, // 30% acknowledged
        resolved: false
      });
    }

    if (alertsData.length > 0) {
      const insertedAlerts = await db.insert(maintenanceAlerts)
        .values(alertsData)
        .returning();
      logger.info(`Inserted ${insertedAlerts.length} maintenance alerts`);
    }
    */

    // Create maintenance history for completed work orders
    const completedWorkOrders = allWorkOrders.filter(wo => wo.status === 'completed');
    const historyData = [];

    for (const workOrder of completedWorkOrders) {
      const vehicle = existingVehicles.find(v => v.id === workOrder.vehicleId);
      const maintenanceType = allMaintenanceTypes.find(mt => mt.id === workOrder.maintenanceTypeId);

      historyData.push({
        vehicleId: workOrder.vehicleId,
        workOrderId: workOrder.id,
        maintenanceTypeId: workOrder.maintenanceTypeId,
        maintenanceDate: workOrder.completedDate,
        odometerReading: (vehicle?.odometer || 0) + Math.floor(Math.random() * 1000),
        workPerformed: `Completed ${maintenanceType?.typeName}`,
        partsReplaced: JSON.stringify(['Oil filter', 'Engine oil']),
        totalCost: workOrder.estimatedCost || 100,
        laborCost: (workOrder.estimatedCost || 100) * 0.6,
        partsCost: (workOrder.estimatedCost || 100) * 0.4,
        duration: workOrder.laborHours ? Math.floor(workOrder.laborHours * 60) : 60,
        qualityRating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        performedBy: 'Service Technician',
        currency: 'RON'
      });
    }

    if (historyData.length > 0) {
      const insertedHistory = await db.insert(maintenanceHistory)
        .values(historyData)
        .returning();
      logger.info(`Inserted ${insertedHistory.length} maintenance history records`);
    }

    logger.info('Maintenance data seeding completed successfully!');

    // Summary
    logger.info('=== SEEDING SUMMARY ===');
    logger.info(`Maintenance Types: ${insertedMaintenanceTypes.length}`);
    logger.info(`Work Orders: ${insertedWorkOrders.length}`);
    logger.info(`- Pending: ${workOrdersData.filter(wo => wo.status === 'pending').length}`);
    logger.info(`- Approved: ${workOrdersData.filter(wo => wo.status === 'approved').length}`);
    logger.info(`- In Progress: ${workOrdersData.filter(wo => wo.status === 'in_progress').length}`);
    logger.info(`- Completed: ${workOrdersData.filter(wo => wo.status === 'completed').length}`);
    logger.info(`- Cancelled: ${workOrdersData.filter(wo => wo.status === 'cancelled').length}`);
    logger.info(`History Records: ${historyData.length}`);

  } catch (error) {
    logger.error('Error seeding maintenance data:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMaintenanceData()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedMaintenanceData };