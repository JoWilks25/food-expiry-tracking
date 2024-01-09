import * as Notifications from 'expo-notifications';
import { NotificationContentInput,
  NotificationTriggerInput,
  scheduleNotificationAsync,
  getAllScheduledNotificationsAsync,
  cancelScheduledNotificationAsync,
} from 'expo-notifications';
import moment from 'moment';


// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const DEFAULT_REMINDER = 1 // i.e. 1 day before expiry

export enum ReminderType {
  dayOf = 'dayOf',
  before = 'before'
}
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

export const updateNotification = async (notificationDate: any, reminderType: ReminderType): Promise<void> => {
  const scheduledNotifications = await getAllScheduledNotificationsAsync();
  const matchingNotification = scheduledNotifications.find((notification: any ) => moment.unix(notification?.trigger?.seconds).format('YYYY-MM-DD') === moment(notificationDate).format('YYYY-MM-DD') && notification.content.data.reminderType === reminderType);
  // Update notification based on reminderType and number of days before reminder.
  let notificationMessage = `There are groceries expiring ${reminderType === ReminderType.dayOf ? 'today' : 'tomorrow'}.`;
  if (DEFAULT_REMINDER > 1) {
    notificationMessage = `There are groceries expiring in ${DEFAULT_REMINDER} days.`;
  }

  if (matchingNotification) {
    // 1) create new notification including new groceryItem details
    await addScheduledNotification({
      title: notificationMessage,
      body: `Open app to see}`,
    },
    {
      date: new Date(notificationDate),
    });
    // 2) delete old notification
    await cancelScheduledNotificationAsync(matchingNotification.identifier);
  } else {
    // If notification DOESN'T EXIST, just adds a new notification
    await addScheduledNotification({
      title: notificationMessage,
      body: `Open app to see}`,
    },
    {
      date: new Date(notificationDate),
    });
  }
}