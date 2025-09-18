import type { QueueJob } from "./types"

// In-memory queue storage
let jobs: QueueJob[] = []

export class QueueStore {
  static getAllJobs(): QueueJob[] {
    return jobs
  }

  static getJobById(id: string): QueueJob | undefined {
    return jobs.find((job) => job.id === id)
  }

  static addJob(type: QueueJob["type"], data: any): QueueJob {
    const newJob: QueueJob = {
      id: Date.now().toString(),
      type,
      data,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    jobs.push(newJob)

    // Simulate async processing
    setTimeout(
      () => {
        this.processJob(newJob.id)
      },
      Math.random() * 5000 + 1000,
    ) // Random delay between 1-6 seconds

    return newJob
  }

  static processJob(id: string): void {
    const jobIndex = jobs.findIndex((job) => job.id === id)
    if (jobIndex === -1) return

    jobs[jobIndex] = {
      ...jobs[jobIndex],
      status: "processing",
    }

    // Simulate processing time
    setTimeout(
      () => {
        const job = jobs.find((j) => j.id === id)
        if (job) {
          job.status = Math.random() > 0.1 ? "completed" : "failed" // 90% success rate
          job.processedAt = new Date().toISOString()
        }
      },
      Math.random() * 3000 + 1000,
    ) // Random processing time 1-4 seconds
  }

  static getJobsByStatus(status: QueueJob["status"]): QueueJob[] {
    return jobs.filter((job) => job.status === status)
  }

  static clearCompletedJobs(): void {
    jobs = jobs.filter((job) => job.status !== "completed")
  }
}
