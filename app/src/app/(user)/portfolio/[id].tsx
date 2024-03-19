import { useAsset, useBalanceList } from "api/assets";
import { imageUSD } from "components/AssetListItem";
import RemoteImage from "components/RemoteImage";
import { useAuth } from "providers/AuthProvider";
import Button from "components/Button";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
const actions = ["DEPOSIT", "WITHDRAW"]; // todo: transfer

function viewAsset() {
  console.log("viewAsset");
}

const AssetDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);
  const { session, loading: authLoading } = useAuth();

  const { data: asset, error, isLoading } = useAsset(id);
  console.log(`user session: ${JSON.stringify(session)} asset_id: ${id}`);
  const {
    data: balances,
    _error,
    _isLoading,
  } = useBalanceList(session!.user.id);
  console.log(`balances: ${JSON.stringify(balances)} id: ${id}`);

  const router = useRouter();

  if (isLoading || authLoading) {
    return <ActivityIndicator />;
  }

  if (error || !balances) {
    return (
      <Text>
        Failed to fetch assets: error {error instanceof Error && error?.message}{" "}
        balances {JSON.stringify(balances)}
      </Text>
    );
  }

  // move this horrible matching logic to helper function
  let assetBalance = null;
  for (const _assetBalance of balances) {
    if (_assetBalance.assets.some((asset) => asset.id === id)) {
      assetBalance = _assetBalance.quantity;
    }
  }

  console.log(`assetBalance: ${assetBalance}`);
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: asset.name }} />

      <RemoteImage
        path={asset?.image}
        fallback={imageUSD}
        style={styles.image}
      />

      <Text style={styles.price}>Holdings: {assetBalance}</Text>
      <Text style={styles.price}>${asset.price}</Text>
      <Button style={styles.button} onPress={viewAsset} text="Deposit" />
      <Button onPress={viewAsset} text="Withdraw" />
      <Button onPress={viewAsset} text="Send" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 0,
    padding: 10,
  },
  image: {
    maxHeight: 80,
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "auto",
  },

  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "gainsboro",
    maxWidth: 10,
    aspectRatio: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default AssetDetailsScreen;
