import { useMyOrderList } from '@/api/orders';
import { ActivityIndicator, Text } from 'react-native';

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch</Text>;
  }

  return;
}
// {
//     <FlatList
//       data={orders}
//       renderItem={({ item }) => <OrderListItem order={item} />}
//       contentContainerStyle={{ gap: 10, padding: 10 }}
//     />
// }
