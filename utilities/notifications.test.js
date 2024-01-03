import {describe, expect, test} from '@jest/globals';
import { addLocalNotification, editLocalNotification, } from './notifications';

describe('addLocalNotification', () => {
  test('schedules a notifcation correctly when given the correct inputs', () => {
    
  })

  test('throws an error when not given correct inputs', () => {
    
  })
})

// *** Note *** - expo-notifications not allow editing, have to delete and add new notification
describe('editLocalNotification', () => {
  test('when editing a notification that only has 1 grocery item, it works as expected', () => {
    // Finds matching notification & deletes
    // Adds a new notification with the new expiry date applied to the grocery item
  })

  test('when editing a notification that only has > 1 grocery item, it works as expected', () => {
    // Finds matching notification & deletes it
    // Adds a new notification with the new expiry date applied to the grocery item as well as the pre-existing grocery items.
  })

})