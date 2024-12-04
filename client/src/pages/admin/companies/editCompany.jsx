import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdSave } from "react-icons/md";
import { useAuth } from '../../../components/AuthProvider';
import CustomAlert from '../../../components/customAlert';

const EditCompanyModal = ({ selectedCompany, closeEditModal, setSelectedCompany }) => {
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    number: "",
    pincode: "",
    foundYear: "",
  });
  const { user } = useAuth();
  const [alert, setAlert] = useState({ type: "", message: "" });
    useEffect(() => {
        if (alert.message) {
          const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2000);
          return () => clearTimeout(timer); 
        }
      }, [alert]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCompany({
      ...selectedCompany,
      [name]: value,
    });
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validateNumber = (number) => /^[0-9]{10}$/.test(number);

  const validatePincode = (pincode) => /^[0-9]{6}$/.test(pincode);

  const validateYear = (year) => /^\d{4}$/.test(year);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "email" && !validateEmail(value)) {
      error = "Please enter a valid email address.";
    } else if (name === "number" && !validateNumber(value)) {
      error = "Please enter a valid 10-digit mobile number.";
    } else if (name === "pincode" && !validatePincode(value)) {
      error = "Please enter a valid 6-digit pincode.";
    } else if (name === "foundYear" && !validateYear(value)) {
      error = "Found year must be a valid four-digit number.";
    }

    setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    const emailValid = validateEmail(selectedCompany.email);
    const numberValid = validateNumber(selectedCompany.number);
    const pincodeValid = validatePincode(selectedCompany.pincode);
    const foundYearValid = validateYear(selectedCompany.foundYear);

    setErrorMessages({
      email: emailValid ? "" : "Please enter a valid email address.",
      number: numberValid ? "" : "Please enter a valid 10-digit mobile number.",
      pincode: pincodeValid ? "" : "Please enter a valid 6-digit pincode.",
      foundYear: foundYearValid ? "" : "Found year must be a valid four-digit number.",
    });

    return emailValid && numberValid && pincodeValid && foundYearValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const adminId = user.id 
    selectedCompany.adminId = adminId; 
    try {
      const response = await axios.put(
        `http://localhost:4000/api/companies/update/${selectedCompany._id}`,
        selectedCompany, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        setAlert({ type: "success", message: "Company Details updated successfully!"});
        setTimeout(() => {
          closeEditModal();
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating company data:", error);
      if (error.response?.data?.message) {
        setAlert({ type: "error", message: error.response.data.message });
    } else {
        setAlert({ type: "error", message: "There was an error submitting the company data." });
    }    
  }
  };
  

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
      {alert.message && (
                <CustomAlert
          severity={alert.type}
          message={alert.message}
          className='z-50 absolute right-4 top-4'
        />
      )}
        <h1 className="text-2xl font-bold mb-2 text-left">Edit Company</h1>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                Company Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={selectedCompany.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={selectedCompany.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errorMessages.email && <p className="text-orange-600 text-sm text-left">{errorMessages.email}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 text-left">
                Mobile Number
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={selectedCompany.number}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errorMessages.number && <p className="text-orange-600 text-sm text-left">{errorMessages.number}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 text-left">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={selectedCompany.location}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Found Year */}
            <div>
              <label htmlFor="foundYear" className="block text-sm font-medium text-gray-700 text-left">
                Found Year
              </label>
              <input
                type="number"
                id="foundYear"
                name="foundYear"
                value={selectedCompany.foundYear}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errorMessages.foundYear && <p className="text-orange-600 text-sm text-left">{errorMessages.foundYear}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 text-left">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={selectedCompany.pincode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errorMessages.pincode && <p className="text-orange-600 text-sm text-left">{errorMessages.pincode}</p>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 text-left">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={selectedCompany.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Rejected">Rejected</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <button
              onClick={closeEditModal}
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue hover:bg-blue-800 text-white py-2 px-4 rounded-md focus:outline-none flex items-center"
            >
              <MdSave className="mr-2 text-xl" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyModal;
