import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const GigDetail = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Logged-in user

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({ message: "", price: "" });

  // 1. Fetch Gig & Bids
  const fetchData = async () => {
    try {
      // Fetch all gigs to find the current one (frontend search limitation)
      // Ideally backend should support GET /gigs/:id directly
      const gigRes = await api.get("/gigs");
      const foundGig = gigRes.data.find((g) => g._id === id);
      setGig(foundGig);

      // Detect ownership safely
      const isOwner = user && foundGig && (foundGig.ownerId === user._id || foundGig.ownerId._id === user._id);

      if (isOwner) {
        // Fetch bids only if owner
        const bidRes = await api.get(`/bids/${id}`);
        setBids(bidRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch gig data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]); // Re-run if ID or User changes

  // 2. Submit Bid (Freelancer)
  const submitBid = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bids", {
        gigId: id,
        ...bidForm,
        price: Number(bidForm.price),
      });
      alert("Bid submitted successfully!");
      setBidForm({ message: "", price: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Bid failed");
    }
  };

  // 3. Hire Bid (Owner)
  const hireBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to hire this freelancer? This action cannot be undone.")) return;

    try {
      await api.patch(`/bids/${bidId}/hire`);
      alert("Freelancer hired successfully!");
      // Re-fetch data to update UI (Gig status -> assigned, Bid status -> hired/rejected)
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Hire failed");
    }
  };

  if (!gig) return <div className="p-8 text-center text-gray-500">Loading gig details...</div>;

  const isOwner = user && (gig.ownerId === user._id || gig.ownerId._id === user._id);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Gig Info Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
              <p className="mt-2 text-gray-600">{gig.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
              {gig.status.toUpperCase()}
            </span>
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="text-lg font-semibold text-gray-900">Budget: ₹{gig.budget}</p>
          </div>
        </div>

        {/* Freelancer View: Bid Form */}
        {!isOwner && gig.status === "open" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Proposal</h2>
            <form onSubmit={submitBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                <textarea
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  placeholder="Why are you a good fit for this gig?"
                  value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bid Amount (₹)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  placeholder="Enter your price"
                  value={bidForm.price}
                  onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Proposal
              </button>
            </form>
          </div>
        )}

        {/* Owner View: Bid Management */}
        {isOwner && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Received Bids ({bids.length})</h2>

            {bids.length === 0 ? (
              <p className="text-gray-500">No bids received yet.</p>
            ) : (
              <div className="grid gap-4">
                {bids.map((bid) => (
                  <div key={bid._id} className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {bid.freelancerId?.name || "Freelancer"}
                        </span>
                        <span className="text-sm text-gray-500">({bid.freelancerId?.email})</span>
                      </div>
                      <p className="mt-1 text-gray-600">{bid.message}</p>
                      <p className="mt-2 font-medium text-indigo-600">Bid: ₹{bid.price}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-4">
                      {/* Status Badge */}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bid.status === 'hired' ? 'bg-green-100 text-green-800' :
                          bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {bid.status.toUpperCase()}
                      </span>

                      {/* Hire Button: Only if Gig is open AND Bid is pending */}
                      {gig.status === 'open' && bid.status === 'pending' && (
                        <button
                          onClick={() => hireBid(bid._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm"
                        >
                          Hire
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GigDetail;
