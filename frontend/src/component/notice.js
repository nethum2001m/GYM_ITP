import { IoIosWarning } from "react-icons/io";

const Notice = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
      <div className="flex items-center justify-center">
        <IoIosWarning className="mr-2 text-3xl text-yellow-500 " /> 
        <h3 className="text-lg font-bold text-red-600">Important Notice</h3>
      </div>

        <p className="mt-2 text-gray-700 text-lg">
          AI-generated diet plans should be reviewed by a professional before following.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-lg"
          onClick={onClose}
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default Notice;
