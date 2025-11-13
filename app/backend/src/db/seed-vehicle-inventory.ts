import { getDb, initDatabase } from './index.js';
import { vehicleInventoryCategories, vehicleInventoryItems } from './schema/vehicleInventory.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

async function seedVehicleInventory() {
  try {
    await initDatabase();
    const db = getDb();

    logger.info('Seeding vehicle inventory categories...');

    // Seed categories
    const categories = [
      {
        categoryCode: 'MEDICAL',
        categoryName: 'Medical Equipment',
        description: 'Medical supplies and equipment for ambulances',
        requiresExpiration: true,
        requiresSerialNumber: true
      },
      {
        categoryCode: 'SAFETY',
        categoryName: 'Safety Equipment',
        description: 'Safety equipment like fire extinguishers, first aid kits',
        requiresExpiration: true,
        requiresSerialNumber: true
      },
      {
        categoryCode: 'TOOLS',
        categoryName: 'Tools & Equipment',
        description: 'General tools and equipment',
        requiresExpiration: false,
        requiresSerialNumber: true
      },
      {
        categoryCode: 'CONSUMABLES',
        categoryName: 'Consumables',
        description: 'Consumable items that need regular replacement',
        requiresExpiration: true,
        requiresSerialNumber: false
      }
    ];

    for (const category of categories) {
      await db.insert(vehicleInventoryCategories).values(category).onConflictDoNothing();
    }

    logger.info('Seeding vehicle inventory items...');

    // Get category IDs
    const [medicalCat] = await db.select().from(vehicleInventoryCategories).where(eq(vehicleInventoryCategories.categoryCode, 'MEDICAL')).limit(1);
    const [safetyCat] = await db.select().from(vehicleInventoryCategories).where(eq(vehicleInventoryCategories.categoryCode, 'SAFETY')).limit(1);
    const [toolsCat] = await db.select().from(vehicleInventoryCategories).where(eq(vehicleInventoryCategories.categoryCode, 'TOOLS')).limit(1);
    const [consumablesCat] = await db.select().from(vehicleInventoryCategories).where(eq(vehicleInventoryCategories.categoryCode, 'CONSUMABLES')).limit(1);

    // Seed items
    const items = [
      // Medical Equipment
      {
        itemCode: 'OXY-TUBE-01',
        itemName: 'Oxygen Tube/Cylinder',
        categoryId: medicalCat?.id,
        description: 'Portable oxygen cylinder for emergency medical use',
        manufacturer: 'Various',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 2,
        requiresExpiration: true,
        requiresSerialNumber: true,
        requiresCertification: true
      },
      {
        itemCode: 'DEFIB-01',
        itemName: 'Defibrillator (AED)',
        categoryId: medicalCat?.id,
        description: 'Automated External Defibrillator for cardiac emergencies',
        manufacturer: 'Various',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 1,
        requiresExpiration: true,
        requiresSerialNumber: true,
        requiresCertification: true
      },
      {
        itemCode: 'STRETCHER-01',
        itemName: 'Stretcher',
        categoryId: medicalCat?.id,
        description: 'Medical stretcher for patient transport',
        manufacturer: 'Various',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 1,
        requiresSerialNumber: true
      },
      {
        itemCode: 'BP-MONITOR-01',
        itemName: 'Blood Pressure Monitor',
        categoryId: medicalCat?.id,
        description: 'Digital blood pressure monitoring device',
        manufacturer: 'Various',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 2,
        requiresSerialNumber: true,
        requiresCertification: true
      },

      // Safety Equipment
      {
        itemCode: 'FIRE-EXT-01',
        itemName: 'Fire Extinguisher',
        categoryId: safetyCat?.id,
        description: 'Portable fire extinguisher',
        manufacturer: 'Various',
        model: 'ABC Type',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 2,
        requiresExpiration: true,
        requiresSerialNumber: true,
        requiresCertification: true
      },
      {
        itemCode: 'FIRSTAID-KIT-01',
        itemName: 'First Aid Kit',
        categoryId: safetyCat?.id,
        description: 'Complete first aid kit',
        unitOfMeasure: 'kit',
        minQuantity: 1,
        maxQuantity: 2,
        requiresExpiration: true
      },
      {
        itemCode: 'WARNING-TRI-01',
        itemName: 'Warning Triangle',
        categoryId: safetyCat?.id,
        description: 'Reflective warning triangle for emergencies',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 2
      },
      {
        itemCode: 'REFL-VEST-01',
        itemName: 'Reflective Vest',
        categoryId: safetyCat?.id,
        description: 'High-visibility reflective safety vest',
        unitOfMeasure: 'unit',
        minQuantity: 2,
        maxQuantity: 4
      },

      // Tools & Equipment
      {
        itemCode: 'SPARE-WHEEL-01',
        itemName: 'Spare Wheel',
        categoryId: toolsCat?.id,
        description: 'Spare tire for emergency use',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 1,
        requiresSerialNumber: true
      },
      {
        itemCode: 'JACK-01',
        itemName: 'Hydraulic Jack',
        categoryId: toolsCat?.id,
        description: 'Hydraulic jack for tire changes',
        unitOfMeasure: 'unit',
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        itemCode: 'TOOL-KIT-01',
        itemName: 'Tool Kit',
        categoryId: toolsCat?.id,
        description: 'Basic tool kit for minor repairs',
        unitOfMeasure: 'kit',
        minQuantity: 1,
        maxQuantity: 1
      },

      // Consumables
      {
        itemCode: 'GLOVES-LATEX-01',
        itemName: 'Latex Gloves',
        categoryId: consumablesCat?.id,
        description: 'Disposable latex gloves',
        unitOfMeasure: 'box',
        minQuantity: 1,
        maxQuantity: 3,
        requiresExpiration: true
      },
      {
        itemCode: 'MASK-SURGICAL-01',
        itemName: 'Surgical Masks',
        categoryId: consumablesCat?.id,
        description: 'Disposable surgical masks',
        unitOfMeasure: 'box',
        minQuantity: 1,
        maxQuantity: 3,
        requiresExpiration: true
      },
      {
        itemCode: 'BANDAGES-01',
        itemName: 'Bandages Assorted',
        categoryId: consumablesCat?.id,
        description: 'Assorted bandages and dressings',
        unitOfMeasure: 'box',
        minQuantity: 1,
        maxQuantity: 2,
        requiresExpiration: true
      }
    ];

    for (const item of items) {
      if (item.categoryId) {
        await db.insert(vehicleInventoryItems).values(item).onConflictDoNothing();
      }
    }

    logger.info('Vehicle inventory seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding vehicle inventory:', error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedVehicleInventory()
    .then(() => {
      logger.info('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seed failed:', error);
      process.exit(1);
    });
}

export { seedVehicleInventory };
