# Granular Form Updates Pattern

## Overview

This document describes the pattern for implementing granular form updates across the MedFMS application. Granular updates ensure that only modified fields are sent to the backend, preventing accidental data loss and improving data integrity.

## Pattern Implementation

### 1. Import the Form Tracker Utility

```javascript
import { createFormTracker } from '$lib/utils/formTracking';
```

### 2. Add Form Tracker State Variable

```javascript
let formTracker = null; // For tracking changed fields when editing
```

### 3. Initialize Tracker When Opening Edit Form

When opening a modal or form for editing, create the tracker with the original data:

```javascript
function openEditModal(item) {
  modalMode = 'edit';
  selectedItem = item;

  formData = {
    field1: item.field1 || '',
    field2: item.field2 || null,
    field3: item.field3 || 0,
    // ... all form fields
  };

  // Create form tracker with original data for change detection
  formTracker = createFormTracker(formData);

  showModal = true;
}
```

### 4. Detect Changes and Send Only Modified Fields

In your submit/save function:

```javascript
async function handleSubmit() {
  try {
    if (isEditMode) {
      // For updates, detect and send only changed fields
      const changedFields = formTracker ? formTracker.detectChanges(formData) : formData;

      // Apply any necessary type conversions to changed fields
      const payload = {};
      for (const key in changedFields) {
        if (key === 'numericField') {
          payload[key] = parseInt(changedFields[key]);
        } else if (key === 'optionalNumeric') {
          payload[key] = changedFields[key] ? parseInt(changedFields[key]) : undefined;
        } else {
          payload[key] = changedFields[key];
        }
      }

      // Only send PATCH if there are changes
      if (Object.keys(payload).length > 0) {
        await api.patchEntity(selectedItem.id, payload);
        showSuccessMessage();
      } else {
        showNoChangesMessage();
      }
    } else {
      // For creates, send all data
      await api.createEntity(formData);
      showSuccessMessage();
    }

    closeModal();
    await reloadData();
  } catch (error) {
    handleError(error);
  }
}
```

### 5. Add Corresponding API Method

Ensure the API client has a `patch*()` method:

```javascript
async patchEntity(id, partialData) {
  const response = await fetch(`${API_BASE_URL}/entities/${id}`, {
    method: 'PUT', // Backend uses PUT but accepts partial data via .partial()
    headers: this.getAuthHeaders(),
    body: JSON.stringify(partialData),
  });

  if (!response.ok) {
    throw new Error('Failed to patch entity');
  }

  return response.json();
}
```

## Forms Already Updated

✅ **Completed:**
1. VehicleForm (`src/lib/components/VehicleForm.svelte`)
2. DriverForm (`src/lib/components/DriverForm.svelte`)
3. User Admin Form (`src/routes/admin/users/+page.svelte`)
4. Profile Form (`src/routes/profile/+page.svelte`)
5. Material List Form (`src/routes/materials/+page.svelte`)
6. Warehouse Form (`src/routes/materials/warehouses/[id]/+page.svelte`)
7. Transfer Requests Form (`src/routes/materials/transfer-requests/[id]/+page.svelte`)

## Forms Remaining to Update

Based on the codebase exploration, these forms still need the pattern applied:

### High Priority (Complex Data)

1. **Material Detail Form** (`src/routes/materials/[id]/+page.svelte`)
   - Location: Line ~324
   - API: `api.updateMaterial(material.id, materialForm)`
   - Note: `api.patchMaterial()` already exists

2. **Maintenance Work Orders - List** (`src/routes/maintenance/+page.svelte`)
   - Location: Line ~420
   - API: `api.updateWorkOrder(editingWorkOrder.id, submitData)`
   - Already has: `api.updateWorkOrder()` (uses PUT)

3. **Maintenance Work Orders - Detail** (`src/routes/maintenance/work-orders/[id]/+page.svelte`)
   - Location: Line ~240
   - API: `api.updateWorkOrder(workOrder.id, updateData)`
   - Already has: `api.updateWorkOrder()` (uses PUT)

4. **Vehicle Inventory Assignments** (`src/lib/components/VehicleInventoryManager.svelte`)
   - Location: Line ~248
   - API: `api.updateVehicleInventoryAssignment(selectedAssignment.assignment.id, assignmentData)`
   - Add: `api.patchVehicleInventoryAssignment()`

### Medium Priority (Reference Data)

7. **Reference Data Forms** (`src/routes/admin/+page.svelte`)
   - Location: Line ~420
   - API: `api.updateReferenceData(selectedDataType, currentItem.id, submitData)`
   - Handles 14 different types: brands, models, locations, departments, cities, suppliers, etc.
   - Add: `api.patchReferenceData()`

## Quick Implementation Checklist

For each form:

- [ ] Import `createFormTracker`
- [ ] Add `formTracker` variable
- [ ] Initialize tracker in edit modal open function
- [ ] Update submit function to detect changes
- [ ] Call `patch*()` API method instead of `update*()`
- [ ] Add `patch*()` method to `src/lib/api.ts` if needed
- [ ] Handle "no changes" scenario
- [ ] Test create and update scenarios

## Type Conversion Patterns

### Numeric Fields
```javascript
if (key === 'brandId' || key === 'modelId' || key === 'year') {
  payload[key] = parseInt(changedFields[key]);
}
```

### Optional Numeric Fields
```javascript
if (key === 'locationId' || key === 'departmentId') {
  payload[key] = changedFields[key] ? parseInt(changedFields[key]) : undefined;
}
```

### String Fields
```javascript
payload[key] = changedFields[key]; // Direct assignment
```

## Benefits

1. **Data Integrity**: Prevents overwriting unchanged fields
2. **Concurrency**: Multiple users can update different fields safely
3. **Performance**: Smaller payloads reduce network usage
4. **Audit Trail**: Backend can see exactly which fields changed
5. **Type Safety**: Proper conversions maintained for changed fields only

## Backend Compatibility

The backend already supports partial updates through Zod's `.partial()` schema validation. No backend changes are required - the routes accept both full and partial payloads.

Example from backend:
```typescript
router.put('/:id', async (req, res) => {
  const data = vehicleSchema.partial().parse(req.body); // .partial() allows any subset
  // ... update logic
});
```

## Testing

For each updated form, verify:

1. ✅ Create new record works
2. ✅ Edit and change one field only updates that field
3. ✅ Edit without changes shows "no changes" message
4. ✅ Edit and change multiple fields updates all changed fields
5. ✅ Unchanged fields retain their original values
6. ✅ Type conversions work correctly (numbers, dates, etc.)
7. ✅ Null/undefined handling works for optional fields

## Future Enhancements

Consider adding:
- Visual indicators showing which fields have been modified
- Confirmation dialog showing what will be changed before save
- Optimistic UI updates with rollback on error
- Field-level validation showing only for changed fields
