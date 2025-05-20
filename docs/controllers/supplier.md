# Supplier Controller Documentation

## Overview
The supplier controller provides functionality for searching and suggesting suppliers based on name queries. It's used for autocomplete and search features in the application.

## Functions

### getSupplierSuggestion
**Description:** Searches for suppliers by name and returns matching suggestions.
**Parameters:**
- `query`: Search term for supplier name
- `ownerId`: Owner ID to filter suppliers

**Process:**
1. Validates that a query parameter is provided
2. Searches for suppliers with names matching the query (case-insensitive)
3. Filters suppliers by owner ID
4. Returns a limited list (up to 5) of matching suppliers with their IDs and names