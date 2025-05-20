# Home Controller Documentation

## Overview
The home controller manages dashboard metrics and reporting functionalities. It provides endpoints for calculating revenue, income, customer statistics, and generating various reports for the dashboard.

## Functions

### totalRevenue
**Description:** Calculates total revenue for today and compares it with yesterday.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Gets today and yesterday dates
2. Fetches all bills for the owner
3. Calculates total revenue for today and yesterday
4. Calculates percentage change between today and yesterday
5. Returns formatted revenue data with comparison state (up/down/no change)

### todayIncome
**Description:** Calculates today's income (profit) and compares it with yesterday.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Gets today and yesterday dates
2. Fetches all bills with product details
3. Calculates revenue and cost for today and yesterday
4. Calculates profit (revenue - cost) for both days
5. Calculates percentage change in profit
6. Returns formatted profit data with comparison state

### newCustomer
**Description:** Calculates new customers today and compares with yesterday.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Gets today and yesterday dates
2. Fetches all customers for the owner
3. Counts customers created today and yesterday
4. Calculates percentage change
5. Returns customer counts with comparison state

### generateCustomerReport
**Description:** Generates a monthly customer report for the year.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Iterates through each month of the year
2. Finds customers with transactions in each month
3. Categorizes customers as loyal, new, or returning
4. Returns a report with customer counts by category for each month

### generateDailySale
**Description:** Generates a daily sales report for the last 8 days.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Calculates dates for the last 8 days
2. For each day, finds bills created on that day
3. Calculates total sales amount for each day
4. Returns dates and corresponding sales amounts

### generateDailyCustomer
**Description:** Generates a report of new customers for the last 8 days.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Calculates dates for the last 8 days
2. For each day, counts customers created on that day
3. Returns dates and corresponding customer counts

### generateTopProduct
**Description:** Retrieves the top-rated products.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Fetches all products for the owner
2. Sorts products by rating
3. Returns the top 3 highest-rated products

### totalPending
**Description:** Calculates total pending orders and their percentage of all orders.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Counts orders with "pending" status
2. Counts total orders
3. Calculates the percentage of pending orders
4. Returns the count and percentage

### recentActivity
**Description:** Retrieves recent activity from various sources for the dashboard feed.
**Parameters:**
- `user`: User object containing owner ID

**Process:**
1. Fetches recent customer creations
2. Fetches recent product history events
3. Fetches recent supplier change events
4. Merges and sorts all events by date
5. Returns the 7 most recent events formatted for display