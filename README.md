# Responsive-Web-Design-and-Development
A website based on a SDG theme

Cheat Sheets for HTML tags and CSS properties:
https://claude.ai/artifact/5rFAvRW2U7YhXz8fdGRAeN

---

## **Completed**

### Driver – Shared Layout (header, footer, menu)

#### HTML
* **Header** (`driverHeader.html`)
  * Tabs: Dashboard, My Rides, Requests, Challenges & Badges
  * Leaderboard icon (trophy), Notification icon (bell), Profile icon

#### PHP
* **Database**
  * `database.php` connects to `cpu_carpool`

---

### Driver – Dashboard

#### HTML
* **Page title**
  * "Dashboard"
* **Next ride**
  * Date, time, direction, station, seats x / y
  * Empty state: "No upcoming rides"
* **Latest notifications**
  * 3 newest items (topic, description, date)
  * Empty state: "No notifications"
* **Current challenge**
  * Name, description, `<progress>` bar
  * Empty state: "You are not in a challenge yet" + Yes link

#### PHP
* **Next ride**
  * Query with TIMESTAMPDIFF ≥ 0, ORDER BY ASC, LIMIT 1
  * COUNT confirmed bookings + driver maxSeat
* **Latest notifications**
  * Where userID = this driver or target = All / Driver, newest first, show 3
* **Current challenge**
  * Challenge the driver joined where NOW() is between startDate and endDate
  * Shared total CO2 within the challenge period

---

### Driver – My Rides

#### HTML
* **Page title**
  * "My Rides"
* **Add ride slot**
  * Day select, time (hour + minute selects), direction select
  * Submit + Reset buttons

#### JS
* **Add ride slot**
  * Fill day options with next week's Monday–Friday dates

#### PHP
* **Week dates**
  * Next week's Monday (skips a week on Sunday)
* **Rides list**
  * Query this driver's rides in next week with station name

---

### Driver – Requests

#### HTML
* **Page title**
  * "Requests"

#### PHP
* **Request list**
  * Query Pending bookings on this driver's rides with passenger details

---

## **Progressing**

### Driver – Shared Layout (header, footer, menu)

#### HTML
* **Header**
  * Logo box + "CPU." text
  * Notification unread dot
  * Profile picture instead of the user icon

#### PHP
* **Includes**
  * Highlight the current page's tab

---

### Driver – Dashboard

#### HTML
* **Statistics**
  * Card + 3 empty chart divs (`rideChart`, `co2Chart`, `badgeChart`) — charts not drawn yet
* **Current challenge**
  * Add "x / y kg" text, participants, end date

#### JS
* **Statistics**
  * Google Charts loader is linked — drawing code not written yet

---

### Driver – My Rides

#### HTML
* **Rides list**
  * Date, time and direction icons shown
  * Add seats x / y, status chip, Edit / Cancel buttons
  * Empty state: "No rides this week"

---

### Driver – Requests

#### HTML
* **Request list**
  * Passenger picture, name, date, time, direction icons, one form per row
  * Hidden bookingID + Accept / Decline submit buttons

---

## **Planned to do**

### Driver – Shared Layout (header, footer, menu)

#### HTML
* **Mobile menu**
  * ☰ button
  * Dropdown: 4 tabs + Profile + Logout
* **Footer**
  * "© CPU - Carpooling University"

#### CSS
* **Stylesheet**
  * Driver stylesheet linked on every driver page
* **Header**
  * Flex layout: logo left, tabs centre, icons right
  * Active tab style (dark pill, white text)
  * Unread dot position on the notification icon
* **Layout**
  * `.pageContainer`: fixed 720px column, centred, page scrolls
  * `.contentContainer` / `.boxContainer`: card style (border, radius, padding)
  * `.boxToLeft` / `.boxToRight`: label left, value right
* **Mobile**
  * Hide tabs below mobile width, show ☰ button
  * Dropdown box style + active item

#### JS
* **Mobile menu**
  * Toggle dropdown open / close on ☰ click
  * Close dropdown when clicking outside it

#### PHP
* **Access control**
  * Redirect to login if no session, redirect if role ≠ Driver
  * Show "Awaiting admin verification" if verifyStatus ≠ Approved
* **Includes**
  * Shared footer include
* **Notification dot**
  * Compare newest notification date with the last-seen cookie

---

### Driver – Dashboard

#### HTML
* **Page title**
  * Short description under "Dashboard"
* **Statistics**
  * Labels: Rides vs last month, CO2 saved vs last month, Achievements unlocked
* **Next ride**
  * "View ride" button → My Rides
  * Format date (dd/mm/yyyy) and time (hh:mm)
* **Latest notifications**
  * "View all" link → Notifications
* **Current challenge**
  * "View challenge" button → Challenges & Badges

#### CSS
* **Statistics**
  * Pie row with flexbox, equal widths, gap
  * Stack pies on narrow screens
* **Next ride / Current challenge**
  * Label–value rows
  * Progress bar style
* **Latest notifications**
  * Item style (title bold, description grey, date right)

#### JS
* **Statistics**
  * `google.charts.load` + `setOnLoadCallback`
  * drawPie() helper (no slice text, no legend, dark + light grey colours)
  * Draw the 3 pies from PHP data
  * Redraw on window resize

#### PHP
* **Statistics**
  * Rides this month vs last month
  * CO2 saved this month vs last month
  * Badges unlocked vs total badges for All / Driver
  * Pass all three to JS with json_encode
* **Current challenge**
  * Show the running challenge even if the driver hasn't joined (with a Join link)
  * Participant count from challenger

---

### Driver – My Rides

#### HTML
* **Page title**
  * Short description
