import { readFileSync } from 'fs';
import { getDb, initDatabase } from '../db/index.js';
import { eq } from 'drizzle-orm';
import {
  vehicles,
  brands,
  models,
  fuelTypes,
  vehicleTypes,
  vehicleStatuses
} from '../db/schema/index.js';
import { logger } from '../utils/logger.js';

interface CSVRow {
  ID: string;
  Brand: string;
  Model: string;
  'License Plate': string;
  'Is Electric': string;
  Services: string;
  'Service Elements Count': string;
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row as CSVRow;
  });
}

function normalizeBrandName(brand: string): string {
  // Normalize brand names to handle variations
  const normalized = brand.trim().toUpperCase();

  // Handle common variations
  const brandMap: Record<string, string> = {
    'VOLKSWAGEN': 'VOLKSWAGEN',
    'VW': 'VOLKSWAGEN',
    'MERCEDES': 'MERCEDES',
    'MERCEDES-BENZ': 'MERCEDES',
    'FORD FIESTA': 'FORD',
    'FORD FOCUS': 'FORD',
    'DUSTER': 'DACIA',
    'LOGAN': 'DACIA',
    'RENAULT': 'RENAULT',
    'TRAFIC': 'RENAULT',
    'FIAT DUCATO': 'FIAT',
    'MG ZS': 'MG',
    'TRANSPORTER': 'VOLKSWAGEN',
    'CELKERESZT': 'CELKERESZT',
    'GENERAL/RED-CROSSHAIR': 'GENERAL',
    'HUNDAY': 'HYUNDAI',
    'LANDROVER': 'LAND ROVER',
  };

  // Check if there's a mapping
  if (brandMap[normalized]) {
    return brandMap[normalized];
  }

  // Extract first word as brand for compound names
  const firstWord = normalized.split(/[\s\/]/)[0];
  if (firstWord && firstWord.length > 1) {
    return firstWord;
  }

  return normalized;
}

function normalizeModelName(model: string, brand: string): string {
  const normalized = model.trim().toUpperCase();

  // If model contains the brand name, extract just the model
  const brandUpper = brand.toUpperCase();
  if (normalized.startsWith(brandUpper)) {
    return normalized.substring(brandUpper.length).trim();
  }

  return normalized || 'UNKNOWN';
}

function normalizeLicensePlate(plate: string): string {
  // Remove extra spaces and normalize
  return plate.trim().replace(/\s+/g, ' ').toUpperCase();
}

async function importVehicles() {
  try {
    await initDatabase();
    const db = getDb();

    logger.info('Starting vehicle import from CSV...');

    // Read CSV file
    const csvPath = '/Users/mihai/dev/GitHub/MedFMS/vehicles_export.csv';
    const csvContent = readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(csvContent);

    logger.info(`Found ${rows.length} vehicles in CSV`);

    // Get reference data IDs
    const dieselFuel = await db.select().from(fuelTypes).where(eq(fuelTypes.fuelCode, 'DIESEL')).limit(1);
    const electricFuel = await db.select().from(fuelTypes).where(eq(fuelTypes.fuelCode, 'ELECTRIC')).limit(1);
    const vanType = await db.select().from(vehicleTypes).where(eq(vehicleTypes.typeCode, 'VAN')).limit(1);
    const activeStatus = await db.select().from(vehicleStatuses).where(eq(vehicleStatuses.statusCode, 'ACTIVE')).limit(1);

    const defaultFuelTypeId = dieselFuel[0]?.id || 2;
    const electricFuelTypeId = electricFuel[0]?.id || 3;
    const defaultVehicleTypeId = vanType[0]?.id || 3;
    const defaultStatusId = activeStatus[0]?.id || 1;

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const row of rows) {
      try {
        // Skip empty rows
        if (!row.ID || !row['License Plate']) {
          skipCount++;
          continue;
        }

        // Check if vehicle already exists
        const existing = await db.select()
          .from(vehicles)
          .where(eq(vehicles.vehicleCode, row.ID))
          .limit(1);

        if (existing.length > 0) {
          logger.info(`Vehicle ${row.ID} already exists, skipping...`);
          skipCount++;
          continue;
        }

        // Normalize brand name
        const brandName = normalizeBrandName(row.Brand);
        const brandCode = brandName.replace(/[^A-Z0-9]/g, '').substring(0, 20);

        // Find or create brand
        let brand = await db.select().from(brands).where(eq(brands.brandCode, brandCode)).limit(1);
        if (brand.length === 0) {
          const newBrand = await db.insert(brands).values({
            brandCode,
            brandName: brandName,
            country: 'Unknown'
          }).returning();
          brand = newBrand;
          logger.info(`Created brand: ${brandName}`);
        }
        const brandId = brand[0].id;

        // Normalize model name
        const modelName = normalizeModelName(row.Model, brandName);
        const modelCode = `${brandCode}_${modelName.replace(/[^A-Z0-9]/g, '').substring(0, 20)}`;

        // Find or create model
        let model = await db.select().from(models).where(eq(models.modelCode, modelCode)).limit(1);
        if (model.length === 0) {
          const newModel = await db.insert(models).values({
            modelCode,
            modelName: modelName,
            brandId: brandId
          }).returning();
          model = newModel;
          logger.info(`Created model: ${modelName} for brand ${brandName}`);
        }
        const modelId = model[0].id;

        // Determine fuel type
        const isElectric = row['Is Electric']?.toLowerCase() === 'true';
        const fuelTypeId = isElectric ? electricFuelTypeId : defaultFuelTypeId;

        // Normalize license plate
        const licensePlate = normalizeLicensePlate(row['License Plate']);

        // Insert vehicle
        await db.insert(vehicles).values({
          vehicleCode: row.ID,
          licensePlate: licensePlate,
          brandId: brandId,
          modelId: modelId,
          year: null, // No year data in CSV
          fuelTypeId: fuelTypeId,
          vehicleTypeId: defaultVehicleTypeId,
          statusId: defaultStatusId,
          active: true
        });

        successCount++;
        if (successCount % 10 === 0) {
          logger.info(`Imported ${successCount} vehicles...`);
        }
      } catch (error: any) {
        logger.error(`Error importing vehicle ${row.ID}:`, error.message);
        errorCount++;
      }
    }

    logger.info('Vehicle import completed!');
    logger.info(`Success: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);

  } catch (error) {
    logger.error('Import failed:', error);
    throw error;
  }
}

// Run import if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importVehicles().catch(console.error);
}

export { importVehicles };
