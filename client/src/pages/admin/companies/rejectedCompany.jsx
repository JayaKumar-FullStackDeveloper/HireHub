import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ExportToExcel from '../../../components/exportToExcel';


const RejectedCompanys = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/companies/getall');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanies();
  }, [companies]);

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };
  const rejectedCompanies = companies.filter((company) => company.status === 'Rejected');

  return (
    <div className="max-w-6xl mx-auto">
      <div className='w-full justify-between flex mb-2'>
        <h1 className="text-2xl font-bold self-center text-left">Rejected Company</h1>
        <ExportToExcel data={rejectedCompanies} fileName="Rejected_Companies_List" />

      </div>
      {rejectedCompanies.length === 0 ? (
        <p>Loading company details...</p>
      ) : (
        <div className="w-full h-[520px] overflow-scroll scrollbar-hide border border-gray-300 rounded-lg" style={{
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
              </tr>
            </thead>
            <tbody>
              {rejectedCompanies.map((company, index) => (
                <motion.tr
                  key={company._id}
                  className="text-center hover:bg-gray-100 cursor-pointer"
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <td className="py-2 px-2 border whitespace-nowrap text-base font-normal">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">
                    {company.name}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.type}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.RegisterNumber}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.location}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">
                    {company.email}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.number}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.foundYear}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.city}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.state}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.pincode}
                  </td>
                  <td className="py-2 px-3 border whitespace-nowrap text-base font-normal">
                    {company.country}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RejectedCompanys;
