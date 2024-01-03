import * as Notifications from 'expo-notifications';
import { NotificationContentInput, NotificationTriggerInput, Notification } from 'expo-notifications'
import { GroceryItemType } from './storage';

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


/**
 * 
 * @param content NotificationContentInput
 * {
 *    title: `Some groceries are expiring tomorrow`,
 *    body: `${formInputs.name} expiring tomorrow`,
 *    data: { groceryItemIds: [] },
 * }
 * @param trigger NotificationTriggerInput
 * {
 *    channelId: '???',
 *    date: Date object or Unix Timestamp,
 * }
 * @returns notification identifier
 */
export const addLocalNotification = async (content: NotificationContentInput, trigger: NotificationTriggerInput) => {
  const identifier = await Notifications.scheduleNotificationAsync({
    content,
    trigger
  });
  return identifier;
}


/**
 * 
 * @param groceryItem GroceryItemType
 * 
 */
export const editLocalNotification = async (groceryItem: GroceryItemType) => {
  // TODO - if expo-notifications ever allows editing existing scheduleNotification then use that function instead of creating an deleting.
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  // Delete item from existing notifcations
  groceryItem?.scheduleIds.forEach( async (id: any): Promise<void> => {
    const matchingNotification = scheduledNotifications.find((notification: Notifications.NotificationRequest ) => notification?.identifier === id);
    console.log('matchingNotification', matchingNotification)
    // If other groceryItems exists create new version of the notification
    if (matchingNotification) {
      if (matchingNotification?.content.data.groceryItemIds.length > 1) {
        // matchingNotification?.content.data.groceryItemIds
        // addLocalNotification()
      }
      // Delete old Notification
      await Notifications.cancelScheduledNotificationAsync(matchingNotification.identifier);
    }
  });
  // Check if new expiryDate already has notification
  const expiryDate = new Date(groceryItem.expiryDate);
  const matchingNotification = scheduledNotifications.find((notification: any ) => notification?.trigger?.date === expiryDate);
  if (matchingNotification) {
    // Create clone existing notification
    
    // Add new groceryItem details

  }
  // Create new notification with details
  // addLocalNotification()
  // Delete old notification 
}