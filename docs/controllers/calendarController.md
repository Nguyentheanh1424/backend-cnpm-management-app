# Calendar Controller Documentation

## Overview
The calendar controller manages event scheduling and calendar functionality. It provides endpoints for creating, retrieving, updating, and deleting calendar events.

## Functions

### createEvent
**Description:** Creates a new calendar event.
**Parameters:**
- `task`: Event description or title
- `employee`: Employee associated with the event
- `start_time`: Event start time
- `end_time`: Event end time
- `id_owner`: Owner ID

**Process:**
1. Validates that all required fields are provided
2. Creates a new event with the provided data
3. Saves the event to the database
4. Returns the created event

### getEvent
**Description:** Retrieves all events for a specific owner.
**Parameters:**
- `userId`: Owner ID (from query parameters)

**Process:**
1. Finds all events associated with the owner ID
2. Formats the events for response
3. Returns the list of events

### deleteEvent
**Description:** Deletes a specific event.
**Parameters:**
- `id`: Event ID (from route parameters)
- `id_owner`: Owner ID (from query parameters)

**Process:**
1. Finds and deletes the event matching both the event ID and owner ID
2. Returns a success message if deletion is successful
3. Returns an error if the event is not found

### updateEvent
**Description:** Updates an existing event.
**Parameters:**
- `id`: Event ID (from route parameters)
- `task`: Updated event description or title
- `employee`: Updated employee associated with the event
- `start_time`: Updated event start time
- `end_time`: Updated event end time
- `id_owner`: Owner ID

**Process:**
1. Validates that all required fields are provided
2. Finds and updates the event with the provided data
3. Returns a success message if update is successful
4. Returns an error if the event is not found