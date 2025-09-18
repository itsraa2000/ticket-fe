import { type NextRequest, NextResponse } from "next/server"
import { QueueStore } from "@/lib/queue-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as any

    let jobs
    if (status) {
      jobs = QueueStore.getJobsByStatus(status)
    } else {
      jobs = QueueStore.getAllJobs()
    }

    return NextResponse.json({
      success: true,
      data: jobs,
      count: jobs.length,
    })
  } catch (error) {
    console.error("Error fetching queue jobs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch queue jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    if (!type) {
      return NextResponse.json({ success: false, error: "Job type is required" }, { status: 400 })
    }

    const newJob = QueueStore.addJob(type, data)

    return NextResponse.json(
      {
        success: true,
        data: newJob,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating queue job:", error)
    return NextResponse.json({ success: false, error: "Failed to create queue job" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    QueueStore.clearCompletedJobs()

    return NextResponse.json({
      success: true,
      message: "Completed jobs cleared successfully",
    })
  } catch (error) {
    console.error("Error clearing completed jobs:", error)
    return NextResponse.json({ success: false, error: "Failed to clear completed jobs" }, { status: 500 })
  }
}
