import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { SyncService } from "../services";

const SYNC_TASK = "MIDNIGHT_SYNC_TASK";

TaskManager.defineTask(SYNC_TASK, async () => {
  try {
    console.log("[SyncScheduler] Background task triggered");
    await SyncService.performSync();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("[SyncScheduler] Task failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export class SyncScheduler {
  static async register(): Promise<void> {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(SYNC_TASK);
    if (isRegistered) return;

    await BackgroundTask.registerTaskAsync(SYNC_TASK, {
      minimumInterval: 60 * 60 * 12, // 12 hours
    });
    console.log("[SyncScheduler] ✅ Background task registered");
  }

  static async unregister(): Promise<void> {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(SYNC_TASK);
    if (isRegistered) {
      await BackgroundTask.unregisterTaskAsync(SYNC_TASK);
    }
  }

  static setupNotificationHandler(): void {}
}
