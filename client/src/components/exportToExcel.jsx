import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FcDownload } from 'react-icons/fc'; 
import { ImCross } from "react-icons/im";


const ExportToExcel = ({ data, fileName = 'exported_data' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDateField, setSelectedDateField] = useState('updatedAt'); 
  const [filteredData, setFilteredData] = useState(data);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const applyFilter = () => {
    const filtered = data.filter(item => {
      const itemDate = new Date(item[selectedDateField]);
      return (
        (!fromDate || itemDate >= new Date(fromDate)) &&
        (!toDate || itemDate <= new Date(toDate))
      );
    });
    setFilteredData(filtered); 
  };

  const exportToExcel = () => {
    applyFilter()
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
            <div className='flex w-full justify-between'>
              <h3 className="text-xl font-semibold mb-4 self-center">Filter Data for You Wish</h3>
            <button
            onClick={toggleModal}
            className="ml-auto mr-2 text-gray-500 hover:text-gray-700"
          >
            <ImCross className='self-center m-auto' />
          </button>
            </div>

            <div className="mb-4">
              <label htmlFor="dateField" className="block text-sm">Select Date Field</label>
              <select
                id="dateField"
                value={selectedDateField}
                onChange={(e) => setSelectedDateField(e.target.value)}
                className="w-full border px-3 py-2 mt-1 rounded-md"
              >
                <option value="joiningDate">Joining Date</option>
                {/* <option value="createdAt">Created At</option> */}
                <option value="updatedAt">Updated At</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="fromDate" className="block text-sm">From Date</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border px-3 py-2 mt-1 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="toDate" className="block text-sm">To Date</label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border px-3 py-2 mt-1 rounded-md"
              />
            </div>

            {/* Modal Actions */}
            <div
              onClick={exportToExcel}
              className="flex items-center self-center w-full  justify-center cursor-pointer gap-2 border-green-500 border-2 px-3 py-1 rounded-lg mt-4"
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
