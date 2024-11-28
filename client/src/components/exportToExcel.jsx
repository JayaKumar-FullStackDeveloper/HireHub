import React from 'react';
import * as XLSX from 'xlsx';
import { FcDownload } from 'react-icons/fc'; // Optional icon

const ExportToExcel = ({ data, fileName = 'exported_data' }) => {
  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div 
      onClick={exportToExcel} 
      className="flex items-center cursor-pointer gap-2 border-green-500 border-2 px-3 py-1 rounded-lg"
    >
      <FcDownload className="my-auto rotate-180" />
      <h5 className="font-medium">Export</h5>
    </div>
  );
};

export default ExportToExcel;
