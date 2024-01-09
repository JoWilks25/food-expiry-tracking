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
  console.log('scheduledNotifications:', scheduledNotifications)

  const matchingNotification = scheduledNotifications.find((notification: any ) => 
    moment.unix(notification?.trigger?.seconds).format(DEFAULT_DATE_FORMAT) === moment(notificationDate).format(DEFAULT_DATE_FORMAT)
    && notification.content.data.reminderType === reminderType
  );

  // Update notification based on reminderType and number of days before reminder.
  let notificationMessage = `There are groceries expiring ${reminderType === ReminderType.dayOf ? 'today' : 'tomorrow'}.`;
  if (DEFAULT_REMINDER > 1) {
    notificationMessage = `There are groceries expiring in ${DEFAULT_REMINDER} days.`;
  }
  let date = new Date(notificationDate)
  date.setHours(DEFAULT_HOUR)
  console.log('date', date)

  if (!matchingNotification) {
    await addScheduledNotification({
      title: notificationMessage,
      body: `Open app to see`,
      data: { reminderType }
    },
    {
      date: date, 
      // moment(notificationDate, DEFAULT_DATE_FORMAT).set("hour", DEFAULT_HOUR).unix(),
    });
  }
}