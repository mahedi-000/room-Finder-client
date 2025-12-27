import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UploadCourse = () => {
	const [courseCode, setCourseCode] = useState("");
	const [courseName, setCourseName] = useState("");

	const resetForm = () => {
		setCourseCode("");
		setCourseName("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = {
			course_code: courseCode,
			course_name: courseName,
		};

		axios
			.post("/courses", payload)
			.then((res) => {
				console.log("POST /courses response:", res.data);
				toast.success("Course created successfully!");
				resetForm();
			})
			.catch((err) => {
				console.error("POST /courses error:", err.response?.data || err);
				toast.error("Failed to create course");
			});
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="p-12 rounded-2xl shadow-lg w-full max-w-3xl mx-4 border border-gray-200">
				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<input
					className="input input-accent w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
					type="text"
					placeholder="Enter course code"
					value={courseCode}
					onChange={(e) => setCourseCode(e.target.value)}
					required
				/>
				<input
					className="input input-accent w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
					type="text"
					placeholder="Enter course name"
					value={courseName}
					onChange={(e) => setCourseName(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="btn bg-teal-600 text-white rounded-full py-2 px-4 hover:scale-105 transition-transform duration-200"
				>
					Create Course
				</button>
				</form>
			</div>
		</div>
	);
};

export default UploadCourse;


