import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TeamGroup from "@/models/Team";

export async function GET() {
  try {
    await dbConnect();

    const teams = await TeamGroup.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: teams,
        count: teams.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching team data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
