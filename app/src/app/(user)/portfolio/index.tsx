import { useAssetList } from "api/assets";
import AssetListItem from "components/AssetListItem";
import { ActivityIndicator, FlatList, Text } from "react-native";

export default function AssetScreen() {
  const { data: assets, error, isLoading } = useAssetList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch assets</Text>;
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
