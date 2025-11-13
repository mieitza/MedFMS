-- Make destination columns nullable to support different transfer types
-- For warehouse-to-vehicle: destinationWarehouseId is NULL
-- For warehouse-to-employee: destinationWarehouseId is NULL
-- For vehicle-to-warehouse: destinationVehicleId and destinationEmployeeId are NULL

-- SQLite doesn't support ALTER COLUMN to change NOT NULL constraint
-- We need to recreate the table with the new schema

-- Step 1: Create a new table with the correct schema
CREATE TABLE warehouse_transfer_requests_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_number TEXT NOT NULL UNIQUE,
    transfer_type TEXT DEFAULT 'warehouse-to-warehouse' NOT NULL,
    source_warehouse_id INTEGER,
    source_vehicle_id INTEGER,
    destination_warehouse_id INTEGER,
    destination_vehicle_id INTEGER,
    destination_employee_id INTEGER,
    material_id INTEGER NOT NULL,
    vehicle_inventory_item_id INTEGER,
    quantity REAL NOT NULL,
    requested_quantity REAL,
    priority INTEGER DEFAULT 3 NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    requested_by INTEGER NOT NULL,
    requested_date INTEGER NOT NULL,
    required_by_date INTEGER,
    approved_by INTEGER,
    approved_date INTEGER,
    completed_by INTEGER,
    completed_date INTEGER,
    rejected_by INTEGER,
    rejected_date INTEGER,
    rejection_reason TEXT,
    reason TEXT,
    notes TEXT,
    auto_approve INTEGER DEFAULT 0 NOT NULL,
    created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Step 2: Copy data from old table to new table
INSERT INTO warehouse_transfer_requests_new 
SELECT * FROM warehouse_transfer_requests;

-- Step 3: Drop old table
DROP TABLE warehouse_transfer_requests;

-- Step 4: Rename new table to original name
ALTER TABLE warehouse_transfer_requests_new RENAME TO warehouse_transfer_requests;
