# Chat Controller Documentation

## Overview
The chat controller manages real-time messaging functionality using Socket.IO. It handles sending and receiving messages, saving messages to the database, and retrieving message history.

## Socket.IO Event Handlers

### connection
**Description:** Handles new socket connections and sets up event listeners for each connected client.

**Event Listeners:**
1. **send_message**: Receives messages from clients, saves them to the database, and broadcasts them to all connected clients.
2. **receive_message**: Receives messages and saves them to the database.
3. **disconnect**: Handles client disconnections.

## Functions

### saveMessageToDB
**Description:** Internal helper function to save messages to the database.
**Parameters:**
- `data`: Object containing message data (sender, owner, content)

**Process:**
1. Creates a new message with the provided data
2. Saves the message to the database
3. Logs success or error

### getMessages
**Description:** API endpoint to retrieve message history.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Finds all messages associated with the user's owner ID
2. Populates sender and owner information
3. Sorts messages by creation time (ascending)
4. Returns the list of messages