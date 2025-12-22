import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TeamGroup from "@/models/Team";
import team from "@/constants/team";

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data (optional - remove if you want to keep existing data)
    // await TeamGroup.deleteMany({});

    // Insert all team data
    const result = await TeamGroup.insertMany(team);

    return NextResponse.json(
      {
        success: true,
        message: "Team data added successfully",
        count: result.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding team data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add team data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
