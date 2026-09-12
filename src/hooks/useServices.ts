import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  getAllMainServices,
  getMainServiceBySlug,
  getSubServiceBySlug,
  getAllSubServices,
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
  const [source, setSource] = useState<'supabase' | 'fallback'>('fallback');

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      if (!supabase) {
        console.warn('[useServices] Supabase client not configured; using static data fallback.');
        setMainServices(getAllMainServices());
        setSource('fallback');
        setLoading(false);
        return;
      }

      // Fetch published services from Supabase
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order');

      if (servicesError) throw servicesError;

      // Fetch published service items from Supabase
      const { data: serviceItemsData, error: serviceItemsError } = await supabase
        .from('service_items')
        .select('*')
        .eq('is_published', true)
        .order('display_order');

      if (serviceItemsError) throw serviceItemsError;

      if (servicesData && servicesData.length > 0) {
        setServices(servicesData as Service[]);
        setServiceItems((serviceItemsData || []) as ServiceItem[]);

        // Transform into rich MainServiceData objects
        const richList: MainServiceData[] = await Promise.all(
          servicesData.map(async (s) => {
            const detail = await contentService.getServiceDetail(s.slug);
            return detail || getMainServiceBySlug(s.slug)!;
          })
        );

        setMainServices(richList.filter(Boolean));
        setSource('supabase');
        setError(null);
      } else {
        // Fallback to static data if no database rows
        console.info('[useServices] Supabase returned 0 services; using static fallback.');
        setMainServices(getAllMainServices());
        setSource('fallback');
      }
    } catch (err: any) {
      console.warn('[useServices] Error fetching from Supabase, using static fallback:', err);
      setError(err.message || 'Error fetching services from database');
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