import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NumberTicker from '../../../components/numberTicker';

const ManageCompany = ({ isCollapsed }) => {
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
  }, []);

  const handleStatusChange = async (companyId, status) => {
    try {
      await axios.put(`http://localhost:4000/api/companies/update/${companyId}`, {
        status: status,
      });
      setCompanies(
        companies.map((company) =>
          company._id === companyId ? { ...company, status: status } : company
        )
      );
    } catch (error) {
      console.error('Error updating company status:', error);
    }
  };

  const totalCompanies = companies.length;
  const approvedCompanies = companies.filter((company) => company.status === 'Approved').length;
  const rejectedCompanies = companies.filter((company) => company.status === 'Rejected').length;
  const pendingCompanies = companies.filter((company) => company.status === 'Pending').length;

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className='w-full'>
      <div className={`mx-auto ${isCollapsed ? 'max-w-7xl' : 'max-w-6xl'}`}>      
        <h1 className="text-xl font-bold mb-4 text-left">Manage Companies Application</h1>
        <div className="flex justify-between mb-4 gap-20">
          <div className="bg-blue-100 flex flex-col p-4 rounded shadow-md w-1/4 text-center bg-cyan-50">
            <div className="flex justify-evenly">
              <img src="/images/comapany.png" alt="img" className="w-10 h-12" />
              <NumberTicker count={totalCompanies} />
            </div>
            <h3 className="text-lg font-semibold">Total Companies</h3>
          </div>
          <div className="bg-green-50 p-4 rounded shadow-md w-1/4 text-center">
            <div className="flex justify-evenly">
              <img src="/images/approved.png" alt="img" className="w-10 h-12" />
              <NumberTicker count={approvedCompanies} />
            </div>
            <h3 className="text-lg font-semibold">Approved Companies</h3>
          </div>
          <div className="bg-amber-50 p-4 rounded shadow-md w-1/4 text-center">
            <div className="flex justify-evenly">
              <img src="/images/pending.png" alt="img" className="w-10 h-12 opacity-70" />
              <NumberTicker count={pendingCompanies} />
            </div>
            <h3 className="text-lg font-semibold">Pending Companies</h3>
          </div>
          <div className="bg-orange-100 p-4 rounded shadow-md w-1/4 text-center">
            <div className="flex justify-evenly">
              <img src="/images/reject.png" alt="img" className="w-10 h-12 opacity-70" />
              <NumberTicker count={rejectedCompanies} />
            </div>
            <h3 className="text-lg font-semibold">Rejected Companies</h3>
          </div>
        </div>

        {companies.length === 0 ? (
          <p>Loading company details...</p>
        ) : (
          <div
            className="w-full lg:h-[450px] overflow-scroll scrollbar-hide border-gray-300 rounded-lg"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <table className="w-full bg-white border-collapse border-0">
              <thead className="bg-gray-200 sticky -top-1 w-full">
                <tr className="w-full">
                  <th className="py-3 px-2 border">S.No</th>
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
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <motion.tr
                    key={company._id}
                    className="text-center hover:bg-gray-100 cursor-pointer"
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <td className="py-3 px-2 border whitespace-nowrap text-base font-normal">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">
                      {company.name}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.type}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.RegisterNumber}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.location}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">
                      {company.email}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.number}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.foundYear}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.city}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.state}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.pincode}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.country}
                    </td>
                    <td className="py-3 px-3 border whitespace-nowrap text-base font-normal">
                      {company.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(company._id, 'Approved')}
                            className="px-4 py-1 bg-green-500 text-white rounded mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(company._id, 'Rejected')}
                            className="px-4 py-1 bg-orange-600 text-white rounded"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        company.status
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div></div>
  );
};

export default ManageCompany;
