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
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


/**
 * 
 * @param content NotificationContentInput
 * {
 *    title: 'Groceries expiring tomorrow',
 *    body: 'list of items comma delimited i.e. milk, cheese, bread',
 *    data: { groceryItems: [] },
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

/**
 * 
 * @param groceryItem
 * Finds existing notification
 * @returns identifier
 */
export const addNewScheduledNotification = async (groceryItem: GroceryItemType) => {
  const scheduledNotifications = await getAllScheduledNotificationsAsync();
  const matchingNotification = scheduledNotifications.find((notification: any ) => moment.unix(notification?.trigger?.seconds).format('YYYY-MM-DD') === moment(groceryItem.expiryDate).format('YYYY-MM-DD'));
  
  // If notification doesn't exist, just add a new notification
  if (matchingNotification) {
    // If matching notifcation for expiry date found
    const newGroceryItems = [...matchingNotification.content.data.groceryItems];
    newGroceryItems.push({
      id: groceryItem.id,
      name: groceryItem.name,
    });
    // 1) create new notification including new groceryItem details
    const identifier = await addScheduledNotification({
      title: 'Groceries Expiring today',
      body: `${newGroceryItems.map((groceryItem) => groceryItem.name).join(', ')}`,
      data: { groceryItems: newGroceryItems },
    },
    {
      date: new Date(groceryItem.expiryDate),
    });
    // 2) delete old notification
    await cancelScheduledNotificationAsync(matchingNotification.identifier);
    return identifier;
  }
  
  // If no matchingNotification, add new notification
  const identifier = await addScheduledNotification({
    title: 'Groceries Expiring today',
    body: `${groceryItem.name}`,
    data: { groceryItems: [{ id: groceryItem.id, name: groceryItem.name, }] },
  },
  {
    date: new Date(groceryItem.expiryDate),
  })
  return identifier
}

/**
 * 
 * @param groceryItem
 * Finds existing notification
 * @returns identifier
 */

export const editScheduledNotification = async (groceryItem: GroceryItemType) => {
  let identifier = '';
  return identifier;
}


/**
 * 
 * @param groceryItem GroceryItemType
 * 
 */
export const addEditLocalNotification = async (groceryItem: GroceryItemType): Promise<string> => {
  // TODO - if expo-notifications ever allows editing existing scheduleNotification then use that function instead of creating an deleting.
  let scheduleId = '';
  const scheduledNotifications = await getAllScheduledNotificationsAsync();
  console.log('scheduledNotifications:', scheduledNotifications)
  // If this is a new groceryItem, there will be no scheduleId
  if (groceryItem.scheduleIds.length == 0) {
    // Check if there's an existing notification with the same expiryDate
    scheduleId = await addNewScheduledNotification(groceryItem);
  } else {
    // If editing and an existing groceryItem's expirydate is updated
    // Create a new notification 
    groceryItem.scheduleIds.forEach( async (scheduleId: string): Promise<void> => {
      const matchingNotification = scheduledNotifications.find((notification: Notifications.NotificationRequest ) => notification?.identifier === scheduleId);
      // For old notification, create new notificaiton with current grocery item's details removed
      if (matchingNotification) {
        const newGroceryItems = matchingNotification.content.data.groceryItems.filter((item: any): boolean => item.id !== groceryItem.id);
        await addScheduledNotification({
          title: 'Groceries Expiring today',
          body: `${newGroceryItems.map((groceryItem: any) => groceryItem.name).join(', ')}`,
          data: { groceryItems: newGroceryItems },
        },
        {
          date: matchingNotification.trigger.seconds,
        })
      }
      // Delete old notification
      
      // Add new notification for new expiry date

      // Delete

    })


  } 
  console.log('scheduledNotifications:', scheduledNotifications)
  return scheduleId;
}

  // // Delete item from existing notifcations
  // const matchingNotification = scheduledNotifications.find((notification: Notifications.NotificationRequest ) => notification?.identifier === id);
  // console.log('matchingNotification', matchingNotification)
  // // If other groceryItems exists create new version of the notification
  // if (matchingNotification) {
  //   if (matchingNotification?.content.data.groceryItemIds.length > 1) {
  //     // matchingNotification?.content.data.groceryItemIds
  //     scheduleId = await addScheduledNotification(
  //       {
  //           title: `Groceries expiring tomorrow`,
  //           body: `${groceryItem.name}`,
  //           // groceryItemIds used as quick way to find notifications for editing
  //           data: { groceryItemIds: [...matchingNotification?.content.data.groceryItemIds, groceryItem.id] },
  //       },
  //       {
  //           date: new Date(groceryItem.expiryDate),
  //       }
  //     );
  //   } else {
  //     scheduleId = await addScheduledNotification(
  //       {
  //           title: `Some groceries are expiring tomorrow`,
  //           body: `${groceryItem.name} expiring tomorrow`,
  //           // groceryItemIds used as quick way to find notifications for editing
  //           data: { groceryItemIds: [...matchingNotification?.content.data.groceryItemIds, groceryItem.id] },
  //       },
  //       {
  //           date: new Date(groceryItem.expiryDate),
  //       }
  //     );
  //   }
  //   // Delete old Notification
  //   await Notifications.cancelScheduledNotificationAsync(matchingNotification.identifier);
  // }
  // // // Check if new expiryDate already has notification
  // // const expiryDate = new Date(groceryItem.expiryDate);
  // // const matchingNotification = scheduledNotifications.find((notification: any ) => notification?.trigger?.date === expiryDate);
  // // if (matchingNotification) {
  // //   // Create clone existing notification
    
  // //   // Add new groceryItem details

  // // }
  // // Create new notification with details
  // // addLocalNotification()
  // // Delete old notification 