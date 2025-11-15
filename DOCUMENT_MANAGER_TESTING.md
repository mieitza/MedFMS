# DocumentManager Component Testing Guide

## Overview
The DocumentManager component has been enhanced with the following features:
- Drag-and-drop file upload
- Multiple file selection (up to 10 files)
- File preview before upload (thumbnails for images)
- Progress indicators with percentage
- Editable document names
- File size validation (10MB default)
- Better error handling

## Pages Using DocumentManager

### 1. Vehicles Detail Page
**URL:** `http://localhost:5173/vehicles/[id]`
- Navigate to the Vehicles page
- Click on any vehicle to view details
- Look for the "Documents" section

### 2. Drivers Detail Page
**URL:** `http://localhost:5173/drivers/[id]`
- Navigate to the Drivers page
- Click on any driver to view details
- Look for the "Documents" section

## Test Cases

### Test 1: Single File Upload (Basic Functionality)
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click the "Add Document" button (or equivalent)
3. Click "browse" to select a single file
4. Verify the file appears in the preview list with:
   - Thumbnail (if image)
   - Document icon (if PDF/doc)
   - File name (editable)
   - File size
5. Fill in required metadata (category, description, etc.)
6. Click "Upload"
7. Verify progress bar shows during upload
8. Verify success message appears
9. Verify document appears in the documents list

**Expected Result:** Single file uploads successfully with progress indication

---

### Test 2: Multiple File Upload
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Click "browse" and select multiple files (2-5 files)
4. Verify all files appear in the preview list
5. Verify each file has an editable name field
6. Edit the document name for at least one file
7. Click "Upload"
8. Verify progress bars show for each file sequentially
9. Verify all files are uploaded successfully

**Expected Result:** Multiple files upload sequentially with individual progress tracking

---

### Test 3: Drag and Drop Upload
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document" to open the upload modal
3. Drag one or more files from your file explorer
4. Drop them onto the drag-and-drop zone
5. Verify the border highlights when dragging over
6. Verify dropped files appear in the preview list
7. Complete the upload

**Expected Result:** Drag-and-drop works smoothly with visual feedback

---

### Test 4: Image Preview
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select or drag image files (JPEG, PNG, etc.)
4. Verify thumbnail previews appear for each image
5. Verify images are displayed correctly

**Expected Result:** Image thumbnails display before upload

---

### Test 5: File Size Validation
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Try to upload a file larger than 10MB
4. Verify an error message appears: "File [name] is too large. Maximum size is 10 MB"
5. Verify the file is NOT added to the upload list

**Expected Result:** Files larger than 10MB are rejected with clear error message

---

### Test 6: Max Files Limit
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Try to select more than 10 files at once
4. Verify a message appears: "Maximum 10 files allowed per upload"
5. Verify only the first 10 files are added

**Expected Result:** Only 10 files can be selected at once

---

### Test 7: Duplicate File Detection
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select a file
4. Try to select the same file again (same name and size)
5. Verify an error message: "File [name] is already selected"
6. Verify the duplicate is not added

**Expected Result:** Duplicate files are rejected

---

### Test 8: Remove File Before Upload
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select multiple files
4. Click the "X" button on one of the files in the preview list
5. Verify the file is removed from the preview
6. Upload the remaining files
7. Verify only the non-removed files are uploaded

**Expected Result:** Files can be removed before upload

---

### Test 9: Edit Document Names
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select one or more files
4. Edit the document name for each file in the preview list
5. Upload the files
6. Verify the uploaded documents show the edited names (not original filenames)

**Expected Result:** Document names can be customized before upload

---

### Test 10: Progress Indicators
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select multiple large files (to see progress)
4. Start upload
5. Verify progress bar appears for each file
6. Verify percentage shows (0%, 30%, 100%)
7. Verify success/error indicators appear after each upload

**Expected Result:** Progress is clearly visible during upload

---

### Test 11: Sequential Upload
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select multiple files
4. Start upload
5. Verify files upload one at a time (sequential)
6. Verify each file shows progress before the next starts

**Expected Result:** Files upload sequentially, not in parallel

---

### Test 12: Upload with Metadata
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select files
4. Fill in metadata fields:
   - Category (if required)
   - Description
   - Expiry date (if applicable)
   - Is Public checkbox
5. Upload files
6. Verify metadata is saved for all files

**Expected Result:** Shared metadata applies to all uploaded files

---

### Test 13: Different File Types
**Steps:**
1. Test with various file types:
   - PDF (.pdf)
   - Word documents (.doc, .docx)
   - Excel spreadsheets (.xls, .xlsx)
   - Images (JPEG, PNG, GIF, WebP)
   - Text files (.txt, .csv)
2. Verify each type:
   - Is accepted
   - Shows appropriate icon
   - Uploads successfully

**Expected Result:** All supported file types work correctly

---

### Test 14: Error Handling
**Steps:**
1. Navigate to any vehicle or driver detail page
2. Click "Add Document"
3. Select files
4. Simulate a network error (disconnect network temporarily)
5. Try to upload
6. Verify error messages appear
7. Verify failed files show error state

**Expected Result:** Errors are handled gracefully with clear messages

---

### Test 15: Mobile/Responsive Testing
**Steps:**
1. Open the app on a mobile device or use browser dev tools to emulate mobile
2. Navigate to vehicle or driver detail page
3. Try uploading documents
4. Verify:
   - Upload modal is responsive
   - Drag-and-drop zone is accessible
   - Preview list is readable
   - Progress indicators are visible

**Expected Result:** Component works well on mobile devices

---

## Known Limitations

1. **PDF Preview:** Currently shows a placeholder icon instead of actual PDF preview. This is pending the pdf.js integration task.

2. **Progress Simulation:** Upload progress currently shows simulated values (30%, 100%). Real progress tracking would require XMLHttpRequest instead of the Fetch API.

3. **Sequential Upload:** Files upload one at a time. This is intentional for better progress visibility but could be slower for many files.

## Browser Compatibility

Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Success Criteria

All test cases should pass without errors. The component should:
- ✅ Accept drag-and-drop
- ✅ Support multiple files (up to 10)
- ✅ Show image previews
- ✅ Display progress indicators
- ✅ Validate file size
- ✅ Allow document name editing
- ✅ Handle errors gracefully
- ✅ Work on mobile devices
