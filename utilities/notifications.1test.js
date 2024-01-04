import {describe, expect, test} from '@jest/globals';
import { addScheduledNotification, addEditLocalNotification, } from './notifications';
import { NotificationContentInput, NotificationTriggerInput, Notification } from 'expo-notifications'
import { ItemState } from './storage';

// const mockNotification = jest.mock(Notification)

describe('addLocalNotification', () => {
  test('schedules a notifcation correctly when given the correct inputs', () => {
    
  })

  test('throws an error when not given correct inputs', () => {
    
  })
})

// *** Note *** - expo-notifications not allow editing, have to delete and add new notification
describe('editLocalNotification', () => {

  const testScheduleId1 = "5ca56a9d-bf40-4ec1-99f1-fee6fbb20f56";
  const testNewGroceryItem = {
    id: 2,
    name: 'cheese',
    expiryDate: '2024-01-05',
    addDate: '2024-01-05',
    lastUpdateDate: null, 
    units: 1, // Number of units
    itemState: ItemState.ACTIVE,
    scheduleIds: [],
  }
  const testExistingGroceryItem = {
    id: 1,
    name: 'milk',
    expiryDate: '2024-01-04',
    addDate: '2024-01-04',
    lastUpdateDate: null, 
    units: 1, // Number of units
    itemState: ItemState.ACTIVE,
    scheduleIds: [testScheduleId1],
  }

  test('when adding a new grocery item with a unique expiry date, it creates a new notification', () => {
    // Checks and finds no matching notification for expiry date
    addEditLocalNotification(testNewGroceryItem)
    // Adds a new notification with the new expiry date applied to the grocery item
    
  })

  test('when editing a notification that only has > 1 grocery item, it works as expected', () => {
    // Finds matching notification & deletes it
    // Adds a new notification with the new expiry date applied to the grocery item as well as the pre-existing grocery items.
  })

})