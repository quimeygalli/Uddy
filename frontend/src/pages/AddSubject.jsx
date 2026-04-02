import React, { useEffect, useState } from "react";
import { createRoutesFromChildren } from "react-router-dom";

const AddSubject = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetch("http://localhost:8000/api/categories");
      const categories = await response.json();
      setCategories(categories);
    };

    getCategories();
  }, []); // We use [] for functions we want to run only when the page loads

  const [formData, setFormData] = useState({
    name: "",
    weekly_study_time: "", // Not really sticking to the naming convention but better for backend
    category: "none",
  });

  const handleData = (data) => {
    console.log(data.target.value);
    setFormData({
      ...formData,
      [data.target.name]: data.target.value,
    });
  };

  const createSubject = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access");

    const response = await fetch("http://localhost:8000/api/create-subject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Login check.
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(response);
    console.log(data);
  };

  return (
    <div className="w-full h-full p-20 bg-blue-100">
      <h1 className="text-3xl  font-bold  text-slate-600">Create subject</h1>
      <form
        onSubmit={createSubject}
        className="pt-20 flex items-center justify-center "
      >
        <div className="flex flex-col  gap-2 w-50 pb-4 text-slate-600">
          <label className="">Name</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="text"
            name="name"
            placeholder="e.g. Math"
          />
          <label className="">Weekly study time (Hours)</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="number"
            name="weekly_study_time"
            min="1"
            placeholder="In hours"
          />
          <label className="">Category</label>
          <select
            required
            onChange={handleData}
            className="form_fields"
            name="category"
            defaultValue="none"
          >
            <option className="text-gray-500" value="none" disabled>
              {/* Figure out how to make this work */}
              {/* Is this even needed? */}
              Type of subject
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="group border mt-2 text-cyan-100 border-zinc-400 rounded-md p-1 w-25 bg-mauve-700 hover:bg-mauve-200 cursor-pointer">
            <span className="group-hover:text-cyan-700">Add subject</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubject;
