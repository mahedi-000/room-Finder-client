import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

const UploadSection = () => {
	const navigate = useNavigate();
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
				<button
					onClick={() => navigate("/admin")}
					className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium transition-colors"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Back to Admin Panel
				</button>
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

