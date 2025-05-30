
import React from "react";

const DialerUI = () => {
  return (
    <div className="p-4 border rounded bg-white shadow w-full">
      <div className="flex flex-col space-y-2">
        <button className="bg-gray-100 border rounded p-2 text-left hover:bg-gray-200">Objection Scripts</button>
        <button className="bg-gray-100 border rounded p-2 text-left hover:bg-gray-200">Industry Data</button>
        <button className="bg-gray-100 border rounded p-2 text-left hover:bg-gray-200">Next Best Action</button>
      </div>
    </div>
  );
};

export default DialerUI;
