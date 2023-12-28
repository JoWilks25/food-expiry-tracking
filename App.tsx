import React from 'react';
import MainScreen from './screens/MainScreen';
// import {Notifications} from 'react-native-notifications';


const App = () => {
  // let localNotification: any = Notifications.postLocalNotification({
  //   body: "Local notification!",
  //   title: "Local Notification Title",
  //   sound: "chime.aiff",
  //   // silent: false,
  //   category: "SOME_CATEGORY",
  //   userInfo: { },
  //   fireDate: new Date(),
  // });
  // console.log('localNotification', localNotification)

  return (<MainScreen />)
};

export default App;