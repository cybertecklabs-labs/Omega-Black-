import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Vulnerability', 'Target', 'User', 'Workflow'],
    endpoints: (builder) => ({
        // Auth
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (user) => ({
                url: '/auth/register',
                method: 'POST',
                body: user,
            }),
        }),
        getMe: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),

        // Vulnerabilities
        getVulnerabilities: builder.query({
            query: () => '/vulnerabilities',
            providesTags: ['Vulnerability'],
        }),
        getVulnerability: builder.query({
            query: (id) => `/vulnerabilities/${id}`,
            providesTags: (result, error, id) => [{ type: 'Vulnerability', id }],
        }),
        createVulnerability: builder.mutation({
            query: (body) => ({
                url: '/vulnerabilities',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Vulnerability'],
        }),
        cloneVulnerability: builder.mutation({
            query: (id) => ({
                url: `/vulnerabilities/${id}/clone`,
                method: 'POST',
            }),
            invalidatesTags: ['Vulnerability'],
        }),

        // Targets
        getTargets: builder.query({
            query: () => '/targets',
            providesTags: ['Target'],
        }),
        createTarget: builder.mutation({
            query: (body) => ({
                url: '/targets',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Target'],
        }),
        startRecon: builder.mutation({
            query: (id) => ({
                url: `/targets/${id}/recon`,
                method: 'POST',
            }),
            invalidatesTags: ['Target'],
        }),

        // AI Agent
        runAgent: builder.mutation({
            query: (body) => ({
                url: '/agent/chat',
                method: 'POST',
                body,
            }),
        }),

        // n8n
        getWorkflows: builder.query({
            query: () => '/n8n/workflows',
            providesTags: ['Workflow'],
        }),
        executeWorkflow: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/n8n/workflows/${id}/execute`,
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useGetVulnerabilitiesQuery,
    useGetVulnerabilityQuery,
    useCreateVulnerabilityMutation,
    useCloneVulnerabilityMutation,
    useGetTargetsQuery,
    useCreateTargetMutation,
    useStartReconMutation,
    useRunAgentMutation,
    useGetWorkflowsQuery,
    useExecuteWorkflowMutation,
} = apiSlice;
