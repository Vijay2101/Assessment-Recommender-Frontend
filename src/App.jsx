import { useState } from "react";
import { Search, Clock, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { api } from "./api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      {/* Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-blue-700 to-blue-900 -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

        {/* Header */}
        <div className="text-center mb-10 text-white">
          <div className="inline-flex items-center gap-2 bg-blue-500 border border-blue-300 rounded-full px-3 py-1 mb-4 backdrop-blur">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white">
              AI Powered
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 font-semibold text-gray-500">
            SHL Assessment Recommender
          </h1>

          <p className="font-semibold text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Describe the role or skills, and our RAG-based engine will find the perfect assessments.
          </p>
        </div>

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto -mb-8 z-10">
          <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-3 border border-gray-200 flex items-center gap-2">
            <div className="pl-4 text-gray-500">
              <Search className="w-6 h-6" />
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 bg-transparent border-none 
                         text-sm sm:text-base md:text-lg
                         text-gray-900 placeholder-gray-500
                         focus:ring-0 focus:outline-none py-3"
              placeholder="e.g. Data Analyst, Leadership role, Graduate hiring"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                         text-white px-4 sm:px-6 py-3 rounded-xl font-semibold
                         transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                "Recommend"
              )}
            </button>
          </div>
        </div>

        <div className="h-16" />

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-600 mt-8">
            Fetching recommendations...
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {results.map((item, idx) => (
              <AssessmentCard key={idx} item={item} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            No assessments found for "{query}"
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 border-t border-gray-300 pt-8 text-center">
          <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
            SHL AI Intern Assignment · RAG-based Recommendation System
          </p>
        </div>
      </div>
    </div>
  );
}

/* Card Component */
function AssessmentCard({ item }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm 
                    hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          {item.name}
        </h3>

        {item.duration !== null && (
          <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
            <Clock className="w-3 h-3" />
            {item.duration} mins
          </span>
        )}
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.test_type?.map((type, i) => (
          <span
            key={i}
            className="bg-blue-50 text-blue-700 border border-blue-100
                       text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {type}
          </span>
        ))}

        {item.adaptive_support && (
          <span className="bg-green-50 text-green-700 border border-green-100
                           text-xs font-medium px-2.5 py-0.5 rounded-full">
            Adaptive: {item.adaptive_support}
          </span>
        )}

        {item.remote_support && (
          <span className="bg-purple-50 text-purple-700 border border-purple-100
                           text-xs font-medium px-2.5 py-0.5 rounded-full">
            Remote: {item.remote_support}
          </span>
        )}
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        View Assessment <ArrowRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
}
