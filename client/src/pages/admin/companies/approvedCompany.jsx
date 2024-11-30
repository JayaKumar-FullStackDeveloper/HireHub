import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ExportToExcel from '../../../components/exportToExcel';
import { MdModeEdit } from "react-icons/md";
import EditCompanyModal from './editCompany';

const ApprovedCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);  // New loading state

  const openEditModal = (company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCompany(null);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/companies/getall');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally{
        setLoading(false)
      }
    };

    fetchCompanies();
  }, []);

  const approvedCompanies = companies.filter((company) => company.status === 'Approved');
  const sortedData = approvedCompanies.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className='w-full justify-between flex mb-2'>
        <h1 className="text-2xl font-bold text-left">Approved Company</h1>
        <ExportToExcel data={sortedData} fileName="Approved_Companies_List" />
      </div>

      {/* Show loading skeleton while data is being fetched */}
      {loading ? (
        <div className="w-full h-[520px] overflow-scroll scrollbar-hide border border-gray-300 rounded-lg mt-2 animate-pulse">
          <table className="w-full bg-white border-collapse border-0">
            <thead className="bg-gray-200 sticky -top-0 w-full">
              <tr className='w-full'>
                <th className="py-3 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
                <th className="py-2 px-4 border bg-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="text-center hover:bg-gray-100 cursor-pointer border-y">
                  <td className="py-2 px-2 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                  <td className="py-2 px-3 border-y bg-gray-200"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full h-[520px] overflow-scroll scrollbar-hide border border-gray-300 rounded-lg mt-2" style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          <table className="w-full bg-white border-collapse border-0">
            <thead className="bg-gray-200 sticky -top-0 w-full">
              <tr className='w-full'>
                <th className="py-3 px-4 border ">S.No</th>
                <th className="py-2 px-4 border whitespace-nowrap">Company Name</th>
                <th className="py-2 px-4 border whitespace-nowrap">Company Type</th>
                <th className="py-2 px-4 border whitespace-nowrap">Register Number</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Mobile</th>
                <th className="py-2 px-4 border whitespace-nowrap">Founded Year</th>
                <th className="py-2 px-4 border">City</th>
                <th className="py-2 px-4 border">State</th>
                <th className="py-2 px-4 border">Pincode</th>
                <th className="py-2 px-4 border">Country</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((company, index) => (
                <motion.tr
                  key={company._id}
                  className="text-center hover:bg-gray-100 cursor-pointer"
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <td className="py-2 px-2 border-y whitespace-nowrap text-base font-normal">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">
                    {company.name}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.type}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.RegisterNumber}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.location}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">
                    {company.email}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.number}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.foundYear}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.city}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.state}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.pincode}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {company.country}
                  </td>
                  <td className="py-1 px-3 border-y whitespace-nowrap text-base font-normal">
                    <div
                      className="text-amber-900 flex border-2 py-1 px-4 hover:border-orange-800 hover:bottom-2 font-medium rounded-md" onClick={() => openEditModal(company)}
                    >
                      <MdModeEdit className='pr-1 flex self-center text-lg' /> Edit
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditModalOpen && selectedCompany && (
        <EditCompanyModal
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          closeEditModal={closeEditModal}
        />
      )}
    </div>
  );
};

export default ApprovedCompany;
