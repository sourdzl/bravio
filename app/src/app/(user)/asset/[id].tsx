import { useAsset } from '@/api/assets';
import { defaultPizzaImage } from '@/components/AssetListItem';
import RemoteImage from '@/components/RemoteImage';
import Button from '@components/Button';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
const actions = ['DEPOSIT', 'WITHDRAW']; // todo: transfer

function viewAsset() {
  console.log('viewAsset');
}

const AssetDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const { data: asset, error, isLoading } = useAsset(id);


  const router = useRouter();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch assets</Text>;
  }

  console.log(asset);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: asset.name }} />

      <RemoteImage
        path={asset?.image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />

      <Text>Select size</Text>
      <View style={styles.sizes}>
        {actions.map((action) => (
          <Pressable
            onPress={() => {
              console.log(action);
            }}
            style={[
              styles.size,
              {
                backgroundColor: action === 'DEPOSIT' ? 'gainsboro' : 'white',
              },
            ]}
            key={action}
          >
            <Text
              style={[
                styles.sizeText,
                {
                  color: 'DEPOSIT' === action ? 'black' : 'gray',
                },
              ]}
            >
              {action}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>${asset.price}</Text>
      <Button onPress={viewAsset} text="view Asset" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },

  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  },
});

export default AssetDetailsScreen;
