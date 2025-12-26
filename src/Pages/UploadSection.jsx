import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UploadSection = () => {
	const [value, setValue] = useState("");

	const handleSubmit = (e) => {
    e.preventDefault();
    const resetForm = () => {
    setValue("")
     };

    const payload = {
    section_name: value,
    };


		setValue("");
	
    axios
      .post("/sections", payload)
      .then((res) => {
        console.log("POST /sections response:", res.data);
        toast.success("Section created successfully!");
        resetForm();
      })

      .catch((err) => {
        console.error("POST /sections error:", err.response?.data || err);
        toast.error("Failed to create section");
      });
  };

	return ( 
         <div className="min-h-screen flex items-center justify-center">
			<div className="p-12 rounded-2xl shadow-lg w-full max-w-3xl mx-4 border border-gray-200">
			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				<input
					className="input input-accent w-full px-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
					type="text"
					placeholder="Enter section name"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="btn bg-teal-600 text-white rounded-full py-2 px-4 hover:scale-105 transition-transform duration-200"
				>
				create Section
				</button>
			</form>
           </div>  
		</div>
	);
};

export default UploadSection;

