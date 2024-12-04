import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FcDownload } from 'react-icons/fc';
import { ImCross } from "react-icons/im";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const ExportToExcel = ({ data, fileName = 'exported_data' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDateField, setSelectedDateField] = useState('updatedAt');
  const [filteredData, setFilteredData] = useState(data);
  const [isRange, setIsRange] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const applyFilter = () => {
    if (!fromDate && !toDate && isRange) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      const itemDate = new Date(item[selectedDateField]);
      if (isRange) {
        return (
          (!fromDate || itemDate >= new Date(fromDate)) &&
          (!toDate || itemDate <= new Date(toDate))
        );
      } else {
        return (
          !fromDate ||
          itemDate.toLocaleDateString() === new Date(fromDate).toLocaleDateString()
        );
      }
    });

    setFilteredData(filtered);
  };
  const exportToExcel = () => {
    applyFilter();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    toggleModal();
  };

  return (
    <div>
      <div
        onClick={toggleModal}
        className="flex items-center cursor-pointer gap-2 border-green-500 border-2 px-3 py-1 rounded-lg"
      >
        <FcDownload className="my-auto rotate-180" />
        <h5 className="font-medium">Export</h5>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className='flex w-full justify-between mb-4'>
              <h3 className="text-xl font-semibold self-center">Filter Data for You Wish</h3>
              <button
                onClick={toggleModal}
                className="ml-auto mr-2 text-gray-500 hover:text-gray-700"
              >
                <ImCross className='self-center m-auto' />
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="dateField" className="block text-sm font-medium">Select Date Field</label>
            
              <Select
                id="dateField"
                value={selectedDateField}
                size="small"
                onChange={(e) => setSelectedDateField(e.target.value)}   className="w-full border px-3 mt-2 rounded-md"           >
                <MenuItem value={'joiningDate'}>Joining Date</MenuItem>
                <MenuItem value={'updatedAt'}>Updated At</MenuItem>
              </Select>

            </div>

            {/* Toggle Button for Date Range */}
            <div className="mb-4">
              <button
                onClick={() => setIsRange(!isRange)}
                className={`w-full ${isRange ? 'bg-blue-500 text-white bg-slate-600' : 'bg-gray-200 text-gray-950'} py-2 font-medium rounded-md`}
              >
                {isRange ? 'Switch to Single Date' : 'Switch to Date Range'}
              </button>
            </div>

            {/* Conditional Date Inputs */}
            {isRange ? (
              <>
                <div className="mb-4">
                  <label htmlFor="fromDate" className="block text-sm text-left">From Date</label>
                  <input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border px-3 py-2 mt-1 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="toDate" className="block text-sm text-left">To Date</label>
                  <input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border px-3 py-2 mt-1 rounded-md"
                  />
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label htmlFor="fromDate" className="block text-sm font-medium">Select Date</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border px-3 py-2 mt-1 rounded-md"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div
              onClick={exportToExcel}
              className="flex items-center self-center w-full justify-center cursor-pointer gap-2 border-green-500 border-2 px-3 py-1 rounded-lg mt-4"
            >
              <FcDownload className="my-auto rotate-180 self-center" />
              <h5 className="font-medium justify-center self-center">Export Filtered Data</h5>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportToExcel;
