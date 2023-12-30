import * as Notifications from 'expo-notifications';
import { NotificationContentInput } from 'expo-notifications'
// First, set the handler that will cause the notification
// to show the alert

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


// SAMPLE
// content: {
//   title: "You've got mail! 📬",
//   body: 'Here is the notification body',
//   data: { data: 'goes here' },
// },
// trigger: {
//   channelId: 'test',
//   repeats: false,
//   seconds: 10,
// },


export const schedulePushNotification = async (content: NotificationContentInput, trigger: Notifications.NotificationTriggerInput) => {
  const identifier = await Notifications.scheduleNotificationAsync({
    content,
    trigger
  });
  return identifier;
}