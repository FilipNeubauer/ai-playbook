import { NextResponse } from "next/server"

// TODO: Replace SHA256_CERT_FINGERPRINT with your Android app signing certificate fingerprint
// Get it with: keytool -list -v -keystore your-keystore.jks | grep SHA256
export async function GET() {
	return NextResponse.json(
		[
			{
				relation: ["delegate_permission/common.handle_all_urls"],
				target: {
					namespace: "android_app",
					package_name: "com.__project__",
					sha256_cert_fingerprints: ["SHA256_CERT_FINGERPRINT"],
				},
			},
		],
		{
			headers: {
				"Content-Type": "application/json",
			},
		},
	)
}
