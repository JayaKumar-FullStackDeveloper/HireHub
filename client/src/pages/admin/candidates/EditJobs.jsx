import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdSave } from "react-icons/md";
import { useAuth } from '../../../components/AuthProvider';
import CustomAlert from '../../../components/customAlert';


const EditJobs = ({
    selectedjobs,
    closeEditModal,
    setSelectedjobs
}

) => {
    const { user } = useAuth();
    const [alert, setAlert] = useState({ type: "", message: "" });
    useEffect(() => {
        if (alert.message) {
          const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2000);
          return () => clearTimeout(timer); 
        }
      }, [alert]);

    const [errorMessages, setErrorMessages] = useState({
        email: "",
        contactNumber: "",
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setSelectedjobs({
            ...selectedjobs,
            [name]: files ? files[0] : value,
        });
    };

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    const validateNumber = (contactNumber) => /^(\+91[\s]?)?[0]?(91)?(\(\+91\))?[7896]\d{9}$/.test(contactNumber);

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = "";

        if (name === "email" && !validateEmail(value)) {
            error = "Please enter a valid email address.";
        } else if (name === "contactNumber" && !validateNumber(value)) {
            error = "Please enter a valid 10-digit mobile number.";
        }

        setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const validateForm = () => {
        const emailValid = validateEmail(selectedjobs.email);
        const numberValid = validateNumber(selectedjobs.contactNumber);

        setErrorMessages({
            email: emailValid ? "" : "Please enter a valid email address.",
            contactNumber: numberValid
                ? ""
                : "Please enter a valid 10-digit mobile number.",
        });

        return emailValid && numberValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (selectedjobs.resume && selectedjobs.resume.size > 10 * 1024 * 1024) {
            setAlert({ type: "warning", message: "File size exceeds the maximum limit of 10MB." });
            return;
        }

        const formData = new FormData();
        Object.entries(selectedjobs).forEach(([key, value]) =>
            formData.append(key, value)
        );
        const adminId = user.id 
        formData.append('adminId', adminId);
        try {
            const response = await axios.put(
                `http://localhost:4000/api/jobs/update/${selectedjobs._id}`,
                formData, { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (response.status === 201) {
                setAlert({ type: "success", message: "Job Updated Successfully!" });
                setSelectedjobs({
                    firstName: "",
                    lastName: "",
                    email: "",
                    contactNumber: "",
                    companyName: "",
                    passedOut:"",
                    jobTitle: "",
                    resume: null
                });
                setErrorMessages({})
            }
            setTimeout(() => {
                closeEditModal();
              }, 2000);
        } catch (error) {
            console.error("Error submitting candidate data:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setAlert({ type: "error", message: error.response.data.message });
            } else {
                setAlert({ type: "error", message: "There was an error submitting the candidate data." });
            }
        }
    };


    return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
             {alert.message && (
                <CustomAlert
          severity={alert.type}
          message={alert.message}
          className='z-50 absolute right-4 top-4'
        />
      )}
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
                <h1 className="text-2xl font-bold mb-2 text-left">Edit Candidate</h1>
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Candidate Name */}
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={selectedjobs.firstName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={selectedjobs.lastName}
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
                                value={selectedjobs.email}
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
                                htmlFor="contactNumber"
                                className="block text-sm font-medium text-gray-700 text-left"
                            >
                                Mobile Number
                            </label>
                            <input
                                type="number"
                                id="contactNumber"
                                name="contactNumber"
                                value={selectedjobs.contactNumber}
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
                            {errorMessages.contactNumber && (
                                <p className="text-orange-600 text-sm text-left">
                                    {errorMessages.contactNumber}
                                </p>
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

export default EditJobs;
