import { getDb, initDatabase } from './index.js';
import { eq } from 'drizzle-orm';
import {
  users,
  brands,
  models,
  vehicleTypes,
  vehicleStatuses,
  fuelTypes,
  cities,
  locations,
  departments,
  vehicles,
  drivers
} from './schema/index.js';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger.js';

async function seedDatabase() {
  try {
    await initDatabase();
    const db = getDb();

    logger.info('Seeding database...');

    // Create default admin user
    const hashedPin = await bcrypt.hash('1234', 10);
    await db.insert(users).values({
      username: 'admin',
      email: 'admin@medfms.com',
      pin: hashedPin,
      fullName: 'System Administrator',
      role: 'admin'
    }).onConflictDoNothing();

    // Seed vehicle types
    const vehicleTypeData = [
      { typeCode: 'CAR', typeName: 'Car' },
      { typeCode: 'TRUCK', typeName: 'Truck' },
      { typeCode: 'VAN', typeName: 'Van' },
      { typeCode: 'BUS', typeName: 'Bus' },
      { typeCode: 'MOTORCYCLE', typeName: 'Motorcycle' }
    ];

    for (const type of vehicleTypeData) {
      await db.insert(vehicleTypes).values(type).onConflictDoNothing();
    }

    // Seed vehicle statuses
    const statusData = [
      { statusCode: 'ACTIVE', statusName: 'Active', colorCode: '#10B981' },
      { statusCode: 'MAINTENANCE', statusName: 'In Maintenance', colorCode: '#F59E0B' },
      { statusCode: 'RETIRED', statusName: 'Retired', colorCode: '#EF4444' },
      { statusCode: 'RESERVED', statusName: 'Reserved', colorCode: '#8B5CF6' }
    ];

    for (const status of statusData) {
      await db.insert(vehicleStatuses).values(status).onConflictDoNothing();
    }

    // Seed fuel types
    const fuelData = [
      { fuelCode: 'PETROL', fuelName: 'Petrol', currentPrice: 1.25, unit: 'L' },
      { fuelCode: 'DIESEL', fuelName: 'Diesel', currentPrice: 1.15, unit: 'L' },
      { fuelCode: 'ELECTRIC', fuelName: 'Electric', currentPrice: 0.12, unit: 'kWh' },
      { fuelCode: 'LPG', fuelName: 'LPG', currentPrice: 0.85, unit: 'L' }
    ];

    for (const fuel of fuelData) {
      await db.insert(fuelTypes).values(fuel).onConflictDoNothing();
    }

    // Seed brands
    const brandData = [
      { brandCode: 'TOYOTA', brandName: 'Toyota', country: 'Japan' },
      { brandCode: 'FORD', brandName: 'Ford', country: 'USA' },
      { brandCode: 'BMW', brandName: 'BMW', country: 'Germany' },
      { brandCode: 'MERCEDES', brandName: 'Mercedes-Benz', country: 'Germany' },
      { brandCode: 'VOLVO', brandName: 'Volvo', country: 'Sweden' }
    ];

    for (const brand of brandData) {
      await db.insert(brands).values(brand).onConflictDoNothing();
    }

    // Seed cities
    const cityData = [
      { cityCode: 'BUC', cityName: 'Bucharest', country: 'Romania' },
      { cityCode: 'CLJ', cityName: 'Cluj-Napoca', country: 'Romania' },
      { cityCode: 'TIM', cityName: 'Timisoara', country: 'Romania' },
      { cityCode: 'BRA', cityName: 'Brasov', country: 'Romania' }
    ];

    for (const city of cityData) {
      await db.insert(cities).values(city).onConflictDoNothing();
    }

    // Seed sample drivers
    const driverData = [
      {
        driverCode: 'DRV001',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        idNumber: '1234567890',
        licenseNumber: 'LIC001',
        licenseType: 'B',
        phoneNumber: '+1234567890',
        email: 'john.doe@example.com'
      },
      {
        driverCode: 'DRV002',
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        idNumber: '0987654321',
        licenseNumber: 'LIC002',
        licenseType: 'C',
        phoneNumber: '+1987654321',
        email: 'jane.smith@example.com'
      }
    ];

    const insertedDrivers = [];
    for (const driver of driverData) {
      const result = await db.insert(drivers).values(driver).onConflictDoNothing().returning();
      if (result.length > 0) {
        insertedDrivers.push(result[0]);
      } else {
        // Get existing driver
        const existing = await db.select().from(drivers).where(eq(drivers.driverCode, driver.driverCode)).limit(1);
        if (existing.length > 0) insertedDrivers.push(existing[0]);
      }
    }

    // Seed sample vehicles
    const vehicleData = [
      {
        vehicleCode: 'VEH001',
        licensePlate: 'ABC-123',
        brandId: 1, // Toyota
        modelId: 1,
        year: 2022,
        fuelTypeId: 1, // Petrol
        vehicleTypeId: 1, // Car
        statusId: 1, // Active
        driverId: insertedDrivers[0]?.id,
        odometer: 15000,
        description: 'Company sedan for executive use'
      },
      {
        vehicleCode: 'VEH002',
        licensePlate: 'XYZ-456',
        brandId: 2, // Ford
        modelId: 2,
        year: 2021,
        fuelTypeId: 2, // Diesel
        vehicleTypeId: 2, // Truck
        statusId: 1, // Active
        driverId: insertedDrivers[1]?.id,
        odometer: 45000,
        description: 'Heavy duty truck for material transport'
      },
      {
        vehicleCode: 'VEH003',
        licensePlate: 'DEF-789',
        brandId: 3, // BMW
        modelId: 3,
        year: 2023,
        fuelTypeId: 3, // Electric
        vehicleTypeId: 1, // Car
        statusId: 2, // Maintenance
        odometer: 8000,
        description: 'Electric vehicle for sustainable transport'
      }
    ];

    for (const vehicle of vehicleData) {
      await db.insert(vehicles).values(vehicle).onConflictDoNothing();
    }

    logger.info('Database seeded successfully');
  } catch (error) {
    logger.error('Seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };