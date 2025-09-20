import { getDb } from '../index.js';
import { documentCategories } from '../schema/documents.js';
import { eq } from 'drizzle-orm';

export async function addDocumentCategories() {
  const db = getDb();

  const categories = [
    {
      categoryName: 'Registration',
      description: 'Vehicle registration documents'
    },
    {
      categoryName: 'Insurance',
      description: 'Insurance policies and claims'
    },
    {
      categoryName: 'Maintenance',
      description: 'Service records and maintenance documentation'
    },
    {
      categoryName: 'Inspection',
      description: 'Safety and technical inspections'
    },
    {
      categoryName: 'License',
      description: 'Driver licenses and certifications'
    },
    {
      categoryName: 'Permits',
      description: 'Special permits and authorizations'
    },
    {
      categoryName: 'Contracts',
      description: 'Purchase, lease, and service contracts'
    },
    {
      categoryName: 'Other',
      description: 'Miscellaneous documents'
    }
  ];

  try {
    // Insert categories if they don't exist
    for (const category of categories) {
      const existing = await db.select()
        .from(documentCategories)
        .where(eq(documentCategories.categoryName, category.categoryName))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(documentCategories).values(category);
        console.log(`Added category: ${category.categoryName}`);
      }
    }

    console.log('Document categories migration completed');
  } catch (error) {
    console.error('Error adding document categories:', error);
    throw error;
  }
}