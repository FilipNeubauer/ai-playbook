import { Modal, View, Text, TouchableOpacity, Linking } from "react-native"

type Props = {
	storeUrl: string
}

export function ForceUpdateModal({ storeUrl }: Props) {
	const handleUpdate = () => {
		Linking.openURL(storeUrl)
	}

	return (
		<Modal animationType="slide" transparent={false} visible>
			<View className="flex-1 items-center justify-center bg-white px-8">
				<Text className="mb-4 text-center text-2xl font-bold">Update Required</Text>
				<Text className="mb-8 text-center text-base text-gray-600">
					A new version is available. Please update to continue using the app.
				</Text>
				<TouchableOpacity
					onPress={handleUpdate}
					className="rounded-lg bg-blue-600 px-8 py-4"
				>
					<Text className="text-base font-semibold text-white">Update Now</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	)
}
