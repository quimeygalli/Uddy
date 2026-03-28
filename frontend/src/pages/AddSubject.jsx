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
    weeklyTime: "",
    category: "",
  });

  const handleData = (data) => {
    setFormData({
      ...formData,
      [data.target.name]: data.target.value,
    });
  };

  const createSubject = (event) => {
    event.preventDefault();
    console.log(formData);
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
          <label className="">Weekly study time</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="number"
            name="weeklyTime"
            min="1"
            placeholder="In hours"
          />
          <label className="">Category</label>
          <select
            required
            onChange={handleData}
            className="form_fields"
            name="category"
          >
            <option className="text-gray-500" value="none" disabled selected>
              Type of subject
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
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
