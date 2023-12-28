import React, { Fragment } from 'react';
import MainScreen from './screens/MainScreen';
// import NotificationComponent from './screens/Notifications';
import * as Notifications from 'expo-notifications';

// First, set the handler that will cause the notification
// to show the alert

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// // Second, call the method

// Notifications.scheduleNotificationAsync({
//   content: {
//     title: 'Test Notification',
//     body: "Expiring in 1 day",
//   },
//   trigger: null,
// });

const schedulePushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: {
      channelId: 'test',
      repeats: false,
      seconds: 10,
    },
  });
}


const App = () => {
  return (
    <Fragment>
      <MainScreen />
      {/* <NotificationComponent /> */}
    </Fragment>
  )
};

export default App;