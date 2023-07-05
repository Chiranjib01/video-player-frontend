import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PATCH",
        body: data,
      }),
    }),
    subscribe: builder.mutation({
      query: (channelId) => ({
        url: `${USERS_URL}/${channelId}/subscribe`,
        method: "POST",
      }),
    }),
    unsubscribe: builder.mutation({
      query: (channelId) => ({
        url: `${USERS_URL}/${channelId}/unsubscribe`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useSubscribeMutation,
  useUnsubscribeMutation,
  useLogoutMutation,
} = authApiSlice;
