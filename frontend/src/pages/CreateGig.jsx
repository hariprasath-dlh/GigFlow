import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateGig = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/gigs", {
        ...form,
        budget: Number(form.budget),
      });
      navigate("/gigs");
    } catch {
      alert("Failed to create gig");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Create Gig</h2>

        <input
          name="title"
          placeholder="Title"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="budget"
          type="number"
          placeholder="Budget"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Create Gig
        </button>
      </form>
    </div>
  );
};

export default CreateGig;
