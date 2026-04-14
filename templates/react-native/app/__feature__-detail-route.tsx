import { useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"

export default function __Feature__DetailRoute() {
	const { id } = useLocalSearchParams<{ id: string }>()
	return (
		<View>
			<Text>__Feature__ Detail: {id}</Text>
		</View>
	)
}
