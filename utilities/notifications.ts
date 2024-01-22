import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { NotificationContentInput,
  NotificationTriggerInput,
  scheduleNotificationAsync,
  getAllScheduledNotificationsAsync,
  cancelScheduledNotificationAsync,
} from 'expo-notifications';
import { Alert } from 'react-native';
import { GroceryItemType, loadFromStorage } from './storage';


// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export const DEFAULT_REMINDER = 1; // i.e. 1 day before expiry
export const DEFAULT_HOUR = 8;
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export enum ReminderType {
  dayOf = 'dayOf',
  before = 'before'
}

// Get permissions for app
export const askNotification = async () => {
  if (Device?.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }
};


/**
 * 
 * @param content NotificationContentInput
 * {
 *    title: 'Groceries expiring tomorrow',
 *    body: 'list of items comma delimited i.e. milk, cheese, bread',
 *    data: { url: 'link to relevant screen with relevant filters' },
 * }
 * @param trigger NotificationTriggerInput
 * {
 *    channelId: '???',
 *    date: Date object or Unix Timestamp,
 * }
 * @returns notification identifier
 */
export const addScheduledNotification = async (content: NotificationContentInput, trigger: NotificationTriggerInput) => {
  let identifier = '';
  try {
    console.log({
      content,
      trigger
    })
    identifier = await scheduleNotificationAsync({
      content,
      trigger
    });
  } catch (error) {
    console.error('Error occurred:', error)
  }
  console.log('identifier:', identifier)
  const allNotifications = await getAllScheduledNotificationsAsync();
  console.log('allNotifications', allNotifications)
  return identifier;
}

/**
 * 
 * @param oldGroceryItem Old GroceryItemType
 * @param newGroceryItem new GroceryItemType
 * @param reminderType dayOf or before
 */
export const updateNotification = async (oldGroceryItem: GroceryItemType, newGroceryItem: Partial<GroceryItemType>, reminderType: ReminderType): Promise<void> => {
  // Source correct Notification date depending on reminderType
  const dateKey = reminderType === ReminderType.dayOf ? 'expiryDate' : 'reminderDate';
  const oldNotificationDate = oldGroceryItem[dateKey];
  const newNotificationDate = newGroceryItem[dateKey];
  // Attempt to add new notification date
  await addNotification(newNotificationDate, reminderType);
  // Check old notification date, and see if can delete
  loadFromStorage('groceryData')
    .then( async (groceryDataObject: any) => {
      // Get all dates of groceryItems (except for one being edited) depending on reminderType (i.e. dayOf = expiryDate, before = reminderDate)
      const otherGroceryItems = groceryDataObject.items.filter((groceryDatum: GroceryItemType): boolean => groceryDatum.id !== oldGroceryItem.id);
      const uniqueItemDates = new Set(otherGroceryItems.map((groceryDatum: GroceryItemType): string => groceryDatum?.[dateKey]));
      // See if any grocery Item has a notification date matching oldNotification date
      // => If no match delete notification with oldNotification date, otherwise do nothing (i.e. keep notification)
      if (!uniqueItemDates.has(oldNotificationDate)) {
        const scheduledNotifications = await getAllScheduledNotificationsAsync();
        let notificationDateObj = new Date(oldNotificationDate);
        const matchingNotification = scheduledNotifications.find((notification: any ) => {
          return notification.trigger?.dateComponents?.year === notificationDateObj.getFullYear()
          && notification.trigger?.dateComponents?.month === notificationDateObj.getMonth() + 1
          && notification.trigger?.dateComponents?.day === notificationDateObj.getDate()
        });
        if (matchingNotification) {
          await cancelScheduledNotificationAsync(matchingNotification.identifier);
        }
      }
    })
    .catch((error: any) => {
      console.log('error', error)
  });
}

/**
 * 
 * @param notificationDate YYYY-MM-DD string
 * @param reminderType  dayOf or before
 */
export const addNotification = async (notificationDate: any, reminderType: ReminderType): Promise<void> => {
  const scheduledNotifications = await getAllScheduledNotificationsAsync();
  console.log('scheduledNotifications:', scheduledNotifications)
  let notificationDateObj = new Date(notificationDate)
  notificationDateObj.setHours(DEFAULT_HOUR)
  const matchingNotification = scheduledNotifications.find((notification: any ) => {
    return notification.trigger?.dateComponents?.year === notificationDateObj.getFullYear()
    && notification.trigger?.dateComponents?.month === notificationDateObj.getMonth() + 1
    && notification.trigger?.dateComponents?.day === notificationDateObj.getDate()
    && notification.content.data.reminderType === reminderType
  });

  // Set notification based on reminderType and number of days before reminder.
  let notificationMessage = `There are groceries expiring ${reminderType === ReminderType.dayOf ? 'today' : 'tomorrow'}.`;
  if (DEFAULT_REMINDER > 1) {
    notificationMessage = `There are groceries expiring in ${DEFAULT_REMINDER} days.`;
  }
  
  // Check if there is a matching notification for the new date, if not add new one
  if (!matchingNotification) {
    console.log({
      year: notificationDateObj.getFullYear(),
      month: notificationDateObj.getMonth() + 1,
      day: notificationDateObj.getDate(),
      hour: notificationDateObj.getHours(),
      minute: notificationDateObj.getMinutes(),
      second: notificationDateObj.getSeconds(),
    })
    const identifier = await addScheduledNotification({
      title: notificationMessage,
      body: `Open app to see`,
      data: { reminderType }
    },
    {
      // seconds: 60,
      // repeats: false,
      // // date: date,
      // IOS specific
      year: notificationDateObj.getFullYear(),
      month: notificationDateObj.getMonth() + 1,
      day: notificationDateObj.getDate(),
      hour: notificationDateObj.getHours(),
      minute: notificationDateObj.getMinutes(),
      second: notificationDateObj.getSeconds(),
    });
    // console.log('addNotification identifier:', identifier)
  }
}