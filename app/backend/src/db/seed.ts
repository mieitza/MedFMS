import { getDb } from './index.js';
import {
  users,
  brands,
  models,
  vehicleTypes,
  vehicleStatuses,
  fuelTypes,
  cities,
  locations,
  departments
} from './schema/index.js';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger.js';

async function seedDatabase() {
  try {
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