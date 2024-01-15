# food-expiry-tracking

## Tasks

### DONE 
- Add items
- Add Sorting
- Add Edit button (UI only)
- Add Add Button + Modal (UI only)
- Add storage
- Connect Add Modal to Storage
- Connect Edit to Modal to Storage
- Add Delete Button (UI & Logic)
- Add Ate or Wasted Button (UI & Logic)
- Add Ate & Wasted Filter (UI & Logic)
- Add Notifications (hardcoded day before and on day of? etc)
  - Add Ability to add a New Notification (including not overlapping with existing Notification)
- Add upload button for receipt ~~pdfs~~ (UI & Logic) (can't do pdfs with react native stuff so need to read from a plain text file)
- Integrate Scrape from text functionaity into App

## IN PROGRESS
- Add Ability to edit existing Notification when edit expiry date on item

### TODO
- Fix not update when pick doc
- Cleanup CSS issues
  - Buttons pushed off screen due to long text
  - Include Units display
- Research how to install locally on iphone
- Research how to deploy so installable from apple store
- Design - research whether want a 'check expiry date' for over one week items so I input correct expiry date

### Architectural Questions

- What should I do with Id's?
  - when save to storage, always save as sorted by id
  - keep separate key in storage that tracks last used id (i.e. highest id no)
- Decided that deleting will be a form of archiving i.e. changing state to 'deleted'

- Should I allow the user to change from a non-active status?
  - Potentially allow reactivation in case they pressed the wrong button
  - Add some Friction if they've pressed Eaten of Wasted by mistake?

- Units
  - how to deal with when have eaten one but not other/s?

- Notifications
  - Batching items into notifications based on date, so only 1 notification per day
  - Future questions:
    - Should each item have it's own notification?
    - Should I allow setting of time specifically to each item?