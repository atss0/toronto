import api from './api';

export interface WeatherCurrent {
  temp_c: number;
  condition: string;
  icon: string;
  wind_kmh: number;
  humidity_percent: number;
  visibility_km: number;
  uv_index: number | null;
}

export interface WeatherHourly {
  time: string;
  temp_c: number;
  icon: string;
}

export interface WeatherWeekly {
  day: string;
  high: number;
  low: number;
  icon: string;
}

export interface WeatherData {
  city: string;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  weekly: WeatherWeekly[];
}

interface WeatherParams {
  city?: string;
  latitude?: number;
  longitude?: number;
}

const weatherService = {
  get: (params: WeatherParams) =>
    api.get<{ success: boolean; data: WeatherData }>('/weather', { params }),
};

export default weatherService;
