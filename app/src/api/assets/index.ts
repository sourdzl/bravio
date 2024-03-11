import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export const useAssetList = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data, error } = await supabase.from('assets').select('*');
      if (error) {
        throw new Error(error.message);
      }
      console.log(data);
      return data;
    },
  });
};

export const useAsset = (id: number) => {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
