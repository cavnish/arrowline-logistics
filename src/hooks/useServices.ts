import { useState, useEffect, useCallback } from 'react';
import {
  getAllMainServices,
  getMainServiceBySlug,
  getSubServiceBySlug,
  MainServiceData,
  SubServiceData,
} from '../data/servicesData';
import { contentService, Service, ServiceItem } from '../services/contentService';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [mainServices, setMainServices] = useState<MainServiceData[]>(getAllMainServices());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'fallback'>('fallback');

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch published services and items from the Express public API.
      const [servicesData, serviceItemsData] = await Promise.all([
        contentService.getServices(),
        contentService.getServiceItems(),
      ]);

      if (servicesData && servicesData.length > 0) {
        setServices(servicesData);
        setServiceItems(serviceItemsData || []);

        // Transform into rich MainServiceData objects
        const richList: MainServiceData[] = await Promise.all(
          servicesData.map(async (s) => {
            const detail = await contentService.getServiceDetail(s.slug);
            return detail || getMainServiceBySlug(s.slug)!;
          })
        );

        setMainServices(richList.filter(Boolean));
        setSource('api');
        setError(null);
      } else {
        // Fallback to static data if no API rows
        console.info('[useServices] API returned 0 services; using static fallback.');
        setMainServices(getAllMainServices());
        setSource('fallback');
      }
    } catch (err: any) {
      console.warn('[useServices] Error fetching services, using static fallback:', err);
      setError(err.message || 'Error fetching services from API');
      setMainServices(getAllMainServices());
      setSource('fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const getServiceBySlug = (slug: string): Service | undefined => {
    const normalized = slug === 'rail-multimodal-logistics' ? 'rail-transportation' : slug;
    return services.find(service => service.slug === normalized || service.slug === slug);
  };

  const getServiceItemBySlug = (serviceSlug: string, itemSlug: string): ServiceItem | undefined => {
    const normalized = serviceSlug === 'rail-multimodal-logistics' ? 'rail-transportation' : serviceSlug;
    const parent = getServiceBySlug(normalized);
    if (!parent) return undefined;
    return serviceItems.find(item => item.slug === itemSlug && item.service_id === parent.id);
  };

  const getServiceItemsByServiceSlug = (serviceSlug: string): ServiceItem[] => {
    const normalized = serviceSlug === 'rail-multimodal-logistics' ? 'rail-transportation' : serviceSlug;
    const parent = getServiceBySlug(normalized);
    if (!parent) return [];
    return serviceItems.filter(item => item.service_id === parent.id);
  };

  const getMainService = (slug: string): MainServiceData | undefined => {
    const normalized = slug === 'rail-multimodal-logistics' ? 'rail-transportation' : slug;
    return mainServices.find(s => s.slug === normalized || s.slug === slug) || getMainServiceBySlug(slug) || getMainServiceBySlug(normalized);
  };

  const getSubService = (serviceSlug: string, itemSlug: string): SubServiceData | undefined => {
    const normalized = serviceSlug === 'rail-multimodal-logistics' ? 'rail-transportation' : serviceSlug;
    const main = getMainService(normalized);
    if (main && main.subServices) {
      const found = main.subServices.find(sub => sub.slug === itemSlug);
      if (found) return found;
    }
    return getSubServiceBySlug(normalized, itemSlug) || getSubServiceBySlug(serviceSlug, itemSlug);
  };

  return {
    services,
    serviceItems,
    mainServices,
    loading,
    error,
    source,
    getServiceBySlug,
    getServiceItemBySlug,
    getServiceItemsByServiceSlug,
    getMainService,
    getSubService,
    refetch: fetchServices,
  };
};

export default useServices;