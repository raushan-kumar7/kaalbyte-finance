import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { SyncService } from "../services";

const SYNC_TASK = "MIDNIGHT_SYNC_TASK";

TaskManager.defineTask(SYNC_TASK, async () => {
  try {
    console.log(
      "[SyncScheduler] Background task triggered at",
      new Date().toISOString(),
    );
    await SyncService.performSync();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export class SyncScheduler {
  static async register(): Promise<void> {
    await this.registerBackgroundTask();
  }

  // No-op kept for call-site compatibility in _layout.tsx
  static setupNotificationHandler(): void {}

  static async unregister(): Promise<void> {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(SYNC_TASK);
    if (isRegistered) {
      await BackgroundTask.unregisterTaskAsync(SYNC_TASK);
    }
  }

  private static async registerBackgroundTask(): Promise<void> {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(SYNC_TASK);
    if (isRegistered) return;

    await BackgroundTask.registerTaskAsync(SYNC_TASK, {
      minimumInterval: 60 * 60 * 12, // 12h minimum — OS throttles this
    });

    console.log("[SyncScheduler] ✅ Background task registered");
  }
}
