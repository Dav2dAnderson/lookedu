import api from './http';
import { components } from './generated/schema';

type EduceterList = components['schemas']['CentersList'];
type EduceterDetail = components['schemas']['CentersRetrieve'];
type UserProfile = components['schemas']['UserShort'];

export const apiClient = {
    auth: {
        login: (credentials: any) => api.post('/api/token/', credentials),
        register: (userData: any) => api.post('/user/register/', userData),
        refresh: (refresh: string) => api.post('/api/token/refresh/', { refresh }),
        logout: (refresh: string) => api.post('/user/logout/', { refresh }),
    },
    educenters: {
        list: () => api.get<EduceterList[]>('/api/educenters/'),
        get: (slug: string) => api.get<EduceterDetail>(`/api/educenters/${slug}/`),
    },
    profile: {
        me: () => api.get<UserProfile>('/api/me/'),
    },
    applications: {
        list: () => api.get<any[]>('/api/my-applications/'),
        get: (index: number) => api.get<any>(`/api/my-applications/${index}/`),
        create: (data: { center_id: number; course_id: number; content?: string }) =>
            api.post('/api/my-applications/', data),
        delete: (index: number) => api.delete(`/api/my-applications/${index}/`),
    },
};
