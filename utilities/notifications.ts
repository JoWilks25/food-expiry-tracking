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
  console.log({notificationDate, reminderType})
  const scheduledNotifications = await getAllScheduledNotificationsAsync();

  let notificationDateObj = new Date(notificationDate)
  notificationDateObj.setHours(DEFAULT_HOUR)
  const matchingNotification = scheduledNotifications.find((notification: any ) => {
    return notification.trigger?.dateComponents?.year === notificationDateObj.getFullYear()
    && notification.trigger?.dateComponents?.month === notificationDateObj.getMonth() + 1
    && notification.trigger?.dateComponents?.day === notificationDateObj.getDate()
    && notification.content.data.reminderType === reminderType
  });
  console.log('matchingNotification', matchingNotification)
  // Update notification based on reminderType and number of days before reminder.
  let notificationMessage = `There are groceries expiring ${reminderType === ReminderType.dayOf ? 'today' : 'tomorrow'}.`;
  if (DEFAULT_REMINDER > 1) {
    notificationMessage = `There are groceries expiring in ${DEFAULT_REMINDER} days.`;
  }

  if (!matchingNotification) {
    await addScheduledNotification({
      title: notificationMessage,
      body: `Open app to see`,
      data: { reminderType }
    },
    {
      // date: date,
      year: notificationDateObj.getFullYear(),
      month: notificationDateObj.getMonth() + 1,
      day: notificationDateObj.getDate(),
      hour: notificationDateObj.getHours(),
      minute: notificationDateObj.getMinutes(),
      second: notificationDateObj.getSeconds(),
    });
  }
}