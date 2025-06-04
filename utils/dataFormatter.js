/**
 * Utility functions for formatting data consistently across the application
 */

/**
 * Format money values consistently
 * @param {number|string} amount - The amount to format
 * @param {string} locale - The locale to use for formatting (default: 'vi-VN')
 * @returns {string} - Formatted money string
 */
const formatMoney = (amount, locale = 'vi-VN') => {
  if (amount === null || amount === undefined) return '';

  // If the amount is a string with formatting, convert it to a number first
  if (typeof amount === 'string') {
    // Remove any non-numeric characters except the decimal point
    amount = amount.replace(/[^\d.-]/g, '');
  }

  // Convert to number and format
  return parseFloat(amount).toLocaleString(locale);
};

/**
 * Format user data for response
 * @param {Object} user - User object from database
 * @param {boolean} includePrivate - Whether to include private fields
 * @returns {Object} - Formatted user object
 */
const formatUser = (user, includePrivate = false) => {
  if (!user) return null;

  // Basic user data that's safe to return in all responses
  const formattedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  // Include avatar if it exists
  if (user.avatar) {
    formattedUser.avatar = user.avatar;
  }

  // Include id_owner if it exists
  if (user.id_owner) {
    formattedUser.id_owner = user.id_owner;
  }

  // Include private fields if requested and they exist
  if (includePrivate) {
    if (user.GoogleID) formattedUser.GoogleID = user.GoogleID;
    // Add other private fields as needed
  }

  return formattedUser;
};

/**
 * Format product data for response
 * @param {Object} product - Product object from database
 * @returns {Object} - Formatted product object
 */
const formatProduct = (product) => {
  if (!product) return null;

  return {
    _id: product._id,
    name: product.name,
    description: product.description || "",
    image: product.image || {},
    purchasePrice: product.purchasePrice || "",
    sellingPrice: product.price || "", // Ánh xạ price sang sellingPrice
    price: product.price || "", // Giữ nguyên price
    sku: product.sku || "",
    supplier: product.supplier || null,
    stock_in_shelf: product.stock_in_shelf || 0,
    rate: product.rate || 0
  };
};

/**
 * Format supplier data for response
 * @param {Object} supplier - Supplier object from database
 * @returns {Object} - Formatted supplier object
 */
const formatSupplier = (supplier) => {
  if (!supplier) return null;

  return {
    _id: supplier._id,
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    owner: supplier.owner
  };
};

/**
 * Format customer data for response
 * @param {Object} customer - Customer object from database
 * @returns {Object} - Formatted customer object
 */
const formatCustomer = (customer) => {
  if (!customer) return null;

  const formattedCustomer = {
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    owner: customer.owner,
    creator: customer.creator,
    rate: customer.rate
  };

  // Format money if it exists
  if (customer.money) {
    formattedCustomer.money = formatMoney(customer.money);
  }

  // Include dates if they exist
  if (customer.firstPurchaseDate) {
    formattedCustomer.firstPurchaseDate = customer.firstPurchaseDate;
  }

  if (customer.lastPurchaseDate) {
    formattedCustomer.lastPurchaseDate = customer.lastPurchaseDate;
  }

  return formattedCustomer;
};

/**
 * Format bill data for response
 * @param {Object} bill - Bill object from database
 * @returns {Object} - Formatted bill object
 */
const formatBill = (bill) => {
  if (!bill) return null;

  const formattedBill = {
    _id: bill._id,
    owner: bill.owner,
    creator: bill.creator,
    customerId: bill.customerId,
    items: bill.items,
    paymentMethod: bill.paymentMethod,
    notes: bill.notes,
    discount: bill.discount,
    vat: bill.vat,
    orderDate: bill.orderDate
  };

  // Format money values
  if (bill.totalAmount) {
    formattedBill.totalAmount = formatMoney(bill.totalAmount);
  }

  return formattedBill;
};

module.exports = {
  formatUser,
  formatProduct,
  formatSupplier,
  formatCustomer,
  formatBill,
  formatMoney
};
