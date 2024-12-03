import axios from 'axios';
import React, { useState } from 'react';
import { MdSave } from "react-icons/md";
import { useAuth } from '../../../components/AuthProvider';


const EditCandidateModal = ({
    selectedCandidate,
    closeEditModal,
    setSelectedCandidate
}

) => {

    const [errorMessages, setErrorMessages] = useState({
        email: "",
        mobileNumber: "",
        age: "",
        passedOut: "",
        dob: "",
      });
      const { user } = useAuth();
    
      const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setSelectedCandidate({
          ...selectedCandidate,
          [name]: files ? files[0] : value,
        });
      };
    
      const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    
      const validateNumber = (mobileNumber) => /^(\+91[\s]?)?[0]?(91)?(\(\+91\))?[7896]\d{9}$/.test(mobileNumber);
    
      const validateAge = (age) => /^\d{2}$/.test(age);
    
      const validateYear = (year) => /^\d{4}$/.test(year);
    
      const validateDOB = (dob) => dob !== "0001-01-01" && dob.trim() !== "";
    
      const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = "";
    
        if (name === "email" && !validateEmail(value)) {
          error = "Please enter a valid email address.";
        } else if (name === "mobileNumber" && !validateNumber(value)) {
          error = "Please enter a valid 10-digit mobile number.";
        } else if (name === "age" && !validateAge(value)) {
          error = "Age must be a valid two-digit number.";
        } else if (name === "passedOut" && !validateYear(value)) {
          error = "Year must be a valid four-digit number.";
        } else if (name === "dob" && !validateDOB(value)) {
          error = "Date of birth cannot be 00/00/0000 or empty.";
        }
    
        setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: error }));
      };
    
      const validateForm = () => {
        const emailValid = validateEmail(selectedCandidate.email);
        const numberValid = validateNumber(selectedCandidate.mobileNumber);
        const ageValid = validateAge(selectedCandidate.age);
        const yearValid = validateYear(selectedCandidate.passedOut);
        const dobValid = validateDOB(selectedCandidate.dob);
    
        setErrorMessages({
          email: emailValid ? "" : "Please enter a valid email address.",
          mobileNumber: numberValid
            ? ""
            : "Please enter a valid 10-digit mobile number.",
          age: ageValid ? "" : "Age must be a valid two-digit number.",
          passedOut: yearValid ? "" : "Year must be a valid four-digit number.",
          dob: dobValid ? "" : "Date of birth cannot be 00/00/0000 or empty.",
        });
    
        return emailValid && numberValid && ageValid && yearValid && dobValid;
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (selectedCandidate.resume && selectedCandidate.resume.size > 10 * 1024 * 1024) {
          alert("File size exceeds the maximum limit of 10MB.");
          return;
        }
    
        const formData = new FormData();
        Object.entries(selectedCandidate).forEach(([key, value]) =>
          formData.append(key, value)
        );
        const adminId = user.id 
        formData.append('adminId', adminId);
        try {
          const response = await axios.put(
            `http://localhost:4000/api/candidate/update/${selectedCandidate._id}`,
            formData, { headers: { "Content-Type": "multipart/form-data" } }
          );
          closeEditModal()
          if (response.status === 201) {
            alert("Candidate added successfully!");
            setSelectedCandidate({
              fullName: "",
              email: "",
              mobileNumber: "",
              dob: "",
              gender: "",
              qualification: "",
              passedOut: "",
              resume: null,
              age: "",
            });
            setErrorMessages({})
        }
        } catch (error) {
          console.error("Error submitting candidate data:", error);
    
          if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message);
          } else {
            alert("There was an error submitting the candidate data.");
          }
        }
      };


    return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                <h1 className="text-2xl font-bold mb-2 text-left">Edit Candidate</h1>
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Candidate Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={selectedCandidate.fullName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={selectedCandidate.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errorMessages.email && (
                                <p className="text-orange-600 text-sm text-left">
                                    {errorMessages.email}
                                </p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label
                                htmlFor="mobileNumber"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Mobile Number
                            </label>
                            <input
                                type="number"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={selectedCandidate.mobileNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                                maxLength={10}
                                pattern="\d{10}"
                                inputMode="numeric"
                                onInput={(e) => {
                                    if (e.target.value.length > 10) {
                                        e.target.value = e.target.value.slice(0, 10);
                                    }
                                }}
                                title="Mobile number must be 10 digits"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errorMessages.mobileNumber && (
                                <p className="text-orange-600 text-sm text-left">
                                    {errorMessages.mobileNumber}
                                </p>
                            )}
                        </div>

                        {/* Date Of Birth */}
                        <div>
                            <label
                                htmlFor="dob"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Date Of Birth
                            </label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={selectedCandidate.dob ? new Date(selectedCandidate.dob).toISOString().split('T')[0] : 'N/A'}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errorMessages.dob && (
                                <p className="text-orange-600 text-sm text-left">{errorMessages.dob}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label
                                htmlFor="gender"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={selectedCandidate.gender}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="" className="text-gray-400 text-lg">
                                    Select Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        {/* Qualification */}
                        <div>
                            <label
                                htmlFor="qualification"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Qualification
                            </label>
                            <input
                                type="text"
                                id="qualification"
                                name="qualification"
                                value={selectedCandidate.qualification}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                            />
                        </div>

                        {/* Year Passed Out */}
                        <div>
                            <label
                                htmlFor="passedOut"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Year Passed Out
                            </label>
                            <input
                                type="number"
                                id="passedOut"
                                name="passedOut"
                                value={selectedCandidate.passedOut}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                maxLength={4}
                                inputMode="numeric"
                                onInput={(e) => {
                                    if (e.target.value.length > 4) {
                                        e.target.value = e.target.value.slice(0, 4);
                                    }
                                }}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errorMessages.passedOut && (
                                <p className="text-orange-600 text-sm text-left">
                                    {errorMessages.passedOut}
                                </p>
                            )}
                        </div>
                        {/* Age */}
                        <div>
                            <label
                                htmlFor="age"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={selectedCandidate.age}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                maxLength={2}
                                inputMode="numeric"
                                onInput={(e) => {
                                    if (e.target.value.length > 2) {
                                        e.target.value = e.target.value.slice(0, 2);
                                    }
                                }}
                                pattern="\d{2}"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errorMessages.age && (
                                <p className="text-orange-600 text-sm text-left">{errorMessages.age}</p>
                            )}
                        </div>

                        {/* Resume */}
                        <div>
                            <label
                                htmlFor="resume"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Resume
                            </label>
                            <input
                                type="file"
                                id="resume"
                                name="resume"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeEditModal}
                            className="bg-orange-700 text-slate-100 rounded-md px-4 py-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue text-white flex rounded-md px-4 gap-2 py-2"
                        >
                          <MdSave className='text-white self-center text-xl' /> <span className=''>Save</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCandidateModal;
