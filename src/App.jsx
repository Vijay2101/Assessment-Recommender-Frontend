import { useState } from "react";
import { api } from "./api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await api.post("/recommend", { query });
      setResults(res.data.recommended_assessments || []);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch recommendations");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            SHL Assessment Recommender
          </h1>
          <p className="mt-3 text-gray-600">
            AI-powered system for recommending relevant SHL assessments
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-3">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Data Analyst, Leadership role, Graduate hiring"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg
                         hover:bg-blue-700 transition font-medium"
            >
              {loading ? "Searching..." : "Recommend"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 mt-6">
            Fetching recommendations...
          </p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-10 space-y-6">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200
                           p-6 shadow-sm hover:shadow-md transition"
              >
                {/* Title & Duration */}
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  {item.duration !== null && (
                    <span className="text-sm text-gray-500">
                      ⏱ {item.duration} mins
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-gray-600">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.test_type?.map((type, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700
                                 text-xs px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}

                  {item.adaptive_support && (
                    <span className="bg-green-50 text-green-700
                                     text-xs px-3 py-1 rounded-full">
                      Adaptive: {item.adaptive_support}
                    </span>
                  )}

                  {item.remote_support && (
                    <span className="bg-purple-50 text-purple-700
                                     text-xs px-3 py-1 rounded-full">
                      Remote: {item.remote_support}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-5">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Assessment →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No recommendations yet. Please enter a query above.
          </p>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-14">
          Built for SHL AI Intern Assignment · RAG-based Recommendation System
        </p>
      </div>
    </div>
  );
}