* **Week tabs**
  * This week / Next week
* **Add ride slot**
  * "Use timetable" option (fills time from timetable)
* **Edit ride**
  * Form (day, time, direction) + Save / Close
* **Cancel confirm**
  * In-page confirm box (not alert())

#### CSS
* **Week tabs**
  * Segmented tab style, active tab dark
* **Add ride slot**
  * Form field layout, full-width button
* **Rides list**
  * Ride item layout, status chip
  * Disabled Edit style when within 48 hours
* **Edit / Cancel**
  * Modal or inline box style

#### JS
* **Week tabs**
  * Switch week (or reload with ?week=this / next)
* **Add ride slot**
  * "Use timetable": pickup = class start − travel duration (To APU only)
* **Edit / Cancel**
  * Open / close edit form, prefill values
  * Show / hide cancel confirm box

#### PHP
* **Week dates**
  * This week: monday this week → friday this week
* **Booking window**
  * Allow adding next week's rides only Monday 00:00 – Saturday 23:59
  * Check again on submit, not only on page load
* **Add ride slot**
  * Save the submitted ride (POST handler)
  * Validate day / time / direction
  * Generate rideID (RDnnnnnnn), use driver's stationID
  * Insert with prepared statement
* **Rides list**
  * COUNT confirmed bookings + maxSeat
  * Sort by date and time
* **Edit ride**
  * Allow only if ≥ 48 hours before departure
  * Update ride
  * Insert notification for each confirmed passenger
* **Cancel ride**
  * Set all its bookings to Cancelled (add 'Cancelled' to booking.status ENUM first)
  * Notify confirmed passengers

---

### Driver – Requests

#### HTML
* **Page title**
  * Short description
* **Request list**
  * "Loyal" chip for loyal ride requests
  * Empty state: "No pending requests"
  * Default picture when profilePicturePath is NULL
* **Footer note**
  * "Requests close Saturday 11:59 PM" centred at the bottom

#### CSS
* **Request list**
  * Item layout (picture, text, buttons on the right)
  * Accept dark button, Decline outline button
* **Footer note**
  * Centred, grey text

#### JS
* **Request list** (optional)
  * Accept / Decline without page reload using fetch()
  * Remove the item from the list after action

#### PHP
* **Request list**
  * Only next week's rides, sorted by date and time
  * Pending loyal requests for this driver
* **Accept / Decline handler** (POST at top of page, before HTML)
  * Check the booking belongs to this driver (JOIN ride … AND driverID = ?)
  * Accept: seats left = maxSeat − confirmed → Confirmed, else Rejected ("Ride is full")
  * Decline: set Rejected
  * Only update when status is still Pending
  * Redirect back after update (Post/Redirect/Get)
* **Loyal request**
  * Approve → Ongoing, Decline → Cancelled
* **Booking window**
  * Block Accept / Decline outside Monday 00:00 – Saturday 23:59

---

### Driver – Challenges & Badges

#### HTML
* **Page title**
  * "Challenges & Badges" + description
* **Current challenge**
  * Title, description, progress bar, "x / y kg", participants, end date
  * Join button (or "Joined" state)
* **Badges**
  * "x / y unlocked" counter
  * Each badge: icon, title, description
  * Right side: "Unlocked" + date/time, or progress bar + "x / y"

#### CSS
* **Current challenge**
  * Progress bar, Joined button state
* **Badges**
  * Steam-style row (icon left, text middle, status right)
  * Locked badges greyed out (opacity)

#### JS
* **Current challenge**
  * Set progress bar width from percentage
* **Badges**
  * Set each locked badge's progress bar width

#### PHP
* **Current challenge**
  * Running challenge + shared total CO2
  * Check if this driver already joined
* **Join**
  * Insert into challenger (block duplicates)
* **Badges**
  * All badges for role All / Driver
  * Unlocked ones from user_badge with achievedDate
  * Locked progress = driver's value vs badge target
* **Auto-award**
  * When a value reaches a badge target, insert into user_badge

---

### Driver – Profile (driver parts)

#### HTML
* **Car details**
  * Car image, car plate, max seats, preferred fee
  * Suggested fee + allowed range text
* **Timetable**
  * List of slots (day, start, end) + Edit / Delete
  * Add slot form
* **Travel duration**
  * Minutes from station to APU

#### CSS
* **Car details**
  * Car image preview box
* **Timetable**
  * Slot item layout

#### JS
* **Car details**
  * Live hint while typing fee: inside / outside ±20% range
  * Preview the chosen car image before upload

#### PHP
* **Car details**
  * Suggested fee = distance × fuelUseLPer100km ÷ 100 × petrolPricePerLitre
  * Save preferred fee only if within ±20%
  * Save max seats (not below current confirmed bookings)
  * Upload car image (check type + size, save path)
* **Timetable**
  * Add / edit / delete slots
* **Travel duration**
  * Save (DB column or cookie — decide)

---

### Driver – Leaderboard

#### HTML
* **Leaderboard**
  * Filter tabs: All / Passengers / Drivers
  * Ranked list (rank, name, CO2 saved), "You" row highlighted

#### CSS
* **Leaderboard**
  * Rank circle, highlighted row border

#### PHP
* **Leaderboard**
  * Rank users by total CO2 saved, filtered by role
  * Find this driver's own rank

---

### Driver – Notifications

#### HTML
* **Notification list**
  * Title, description, date, "new" dot

#### CSS
* **Notification list**
  * Item style, dot style

#### PHP
* **Notification list**
  * Admin posts (All / Driver) + personal alerts (userID = this driver), newest first
  * Mark items newer than the last-seen cookie as new
  * Update the last-seen cookie after viewing