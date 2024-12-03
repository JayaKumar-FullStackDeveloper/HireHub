import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ExportToExcel from '../../../components/exportToExcel';
import { MdModeEdit } from "react-icons/md";
import EditCandidateModal from './editCandidateModel';

const PaidCandidates = ({ isCollapsed }) => {
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    dob: '',
    gender: '',
    qualification: '',
    passedOut: '',
    age: '',
    resume: null,
    adminId: ''
  });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/candidate/getall');
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      }finally{
        setLoading(false)
      }
    };

    fetchCandidates();
  }, [candidates]);

  const paidOnly = candidates.filter((user) => user.paymentStatus === 'Paid');
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const openModal = (resumePath) => {
    setResumeUrl(resumePath);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResumeUrl('');
  };

  const openEditModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className={`mx-auto ${isCollapsed ? 'max-w-7xl' : 'max-w-6xl'}`}>
      <div className='w-full justify-between flex mb-2'>
        <h1 className="text-2xl font-bold text-left">Paid Candidates List</h1>
        <ExportToExcel data={paidOnly} fileName="Paid_Candidates_List" />
      </div>
        <div className="w-full h-[560px] overflow-scroll scrollbar-hide border border-gray-300 rounded-lg mt-2" style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          <table className="w-full bg-white border-collapse border-0">
            <thead className="bg-gray-200 sticky -top-0 w-full">
              <tr className='w-full'>
                <th className="py-3 px-4 border">S.No</th>
                <th className="py-2 px-4 border whitespace-nowrap">Full Name</th>
                <th className="py-2 px-4 border whitespace-nowrap">Date and Time</th>
                <th className="py-2 px-4 border whitespace-nowrap">Date of Birth</th>
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Gender</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border whitespace-nowrap">Contact Number</th>
                <th className="py-2 px-4 border whitespace-nowrap">Payment Status</th>
                <th className="py-2 px-4 border whitespace-nowrap">Paid Date and Time</th>
                <th className="py-2 px-4 border">Qualification</th>
                <th className="py-2 px-4 border">Graduation</th>
                <th className="py-2 px-4 border">Resume</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
               {/* Loading Skeleton */}
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 14 }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-2 px-2 border-y text-center"
                    >
                      <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && 
              paidOnly.map((user, index) => (
                <motion.tr
                  key={user._id}
                  className="text-center hover:bg-gray-100 cursor-pointer"
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <td className="py-2 px-2 border-y whitespace-nowrap text-base font-normal">{index + 1}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">{user.fullName}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {user.joiningDate
                      ? new Date(user.dob).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                      : 'N/A'}
                  </td>                  
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {user.dob ? new Date(user.dob).toISOString().split('T')[0] : 'N/A'}
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">{user.age}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal overflow-hidden text-ellipsis">{user.gender}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">{user.email}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">{user.mobileNumber}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base text-green-600 font-medium "><span className='bg-green-50 py-1 px-4 rounded-md '>{user.paymentStatus}</span></td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    {user.paymentStatusChangedAt
                      ? new Date(user.dob).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                      : 'N/A'}
                  </td>   
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">{user.qualification}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">{user.passedOut}</td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    <div
                      onClick={() => openModal(user.resume)}
                      className="text-white bg-green-700 py-1 px-2 font-medium rounded-md">
                      View Resume
                    </div>
                  </td>
                  <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                    <div
                      className="text-amber-900 flex  border-2 py-1 px-4 hover:border-orange-800 hover:bottom-2 font-medium rounded-md" onClick={() => openEditModal(user)}
                    >
                      <MdModeEdit className='pr-1 flex self-center text-lg' /> Edit
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2">
              X
            </button>
            <iframe
              src={`http://localhost:4000/${resumeUrl}`}
              width="100%"
              height="100%"
              title="Resume Viewer"
            ></iframe>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedCandidate && (
        <EditCandidateModal
          selectedCandidate={selectedCandidate}
          setSelectedCandidate={setSelectedCandidate}
          closeEditModal={closeEditModal}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}


    </div>
  );
};

export default PaidCandidates;
