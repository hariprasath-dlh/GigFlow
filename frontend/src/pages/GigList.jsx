import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get(`/gigs?search=${search}`)
      .then((res) => setGigs(res.data))
      .catch(() => alert("Failed to load gigs"));
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Available Gigs</h1>

        <input
          type="text"
          placeholder="Search gigs..."
          className="w-full p-2 border mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-3">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="text-lg font-semibold">{gig.title}</h2>
              <p className="text-sm text-gray-600">Budget: ₹{gig.budget}</p>

              <Link
                to={`/gigs/${gig._id}`}
                className="text-blue-600 mt-2 inline-block"
              >
                View Details →
              </Link>
            </div>
          ))}

          {gigs.length === 0 && (
            <p className="text-gray-500">No gigs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigList;
