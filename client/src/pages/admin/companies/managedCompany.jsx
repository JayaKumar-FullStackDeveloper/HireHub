import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NumberTicker from '../../../components/numberTicker';
import { MdModeEdit } from "react-icons/md";
import EditCompanyModel from './editCompany';
import { useAuth } from '../../../components/AuthProvider';
import CustomAlert from '../../../components/customAlert';

const ManageCompany = ({ isCollapsed }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const {user}= useAuth()
  const [alert, setAlert] = useState({ type: "", message: "" });
    useEffect(() => {
        if (alert.message) {
          const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2000);
          return () => clearTimeout(timer); 
        }
      }, [alert]);
  const adminId = user.id ;
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
      } finally {
        setLoading(false); 
      }
    };

    fetchCompanies();
  }, [companies]);

  const handleStatusChange = async (companyId, status) => {
    try {
      await axios.put(`http://localhost:4000/api/companies/update/${companyId}`, {
        status: status, adminId : adminId
      });
      setAlert({ type: "success", message: `Company ${status} Successfully!`});
      setCompanies(
        companies.map((company) =>
          company._id === companyId ? { ...company, status: status } : company
      )
    );
    setTimeout(() => {
      closeEditModal();
    }, 2000);
    } catch (error) {
      setAlert({ type: "error", message: `Error updating company status: ${error}`});
    }
  };

  const totalCompanies = companies.length;
  const approvedCompanies = companies.filter((company) => company.status === 'Approved').length;
  const rejectedCompanies = companies.filter((company) => company.status === 'Rejected').length;
  const pendingCompanies = companies.filter((company) => company.status === 'Pending').length;
  const sortedData = companies.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="w-full">
      <div className={`mx-auto ${isCollapsed ? 'max-w-7xl' : 'max-w-6xl'}`}>
        <h1 className="text-xl font-bold mb-4 text-left">Manage Companies Application</h1>
        {alert.message && (
                <CustomAlert
          severity={alert.type}
          message={alert.message}
          className='z-50 absolute right-4 top-2'
        />
      )}
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

        {/* Skeleton loader while data is loading */}
        {loading ? (
          <div className="w-full lg:h-[630px] border-gray-300 rounded-lg relative overflow-hidden">
            <div className="overflow-y-auto h-full border border-gray-200 rounded-md" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <table className="w-full bg-white border-collapse">
                <thead className="bg-gray-200 sticky -top-0 z-30">
                  <tr>
                    <th className="py-3 px-2 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap"></th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap"></th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                    <th className="py-2 px-4 border-y bg-gray-200"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-3 px-2">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="w-full lg:h-[630px] border-gray-300 rounded-lg relative overflow-hidden">
            <div className="overflow-y-auto h-full border border-gray-200 rounded-md" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <table className="w-full bg-white border-collapse">
                <thead className="bg-gray-200 sticky -top-0 z-30">
                  <tr>
                    <th className="py-3 px-2 border-y bg-gray-200">S.No</th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap">Company Name</th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap">Company Type</th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap">Register Number</th>
                    <th className="py-2 px-4 border-y bg-gray-200">Location</th>
                    <th className="py-2 px-4 border-y bg-gray-200">Email</th>
                    <th className="py-2 px-4 border-y bg-gray-200">Mobile</th>
                    <th className="py-2 px-4 border-y bg-gray-200 whitespace-nowrap">Founded Year</th>
                    <th className="py-2 px-4 border-y bg-gray-200">City</th>
                    <th className="py-2 px-4 border-y bg-gray-200">State</th>
                    <th className="py-2 px-4 border-y bg-gray-200">Pincode</th>
                    <th className="py-2 px-4 border-y bg-gray-200">Country</th>
                    <th className="py-2 px-4 border-y bg-gray-200">Status</th>
                    <th className="py-2 px-4 border-y bg-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((company, index) => (
                    <motion.tr
                      key={company._id}
                      className="text-center hover:bg-gray-100 cursor-pointer border-b"
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <td className="py-3 px-2 whitespace-nowrap text-base font-normal">{index + 1}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.name}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.type}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.RegisterNumber}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.location}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.email}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.number}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.foundYear}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.city}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.state}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.pincode}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">{company.country}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-base font-normal">
                        {company.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(company._id, 'Approved')}
                              className="px-4 py-1 bg-green-500 hover:bg-lime-500 text-white rounded mr-2"
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
                      <td className="py-1 px-3 border-y whitespace-nowrap text-base font-normal">
                        <div
                          className="text-amber-900 flex border-2 py-1 px-4 hover:border-orange-800 hover:bottom-2 font-medium rounded-md"
                          onClick={() => openEditModal(company)}
                        >
                          <MdModeEdit className='pr-1 flex self-center text-lg' /> Edit
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isEditModalOpen && selectedCompany && (
          <EditCompanyModel
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            closeEditModal={closeEditModal}
          />
        )}
      </div>
    </div>
  );
};

export default ManageCompany;
