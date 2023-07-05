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
    getAllVideos: builder.query({
      query: () => `${VIDEOS_URL}/videos`,
    }),
    getVideoById: builder.query({
      query: (id) => `${VIDEOS_URL}/video?videoid=${id}`,
    }),
  }),
});

export const {
  useCreateVideoMutation,
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
} = videosApiSlice;
