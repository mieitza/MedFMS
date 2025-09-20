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

    const insertedBrands = [];
    for (const brand of brandData) {
      const result = await db.insert(brands).values(brand).onConflictDoNothing().returning();
      if (result.length > 0) {
        insertedBrands.push(result[0]);
      } else {
        // Get existing brand
        const existing = await db.select().from(brands).where(eq(brands.brandCode, brand.brandCode)).limit(1);
        if (existing.length > 0) insertedBrands.push(existing[0]);
      }
    }

    // Seed models
    const modelData = [
      // Toyota models
      { modelCode: 'CAMRY', modelName: 'Camry', brandId: insertedBrands.find(b => b.brandCode === 'TOYOTA')?.id },
      { modelCode: 'COROLLA', modelName: 'Corolla', brandId: insertedBrands.find(b => b.brandCode === 'TOYOTA')?.id },
      { modelCode: 'PRIUS', modelName: 'Prius', brandId: insertedBrands.find(b => b.brandCode === 'TOYOTA')?.id },
      { modelCode: 'RAV4', modelName: 'RAV4', brandId: insertedBrands.find(b => b.brandCode === 'TOYOTA')?.id },

      // Ford models
      { modelCode: 'FOCUS', modelName: 'Focus', brandId: insertedBrands.find(b => b.brandCode === 'FORD')?.id },
      { modelCode: 'FIESTA', modelName: 'Fiesta', brandId: insertedBrands.find(b => b.brandCode === 'FORD')?.id },
      { modelCode: 'TRANSIT', modelName: 'Transit', brandId: insertedBrands.find(b => b.brandCode === 'FORD')?.id },
      { modelCode: 'RANGER', modelName: 'Ranger', brandId: insertedBrands.find(b => b.brandCode === 'FORD')?.id },

      // BMW models
      { modelCode: '320I', modelName: '320i', brandId: insertedBrands.find(b => b.brandCode === 'BMW')?.id },
      { modelCode: '520I', modelName: '520i', brandId: insertedBrands.find(b => b.brandCode === 'BMW')?.id },
      { modelCode: 'X3', modelName: 'X3', brandId: insertedBrands.find(b => b.brandCode === 'BMW')?.id },
      { modelCode: 'I4', modelName: 'i4', brandId: insertedBrands.find(b => b.brandCode === 'BMW')?.id },

      // Mercedes models
      { modelCode: 'C180', modelName: 'C-Class 180', brandId: insertedBrands.find(b => b.brandCode === 'MERCEDES')?.id },
      { modelCode: 'E220', modelName: 'E-Class 220', brandId: insertedBrands.find(b => b.brandCode === 'MERCEDES')?.id },
      { modelCode: 'SPRINTER', modelName: 'Sprinter', brandId: insertedBrands.find(b => b.brandCode === 'MERCEDES')?.id },

      // Volvo models
      { modelCode: 'XC60', modelName: 'XC60', brandId: insertedBrands.find(b => b.brandCode === 'VOLVO')?.id },
      { modelCode: 'V90', modelName: 'V90', brandId: insertedBrands.find(b => b.brandCode === 'VOLVO')?.id },
      { modelCode: 'FH16', modelName: 'FH16', brandId: insertedBrands.find(b => b.brandCode === 'VOLVO')?.id }
    ];

    for (const model of modelData) {
      if (model.brandId) {
        await db.insert(models).values(model).onConflictDoNothing();
      }
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