import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (userId, action, entity, entityId, details, ipAddress) => {
  try {
    await ActivityLog.create({ userId, action, entity, entityId, details, ipAddress });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};
