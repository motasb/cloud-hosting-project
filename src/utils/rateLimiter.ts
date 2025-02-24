const userCooldowns = new Map<string, number>();

export function isUserBlocked(userId: string): boolean {
  const now = Date.now();
  const lastUsage = userCooldowns.get(userId);

  if (lastUsage && now - lastUsage < 60000) {
    return true; // المستخدم لا يزال في فترة الحظر
  }

  userCooldowns.set(userId, now); // تحديث آخر وقت للاستخدام
  return false; // مسموح له بالاستخدام
}
