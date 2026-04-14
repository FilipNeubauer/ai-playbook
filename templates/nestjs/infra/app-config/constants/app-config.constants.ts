// Mirrors the app_config_key Postgres enum — add new keys here AND in the DB migration
export enum AppConfigKey {
	ForceUpdateEnabled = "app_force_update_enabled",
	MinVersionIos = "app_min_version_ios",
	MinVersionAndroid = "app_min_version_android",
	StoreUrlIos = "app_store_url_ios",
	StoreUrlAndroid = "app_store_url_android",
}

export const PLATFORM_VERSION_KEY: Record<string, AppConfigKey> = {
	ios: AppConfigKey.MinVersionIos,
	android: AppConfigKey.MinVersionAndroid,
}

export const PLATFORM_STORE_URL_KEY: Record<string, AppConfigKey> = {
	ios: AppConfigKey.StoreUrlIos,
	android: AppConfigKey.StoreUrlAndroid,
}
