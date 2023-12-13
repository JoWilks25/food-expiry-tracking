# food-expiry-tracking

## Tasks

### DONE
- Add items
- Add Sorting
- Add Edit button (UI only)
- Add Add Button + Modal (UI only)
- Add storage

### TODO

- Connect Add Modal to Storage
- Connect Edit to Modal to Storage
- Add Delete Button (UI & Logic)
- Add Ate or Wasted Button (UI & Logic)
- Add Ate & Wasted Filter (UI & Logic)
- Add upload button for receipt pdfs (UI & Logic)
- Add scrape items from receipt button (UI & Logic)

### Architectural Questions

- What should I do with Id's?
  - Potentially add them in manually... requiring I keep a count of the next free id
  - Decided that deleting will be a form of archiving i.e. changing state to 'deleted'