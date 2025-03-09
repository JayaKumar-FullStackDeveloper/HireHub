import React, { useEffect, useState } from "react";
import { MdSave, MdInfo, MdBusiness, MdAccessTime } from "react-icons/md";
import axios from "axios";
import CustomAlert from "../../../components/customAlert";

const PostInternship = ({employerData, isCollapsed }) => {
  const [internshipData, setInternshipData] = useState({
    internshipTitle: "",
    internshipType: "",
    internshipField: "",
    internshipNature: "",
    internshipDescription: "",
    requiredSkills: "",
    duration: "",
    applicationStartDate: "",
    applicationEndDate: "",
    stipend: "",
    eligibilityCriteria: "",
    degreesPreferred: "",
    totalVacancies: "",
    state: "",
    district: "",
    companyName: employerData?.companyName || "", 
    email: employerData?.email || "",            
    phoneNumber: employerData?.phoneNumber || "", 
    location: employerData?.location || "",
    companyDescription: employerData?.companyDescription || "",
  });

    useEffect(() => {
      if (employerData) {
        setInternshipData((prevState) => ({
          ...prevState,
          profileImageUrl :employerData.profileImageUrl || prevState.profileImageUrl,
          companyName: employerData.companyName || prevState.companyName,
          email: employerData.email || prevState.email,
          phoneNumber: employerData.phoneNumber || prevState.phoneNumber,
          location: employerData.location || prevState.location,
          companyDescription: employerData.companyDescription || prevState.companyDescription,
        }));
      }
    }, [employerData]);

  const [errorMessages, setErrorMessages] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInternshipData({
      ...internshipData,
      [name]: value,
    });
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const validateNumber = (mobileNumber) =>
    /^(\+91[\s]?)?[0]?(91)?(\(\+91\))?[7896]\d{9}$/.test(mobileNumber);

  const validateForm = () => {
    const emailValid = validateEmail(internshipData.email);
    const numberValid = validateNumber(internshipData.contactNumber);

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

    const formData = new FormData();
    Object.entries(internshipData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4000/api/internship/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        setAlert({ type: "success", message: "Internship posted successfully!" });
        setInternshipData({
          internshipTitle: "",
          companyName: "",
          companyDescription:"",
          internshipType: "",
          internshipField: "",
          internshipNature: "",
          internshipDescription: "",
          requiredSkills: "",
          duration: "",
          applicationStartDate: "",
          applicationEndDate: "",
          stipend: "",
          eligibilityCriteria: "",
          degreesPreferred: "",
          email: "",
          contactNumber: "",
          totalVacancies: "",
          country: "",
          state: "",
          district: "",
        });
        setErrorMessages({});
      }
    } catch (error) {
      setAlert({ type: "error", message: "Error posting internship." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mx-auto ${isCollapsed ? "max-w-7xl" : "max-w-6xl"}`}>
      <h1 className="text-2xl font-bold mb-2 text-left">Post New Internship</h1>
      {alert.message && (
        <CustomAlert severity={alert.type} message={alert.message} />
      )}

      {/* Form Section */}
      <div className="w-full h-[560px] overflow-scroll rounded-lg mt-2 relative" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Company Information Section */}
          <div className="p-4 border border-gray-300 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-left mb-4 flex items-center gap-2">
              <MdBusiness />
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={employerData.companyName}
                  onChange={handleInputChange}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter the company name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={employerData.email}
                  onChange={handleInputChange}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the company email"
                />
                {errorMessages.email && (
                  <p className="text-sm text-red-500 mt-1">{errorMessages.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={employerData.contactNumber}
                  onChange={handleInputChange}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the company phone number"
                />
                {errorMessages.contactNumber && (
                  <p className="text-sm text-red-500 mt-1">{errorMessages.contactNumber}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  readOnly
                  value={employerData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter the country"
                />
              </div>
              <div>
                <label
                  htmlFor="companyDescription"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Company Information
                </label>
                <textarea
                  type="text"
                  id="companyDescription"
                  name="companyDescription"
                  value={employerData.companyDescription}
                  onChange={handleInputChange}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter the country"
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* Internship Details Section */}
          <div className="p-4 border border-gray-300 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-left mb-4 flex items-center gap-2">
              <MdInfo />
              Internship Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="internshipTitle"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Internship Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="internshipTitle"
                  name="internshipTitle"
                  value={internshipData.internshipTitle}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter internship title"
                />
              </div>
              <div>
                <label
                  htmlFor="internshipType"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Internship Type
                </label>
                <input
                  type="text"
                  id="internshipType"
                  name="internshipType"
                  value={internshipData.internshipType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter internship type"
                />
              </div>
              <div>
                <label
                  htmlFor="internshipField"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Internship Field
                </label>
                <input
                  type="text"
                  id="internshipField"
                  name="internshipField"
                  value={internshipData.internshipField}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter field of internship"
                />
              </div>
              <div>
                <label
                  htmlFor="internshipNature"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Internship Nature
                </label>
                <input
                  type="text"
                  id="internshipNature"
                  name="internshipNature"
                  value={internshipData.internshipNature}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter internship nature"
                />
              </div>
            </div>
          </div>

          {/* Application Requirements Section */}
          <div className="p-4 border border-gray-300 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-left mb-4 flex items-center gap-2">
              <MdAccessTime />
              Application Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Duration (months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={internshipData.duration}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter internship duration"
                />
              </div>
              <div>
                <label
                  htmlFor="stipend"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Stipend (INR)
                </label>
                <input
                  type="number"
                  id="stipend"
                  name="stipend"
                  value={internshipData.stipend}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter stipend"
                />
              </div>
              <div>
                <label
                  htmlFor="eligibilityCriteria"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  value={internshipData.eligibilityCriteria}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter eligibility criteria"
                />
              </div>
              <div>
                <label
                  htmlFor="totalVacancies"
                  className="block text-sm font-medium text-gray-700 text-left"
                >
                  Total Vacancies <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="totalVacancies"
                  name="totalVacancies"
                  value={internshipData.totalVacancies}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter number of vacancies"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-500 text-white rounded-md px-6 py-2 hover:bg-gray-600"
              onClick={() => setInternshipData({
                internshipTitle: "",
                companyName: "",
                internshipType: "",
                internshipField: "",
                internshipNature: "",
                internshipDescription: "",
                requiredSkills: "",
                duration: "",
                applicationStartDate: "",
                applicationEndDate: "",
                stipend: "",
                eligibilityCriteria: "",
                degreesPreferred: "",
                email: "",
                contactNumber: "",
                totalVacancies: "",
                country: "",
                state: "",
                district: "",
              })}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white rounded-md px-6 py-2 flex items-center gap-2 hover:bg-indigo-700"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <MdSave />
                  Post Internship
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInternship;
