import { NextResponse } from "next/server"

// TODO: Replace TEAM_ID with your Apple Developer Team ID
// TODO: Replace com.__project__ with your actual bundle identifier
export async function GET() {
	return NextResponse.json(
		{
			applinks: {
				apps: [],
				details: [
					{
						appID: "TEAM_ID.com.__project__",
						paths: ["*"],
					},
				],
			},
			webcredentials: {
				apps: ["TEAM_ID.com.__project__"],
			},
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		},
	)
}
