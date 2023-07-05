import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../utils/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => headers,
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["videos"],
  endpoints: () => ({}),
});
