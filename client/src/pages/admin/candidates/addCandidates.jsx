import React, { useState } from "react";
import axios from "axios";
import { GrFormAdd } from "react-icons/gr";

const AddCandidates = ({isCollapsed}) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString();
  };
  const [candidateData, setCandidateData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    dob: "",
    gender: "",
    qualification: "",
    passedOut: "",
    resume: null,
    age: "",
    joiningDate: getCurrentDateTime(),
  });

  const [errorMessages, setErrorMessages] = useState({
    email: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setCandidateData({
      ...candidateData,
      [name]: files ? files[0] : value,
    });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateNumber = (mobileNumber) => /^\d{10}$/.test(mobileNumber);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";
    if (name === "email" && !validateEmail(value)) {
      error = "Please enter a valid email address.";
    } else if (name === "mobileNumber" && !validateNumber(value)) {
      error = "Please enter a valid 10-digit mobile number.";
    }
    setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    const emailValid = validateEmail(candidateData.email);
    const numberValid = validateNumber(candidateData.mobileNumber);
    setErrorMessages({
      email: emailValid ? "" : "Please enter a valid email address.",
      mobileNumber: numberValid
        ? ""
        : "Please enter a valid 10-digit mobile number.",
    });
    return emailValid && numberValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (candidateData.resume && candidateData.resume.size > 10 * 1024 * 1024) {
      alert("File size exceeds the maximum limit of 10MB.");
      return;
    }

    const formData = new FormData();
    Object.entries(candidateData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/candidate/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 201) {
        alert("Candidate added successfully!");
        setCandidateData({
          fullName: "",
          email: "",
          mobileNumber: "",
          dob: "",
          gender: "",
          qualification: "",
          passedOut: "",
          resume: null,
          age: "",
          joiningDate: getCurrentDateTime()
        });
        setErrorMessages({});
      }
    } catch (error) {
      console.error("Error submitting candidate data:", error);
      alert("There was an error submitting the candidate data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mx-auto ${isCollapsed ? 'max-w-7xl' : 'max-w-6xl'}`}>      
      <h1 className="text-2xl font-bold mb-2 text-left">Add New Candidate</h1>
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
              value={candidateData.fullName}
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
              value={candidateData.email}
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
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={candidateData.mobileNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errorMessages.mobileNumber && (
              <p className="text-orange-600 text-sm text-left">
                {errorMessages.mobileNumber}
              </p>
            )}
          </div>
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
              value={candidateData.dob}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
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
              value={candidateData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" className="text-gray-400 text-lg">
                Select Gender
              </option>
              <option value="male" className="hover:bg-gray-100">Male</option>
              <option value="female" className="hover:bg-gray-100">Female</option>
              <option value="other" className="hover:bg-gray-100">Other</option>
            </select>
          </div>

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
              value={candidateData.qualification}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="passedOut"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Year of Graduation
            </label>
            <input
              type="number"
              id="passedOut"
              name="passedOut"
              value={candidateData.passedOut}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className="mt-1 block w-full appearance-none border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
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
              value={candidateData.age}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="joiningDate"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Joining Date
            </label>
            <input
              type="text"
              id="joiningDate"
              name="joiningDate"
              value={candidateData.joiningDate}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            />
          </div>

          {/* Resume Upload */}
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
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className={`bg-indigo-600 flex text-white py-2 px-4 justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 hover:bg-indigo-700 hover:shadow-sm ${loading && "opacity-50 cursor-not-allowed"
              }`}
            disabled={loading}
          >
            <span className="self-center justify-center text-2xl">
              <GrFormAdd />
            </span>
            <h3 className="font-medium">
              {loading ? "Adding..." : "Add Candidate"}
            </h3>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCandidates;
