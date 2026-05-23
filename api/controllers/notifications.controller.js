import Notification from '../models/notifications.model.js';

// Create a new notification
export const createNotification = async (fromUser, toUser, listingId, propertyTitle) => {
  try {
    const notification = new Notification({
      fromUser,
      toUser,
      listingId,
      propertyTitle,
    });
    await notification.save();
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Fetch notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ toUser: req.params.userId })
      .populate('fromUser', 'username')
      .populate('listingId', 'title')
      .populate("listingId", "image title")
      .sort({ sentAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notifId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
