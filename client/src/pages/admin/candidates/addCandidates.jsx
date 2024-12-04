import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrFormAdd } from "react-icons/gr";
import dayjs from "dayjs";
import { useAuth } from "../../../components/AuthProvider";
import CustomAlert from "../../../components/customAlert";


const AddCandidates = ({ isCollapsed }) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  const { user } = useAuth();
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

  const [errorMessages, setErrorMessages] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setCandidateData({
      ...candidateData,
      [name]: files ? files[0] : value,
    });
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validateNumber = (mobileNumber) =>
    /^(\+91[\s]?)?[0]?(91)?(\(\+91\))?[7896]\d{9}$/.test(mobileNumber);

  const validateAge = (age) => /^\d{2}$/.test(age);

  const validateYear = (year) => {
    const yearValid = /^\d{4}$/.test(year);
    if (!yearValid) return false;
    const selectedYear = parseInt(year, 10);
    const currentYear = dayjs().year();
    return selectedYear < currentYear;
  };

  const validateDOB = (dob) => {
    if (!dob || dob === "0001-01-01" || dob.trim() === "") {
      return false;
    }
    const selectedYear = dayjs(dob).year();
    const currentYear = dayjs().year();
    return selectedYear < currentYear;
  };

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
      error = "Year must be a valid four-digit number and less than the current year.";
    } else if (name === "dob" && !validateDOB(value)) {
      error = "Date of birth cannot be 00/00/0000 or empty.";
    }

    setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    const emailValid = validateEmail(candidateData.email);
    const numberValid = validateNumber(candidateData.mobileNumber);
    const ageValid = validateAge(candidateData.age);
    const yearValid = validateYear(candidateData.passedOut);
    const dobValid = validateDOB(candidateData.dob);

    setErrorMessages({
      email: emailValid ? "" : "Please enter a valid email address.",
      mobileNumber: numberValid ? "" : "Please enter a valid 10-digit mobile number.",
      age: ageValid ? "" : "Age must be a valid two-digit number.",
      passedOut: yearValid
        ? ""
        : "Year must be a valid four-digit number and less than the current year.",
      dob: dobValid ? "" : "Date of birth cannot be 00/00/0000 or empty.",
    });

    return emailValid && numberValid && ageValid && yearValid && dobValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (candidateData.resume && candidateData.resume.size > 10 * 1024 * 1024) {
      setAlert({ type: "error", message: "File size exceeds the maximum limit of 10MB." });
      return;
    }

    const formData = new FormData();
    Object.entries(candidateData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    const adminId = user.id;
    formData.append("adminId", adminId);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/candidate/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        setAlert({ type: "success", message: "Candidate added successfully!" });
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
          joiningDate: getCurrentDateTime(),
        });
        setErrorMessages({});
      }
    } catch (error) {
      console.error("Error submitting candidate data:", error);
      const errorMessage = error.response?.data?.message || "Error submitting candidate data.";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2000);
      return () => clearTimeout(timer); 
    }
  }, [alert]);


  return (
    <div className={`mx-auto ${isCollapsed ? "max-w-7xl" : "max-w-6xl"}`}>
      <h1 className="text-2xl font-bold mb-2 text-left">Add New Candidate</h1>
      {alert.message && (
        <CustomAlert
          severity={alert.type}
          message={alert.message}
        />
      )}
      <div className="w-full h-[560px] overflow-scroll scrollbar-hide border border-gray-300 rounded-lg mt-2 relative" style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        
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
                type="number"
                id="mobileNumber"
                name="mobileNumber"
                value={candidateData.mobileNumber}
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
                value={candidateData.dob}
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
                value={candidateData.gender}
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
                value={candidateData.qualification}
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
                value={candidateData.passedOut}
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
                value={candidateData.age}
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
                onBlur={handleBlur}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
              />
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
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end bottom-6 right-4 absolute">
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
    </div>
  );
};

export default AddCandidates;
