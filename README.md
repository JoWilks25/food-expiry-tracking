# food-expiry-tracking

## Tasks

### DONE
- Add items
- Add Sorting
- Add Edit button (UI only)
- Add Add Button + Modal (UI only)
- Add storage
- Connect Add Modal to Storage

## IN PROGRESS
- Connect Edit to Modal to Storage


### TODO

- Add Delete Button (UI & Logic)
- Add Ate or Wasted Button (UI & Logic)
- Add Ate & Wasted Filter (UI & Logic)
- Add upload button for receipt pdfs (UI & Logic)
- Add scrape items from receipt button (UI & Logic)
- Add Notifications (hardcoded day before etc)
- Add Ability to adjust notifications (Date and time)


### Architectural Questions

- What should I do with Id's?
  - when save to storage, always save as sorted by id
  - keep separate key in storage that tracks last used id (i.e. highest id no)
- Decided that deleting will be a form of archiving i.e. changing state to 'deleted'

- Notifications