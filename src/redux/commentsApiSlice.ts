import { apiSlice } from "./apiSlice";

const COMMENTS_URL = "/api/comments";

const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postComment: builder.mutation({
      query: ({ videoId, text }) => ({
        url: `${COMMENTS_URL}/${videoId}`,
        method: "POST",
        body: { text },
      }),
    }),
    getComments: builder.query({
      query: (videoId) => `${COMMENTS_URL}/${videoId}`,
    }),
    deleteComment: builder.mutation({
      query: ({ videoId, commentId }) => ({
        url: `${COMMENTS_URL}/${videoId}`,
        method: "DELETE",
        headers: { commentId },
      }),
    }),
  }),
});

export const {
  usePostCommentMutation,
  useGetCommentsQuery,
  useDeleteCommentMutation,
} = commentsApiSlice;
