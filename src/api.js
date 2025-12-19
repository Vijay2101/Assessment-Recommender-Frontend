import axios from "axios";

export const api = axios.create({
  baseURL: "https://gen-ai-assessment-recommender.vercel.app/recommend", // FastAPI deployed URL
});
