/**
 * Shop constants.
 * The books themselves now come from the backend API (GET /api/products):
 * see server/src/data/books.js for the data stored in MongoDB.
 */
export const CATEGORIES = ['Novels', 'Poetry', 'History', 'Essays', 'Science', 'Youth']

export const FREE_SHIPPING_THRESHOLD = 5000
export const SHIPPING_FEE = 400
export const MAX_QUANTITY = 10
