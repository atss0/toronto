import api from './api';

export interface City {
  id: string;
  name: string;
  country: string;
  image_url?: string;
  place_count?: number;
}

export interface CitiesData {
  popular: City[];
  all: City[];
}

const citiesService = {
  get: (params?: { query?: string }) =>
    api.get<{ success: boolean; data: CitiesData }>('/cities', { params }),
};

export default citiesService;
