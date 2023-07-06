import { apiSlice } from "./apiSlice";

const VIDEOS_URL = "/api/videos";

const videosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createVideo: builder.mutation({
      query: (data) => ({
        url: `${VIDEOS_URL}/create`,
        method: "POST",
        body: data,
      }),
    }),
    likeVideo: builder.mutation({
      query: (videoId) => ({
        url: `${VIDEOS_URL}/${videoId}/like`,
        method: "POST",
      }),
    }),
    getAllVideos: builder.query({
      query: () => `${VIDEOS_URL}`,
    }),
    getVideoById: builder.query({
      query: (videoId) => `${VIDEOS_URL}/${videoId}`,
    }),
    getVideosByUserId: builder.query({
      query: (userId) => `${VIDEOS_URL}/user/${userId}`,
    }),
    getVideosByQuery: builder.query({
      query: (text) => `${VIDEOS_URL}/search/?q=${text}`,
    }),
  }),
});

export const {
  useCreateVideoMutation,
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  useGetVideosByUserIdQuery,
  useGetVideosByQueryQuery,
} = videosApiSlice;
