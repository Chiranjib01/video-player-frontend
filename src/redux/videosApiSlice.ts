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
    unlikeVideo: builder.mutation({
      query: (videoId) => ({
        url: `${VIDEOS_URL}/${videoId}/unlike`,
        method: "POST",
      }),
    }),
    dislikeVideo: builder.mutation({
      query: (videoId) => ({
        url: `${VIDEOS_URL}/${videoId}/dislike`,
        method: "POST",
      }),
    }),
    undislikeVideo: builder.mutation({
      query: (videoId) => ({
        url: `${VIDEOS_URL}/${videoId}/undislike`,
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
    getMyVideos: builder.query({
      query: () => `${VIDEOS_URL}/me`,
    }),
    getLikedVideos: builder.query({
      query: () => `${VIDEOS_URL}/liked/me`,
    }),
  }),
});

export const {
  useCreateVideoMutation,
  useLikeVideoMutation,
  useUnlikeVideoMutation,
  useDislikeVideoMutation,
  useUndislikeVideoMutation,
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  useGetVideosByUserIdQuery,
  useGetVideosByQueryQuery,
  useGetMyVideosQuery,
  useGetLikedVideosQuery,
} = videosApiSlice;
