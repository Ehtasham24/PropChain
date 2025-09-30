// src/services/properties.hooks.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BoughtPropertyData } from '@/types/types/common.types';

const api = axios.create({
  baseURL: 'http://localhost:8000/v1',
});

interface PropertiesResponse {
  data: BoughtPropertyData[];
}

export const useAllProperties = () => {
  return useQuery<PropertiesResponse>({
    queryKey: ['allProperties'],
    queryFn: async () => {
      const response = await api.get('/api/properties');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 2,
  });
};

export const usePurchasedProperties = (walletAddress: string) => {
  return useQuery({
    queryKey: ['purchasedProperties', walletAddress],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/v1/user/${walletAddress}/properties`,
      );
      return response.data;
    },
    enabled: !!walletAddress, // Only fetch when wallet address exists
    retry: 2, // Optional: Add retry logic
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
