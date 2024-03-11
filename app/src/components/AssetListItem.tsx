import { Link, useSegments } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';
import { Tables } from '../types';
import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type AssetListItemProps = {
  asset: Tables<'assets'>;
};

const AssetListItem = ({ asset }: AssetListItemProps) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/asset/${asset.id}`} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path={asset.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>{asset.name}</Text>
        <Text style={styles.price}>${asset.price}</Text>
      </Pressable>
    </Link>
  );
};

export default AssetListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: '50%',
  },

  image: {
    width: '100%',
    aspectRatio: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
});
