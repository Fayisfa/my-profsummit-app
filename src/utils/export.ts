import * as XLSX from 'xlsx';
import type { RegistrationData } from './types'; // Make sure this path is correct

/**
 * This function takes the registration data and exports it to an Excel file.
 * @param data The array of student registration data to export.
 * @param fileName The desired name for the output .xlsx file.
 */
export const exportToExcel = (data: RegistrationData[], fileName: string) => {
  // 1. We format the data to have user-friendly column headers in the Excel sheet.
  const formattedData = data.map(row => {
    const cutoffDate = new Date("2025-01-01T00:00:00Z");
    const isNew = new Date(row.created_at) > cutoffDate;

    return {
      "Name": row.name,
      "Mobile": row.mobile,
      "Email": row.email,
      "College": row.college,
      "Status": isNew ? 'New Registrant' : 'Returning Member',
      "College District": row.college_district,
      "College Division": row.college_division,
      "Native District": row.native_district,
      "Native Division": row.native_division,
      "Registered On": new Date(row.created_at).toLocaleDateString(),
    };
  });

  // 2. Create a new worksheet and a new workbook.
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

  // 3. Trigger the browser to download the file.
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};