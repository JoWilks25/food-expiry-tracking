import * as Notifications from 'expo-notifications';
import { NotificationContentInput,
  NotificationTriggerInput,
  scheduleNotificationAsync,
  getAllScheduledNotificationsAsync,
  cancelScheduledNotificationAsync,
} from 'expo-notifications';
import moment from 'moment';
import { GroceryItemType } from './storage';

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * 
 * @param content NotificationContentInput
 * {
 *    title: 'Groceries expiring tomorrow',
 *    body: 'list of items comma delimited i.e. milk, cheese, bread',
 *    data: { groceryItems: [], reminderType: ReminderType },
 * }
 * @param trigger NotificationTriggerInput
 * {
 *    channelId: '???',
 *    date: Date object or Unix Timestamp,
 * }
 * @returns notification identifier
 */
const addScheduledNotification = async (content: NotificationContentInput, trigger: NotificationTriggerInput) => {
  let identifier = '';
  try {
    identifier = await scheduleNotificationAsync({
      content,
      trigger
    });
  } catch (error) {
    console.error('Error occurred:', error)
  }
  console.log('identifier:', identifier)
  return identifier;
}

enum ReminderType {
  dayOf = 'dayOf',
  before = 'before'
}

const helperFunction = async (scheduledNotifications: any, groceryItem: any, notificationDate: any, reminderType: ReminderType): Promise<void> => {
  const matchingNotification = scheduledNotifications.find((notification: any ) => moment.unix(notification?.trigger?.seconds).format('YYYY-MM-DD') === moment(notificationDate).format('YYYY-MM-DD') && notification.content.data.reminderType === reminderType);
  if (matchingNotification) {
    // If matching notifcation for expiry date found
    const newGroceryItems = [...matchingNotification.content.data.groceryItems];
    newGroceryItems.push({
      id: groceryItem.id,
      name: groceryItem.name,
    });
    // 1) create new notification including new groceryItem details
    await addScheduledNotification({
      title: 'Groceries Expiring today',
      body: `${newGroceryItems.map((groceryItem) => groceryItem.name).join(', ')}`,
      data: { groceryItems: newGroceryItems, reminderType },
    },
    {
      date: new Date(notificationDate),
    });
    // 2) delete old notification
    await cancelScheduledNotificationAsync(matchingNotification.identifier);
  } else {
    // If notification DOESN'T EXIST, just adds a new notification
    await addScheduledNotification({
      title: 'Groceries Expiring today',
      body: `${groceryItem.name}`,
      data: { groceryItems: [{ id: groceryItem.id, name: groceryItem.name, }], reminderType },
    },
    {
      date: new Date(notificationDate),
    });
  }
}

// NEW ITEM
// Will add up to 2 notifications by default, 1 for the expiry date, and 1 for the reminder x days before
export const addNotifications = async (groceryItems: GroceryItemType[], groceryItem: GroceryItemType): Promise<void> => {
  // Checks for notifications with new items expiry date
  const scheduledNotifications = await getAllScheduledNotificationsAsync();
  console.log('scheduledNotifications', scheduledNotifications)
  // ---- ADDING NOTIFICATION FOR EXPIRY DATE ----
  await helperFunction(scheduledNotifications, groceryItem, groceryItem.expiryDate, ReminderType.dayOf);
  // ---- ADDING NOTIFICATION FOR REMINDER DATE ----
  await helperFunction(scheduledNotifications, groceryItem, groceryItem.reminderDate, ReminderType.before);
}



// TODO - if expo-notifications ever allows editing existing scheduleNotification then use that function instead of creating an deleting.
/**
 *
 */
export const updateNotification = async (groceryItems: GroceryItemType[], editedGroceryItem: Partial<GroceryItemType>): Promise<void> => {
  // EDITED ITEM
  // Checks 
  // Using that groceryItems expiry date For provided groceryItemId...
  // 1) Checks if there are any existing notifications for that expiry Date
  //  a) If there isn't, it will create a new notification

}