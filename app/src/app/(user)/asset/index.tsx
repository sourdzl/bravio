import { useAssetList, useBalanceList } from '@/api/assets';
import AssetListItem from '@/components/AssetListItem';
import { supabase } from '@/lib/supabase';
import { ActivityIndicator, FlatList, Text } from 'react-native';

export default function AssetScreen() {
  const { data: assets, error, isLoading } = useAssetList();
  const { data: balances, _error, _isLoading } = useBalanceList(supabase.auth.getUser().id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <FlatList
      data={assets}
      renderItem={({ item }) => <AssetListItem asset={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
