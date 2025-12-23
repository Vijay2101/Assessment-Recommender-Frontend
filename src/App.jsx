import { useState } from "react";
import { Search, Clock, Sparkles, Loader2, ArrowRight, BrainCircuit, Target, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "./api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const res = await api.post("/recommend", { query });
      setResults(res.data.recommended_assessments || []);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch recommendations. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[120px] opacity-60" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-blue-50 blur-[100px] opacity-50" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-slate-100 blur-[120px] opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              AI-Powered Discovery
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
            Find the Perfect <br className="hidden sm:block" />
            <span className="text-indigo-600">SHL Assessment</span>
          </h1>

          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Leverage our RAG-based engine to match roles and skills with industry-leading assessments.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-3xl mx-auto z-20"
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2 sm:p-4 border border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center w-full">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="flex-1 bg-transparent border-none 
                           text-base sm:text-lg
                           text-slate-900 placeholder-slate-400
                           focus:ring-0 focus:outline-none py-4 px-3"
                placeholder="e.g. Senior Software Engineer, Leadership, Python..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed
                         text-white px-8 py-4 rounded-2xl font-bold
                         transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Get Recommendations</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Data Science", "Project Management", "Sales Executive", "Graduate Program"].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); }}
                className="text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Area */}
        <div className="mt-24">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                  <BrainCircuit className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-6 text-slate-500 font-medium animate-pulse">Scanning assessment database...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-red-50 rounded-3xl border border-red-100"
              >
                <p className="text-red-600 font-medium">{error}</p>
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-600" />
                    Top Recommendations
                  </h2>
                  <span className="text-sm font-semibold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-100">
                    {results.length} matches found
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((item, idx) => (
                    <AssessmentCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              </motion.div>
            ) : hasSearched ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No matches found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search terms or role description.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-12"
              >
                {[
                  { icon: BrainCircuit, title: "Smart Matching", desc: "AI-driven analysis of your requirements" },
                  { icon: Zap, title: "Instant Results", desc: "Get recommendations in seconds" },
                  { icon: Target, title: "Precise Fit", desc: "Find assessments that truly measure what matters" }
                ].map((feature, i) => (
                  <div key={i} className="text-center p-6">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-slate-200 pt-12 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">SHL Recommender</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              RAG-based Recommendation System · 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* Card Component */
function AssessmentCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 140;

  const isLong = item.description?.length > MAX_LENGTH;
  const displayText =
    !expanded && isLong
      ? item.description.slice(0, MAX_LENGTH) + "..."
      : item.description;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm 
                 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-12 -mt-12 transition-transform group-hover:scale-110" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {item.name}
          </h3>
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed relative z-10">
      {displayText}

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-indigo-600 font-semibold text-xs hover:underline"
        >
          {expanded ? "View less" : "View more"}
        </button>
      )}
    </p>


      <div className="space-y-4 relative z-10">
        <div className="flex flex-wrap gap-2">
          {item.test_type?.map((type, i) => (
            <span
              key={i}
              className="bg-slate-50 text-slate-600 border border-slate-100
                         text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            >
              {type}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            {item.duration !== null && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {item.duration}m
              </div>
            )}
            {item.adaptive_support && (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Adaptive Support" />
            )}
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 group/link"
          >
            Explore
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
