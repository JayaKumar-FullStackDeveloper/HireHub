import React, { useState } from "react";
import * as XLSX from "xlsx";

const ImportCandidates = ({ isCollapsed }) => {
  const [candidateData, setCandidateData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheet);
        jsonData = jsonData.map(({ _id, __v, createdAt, password, paymentStatus, updatedAt, ...rest }) => rest);

        setCandidateData(jsonData);
        setFormData(jsonData);
        setIsFileUploaded(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const openModal = (resumePath) => {
    setResumeUrl(resumePath);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResumeUrl("");
  };

  const handleSubmit = () => {
    console.log("Final Data to Submit:", formData);
    alert("Candidates data submitted successfully!");
  };

  return (
    <div className={`mx-auto ${isCollapsed ? "max-w-7xl" : "max-w-6xl"} h-full`}>
      <div className="w-full justify-between flex mb-2">
        <h1 className="text-2xl font-bold text-left">Import Candidates</h1>
        {isFileUploaded ? (
          <p className="text-lg font-semibold self-center text-slate-800 ">
            Uploaded File: <span className="pl-2 text-blue">{fileName}</span>
          </p>
        ) : null}
      </div>

      {!isFileUploaded ? (
        <div className="flex items-center justify-center h-full m-auto">
          <div className="text-center">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block mx-auto mb-4 p-2 border rounded"
            />
            <p className="text-gray-500">Upload an Excel file to import candidates.</p>
          </div>
        </div>
      ) : (
        <>
          {candidateData.length > 0 ? (
            <div className="w-full h-[520px] overflow-scroll scrollbar-hide border border-gray-300 rounded-lg mt-2" style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}>
              <table className="w-full bg-white border-collapse border-0">
                <thead className="bg-gray-200 sticky -top-0 w-full">
                  <tr>
                    <th className="py-3 px-4 border">S.No</th>
                    {Object.keys(candidateData[0]).filter((key) => key !== "resume").map((key) => (
                      <th key={key} className="py-3 px-4 border">
                        {key}
                      </th>
                    ))}
                    <th className="py-3 px-4 border">Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.map((row, index) => (
                    <tr key={index} className="text-center hover:bg-gray-100 cursor-pointer">
                      <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                        {index + 1}
                      </td>
                      {Object.keys(row)
                        .filter((key) => key !== "resume")
                        .map((key) => (
                          <td
                            key={key}
                            className="py-2 px-3 border-y whitespace-nowrap text-base font-normal"
                          >
                            {row[key]}
                          </td>
                        ))}
                      <td className="py-2 px-3 border-y whitespace-nowrap text-base font-normal">
                        {row.resume ? (
                          <button
                            onClick={() => openModal(row.resume)}
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                          >
                            View Resume
                          </button>
                        ) : (
                          "No Resume"
                        )}
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No candidate data available.</p>
          )}

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded mt-4 hover:bg-indigo-700"
          >
            Submit Data
          </button>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
            >
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
    </div>
  );
};

export default ImportCandidates;
