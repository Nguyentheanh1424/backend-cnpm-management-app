const Product = require("../modules/product");
const Bill = require("../modules/bill");
const Customer = require("../modules/customer");
const OrderDetail = require("../modules/order_history");
const History = require("../modules/history");
const SupplierChangeHistory = require('../modules/history_change_supplier');
const logger = require("../config/logger");

// Calculate total revenue for today and compare with yesterday
const totalRevenue = async (req, res) => {
  const { user } = req.body;

  try {
    // Get dates today and yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayString = today.toISOString().substring(0, 10);
    const yesterdayString = yesterday.toISOString().substring(0, 10);

    // Fetch all bills for the owner
    const bills = await Bill.find({ owner: user.id_owner });

    // Calculate total revenue for today and yesterday
    let totalRevenueToday = 0;
    let totalRevenueYesterday = 0;

    bills.forEach(bill => {
      const billDate = new Date(bill.orderDate);
      const billDateString = billDate.toISOString().substring(0, 10);

      // Parse amount, removing dots used as a thousand separators
      let amount = parseFloat(bill.totalAmount.replace(/\./g, '')) || 0;

      // Calculate revenue for today
      if (billDateString === todayString) {
        totalRevenueToday += amount;
      }
      // Calculate revenue for yesterday
      else if (billDateString === yesterdayString) {
        totalRevenueYesterday += amount;
      }
    });

    // Calculate percentage change
    let percentChange = 0;
    let message = "not change";

    if (totalRevenueYesterday > 0) {
      percentChange = ((totalRevenueToday - totalRevenueYesterday) / totalRevenueYesterday) * 100;
    } else if (totalRevenueToday > 0) {
      percentChange = 100; // If yesterday had no revenue but today does
    }

    if (percentChange > 0) {
      message = "up";
    } else if (percentChange < 0) {
      message = "down";
      percentChange = -percentChange; // Make percentage positive for display
    }

    // Format currency values for response
    const formattedTotalRevenueToday = totalRevenueToday.toLocaleString('vi-VN', { 
      style: "currency", 
      currency: "VND" 
    });

    const formattedTotalRevenueYesterday = totalRevenueYesterday.toLocaleString('vi-VN', { 
      style: "currency", 
      currency: "VND" 
    });

    return res.status(200).json({
      totalRevenueToday: formattedTotalRevenueToday,
      totalRevenueYesterday: formattedTotalRevenueYesterday,
      percentChange: percentChange.toFixed(2) + "%",
      state: message
    });
  } catch (error) {
    logger.error("Error calculating total revenue:", error);
    return res.status(500).json({ error: "Error calculating total revenue" });
  }
};

// Calculate today's income (profit) and compare with yesterday
const todayIncome = async (req, res) => {
  const { user } = req.body;

  try {
    // Get dates today and yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayString = today.toISOString().substring(0, 10);
    const yesterdayString = yesterday.toISOString().substring(0, 10);

    // Fetch all bills with product details
    const bills = await Bill.find({ owner: user.id_owner }).populate('items.productID');

    // Calculate revenue and cost for today and yesterday
    let totalRevenueToday = 0;
    let totalRevenueYesterday = 0;
    let totalCostToday = 0;
    let totalCostYesterday = 0;

    bills.forEach(bill => {
      const billDate = new Date(bill.orderDate);
      const billDateString = billDate.toISOString().substring(0, 10);

      // Parse amount, removing dots used as a thousand separators
      let amount = parseFloat(bill.totalAmount.replace(/\./g, '')) || 0;

      // Calculate for today
      if (billDateString === todayString) {
        totalRevenueToday += amount;

        // Calculate total cost
        bill.items.forEach(item => {
          if (item.productID && item.productID.purchasePrice) {
            const purchasePrice = parseFloat(item.productID.purchasePrice.replace(/\./g, '')) || 0;
            totalCostToday += purchasePrice * item.quantity;
          }
        });
      }
      // Calculate for yesterday
      else if (billDateString === yesterdayString) {
        totalRevenueYesterday += amount;

        // Calculate total cost
        bill.items.forEach(item => {
          if (item.productID && item.productID.purchasePrice) {
            const purchasePrice = parseFloat(item.productID.purchasePrice.replace(/\./g, '')) || 0;
            totalCostYesterday += purchasePrice * item.quantity;
          }
        });
      }
    });

    // Calculate profit
    const profitToday = totalRevenueToday - totalCostToday;
    const profitYesterday = totalRevenueYesterday - totalCostYesterday;

    // Calculate percentage change
    let percentChange = 0;
    let message = "not change";

    if (profitYesterday > 0) {
      percentChange = ((profitToday - profitYesterday) / profitYesterday) * 100;
    } else if (profitToday > 0) {
      percentChange = 100; // If yesterday had no profit but today does
    }

    if (percentChange > 0) {
      message = "up";
    } else if (percentChange < 0) {
      message = "down";
      percentChange = -percentChange; // Make percentage positive for display
    }

    // Format currency values for response
    const formattedProfitToday = profitToday.toLocaleString('vi-VN', { 
      style: "currency", 
      currency: "VND" 
    });

    const formattedProfitYesterday = profitYesterday.toLocaleString('vi-VN', { 
      style: "currency", 
      currency: "VND" 
    });

    return res.status(200).json({
      profitToday: formattedProfitToday,
      profitYesterday: formattedProfitYesterday,
      percentChange: percentChange.toFixed(2) + "%",
      state: message
    });
  } catch (error) {
    logger.error('Error calculating income:', error);
    return res.status(500).json({ error: 'An error occurred while calculating income.' });
  }
};

// Calculate new customers today and compare with yesterday
const newCustomer = async (req, res) => {
  const { user } = req.body;

  try {
    // Get dates today and yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayString = today.toISOString().substring(0, 10);
    const yesterdayString = yesterday.toISOString().substring(0, 10);

    // Fetch all customers for the owner
    const customers = await Customer.find({ owner: user.id_owner });

    let customerToday = 0;
    let customerYesterday = 0;

    customers.forEach(customer => {
      const createdDate = new Date(customer.createdAt);
      const createdDateString = createdDate.toISOString().substring(0, 10);

      // Count customers created today
      if (createdDateString === todayString) {
        customerToday += 1;
      }
      // Count customers created yesterday
      else if (createdDateString === yesterdayString) {
        customerYesterday += 1;
      }
    });

    // Calculate percentage change
    let percentChange = 0;
    let message = "not change";

    if (customerYesterday > 0) {
      percentChange = ((customerToday - customerYesterday) / customerYesterday) * 100;
    } else if (customerToday > 0) {
      percentChange = 100; // If yesterday had no new customers but today does
    }

    if (percentChange > 0) {
      message = "up";
    } else if (percentChange < 0) {
      message = "down";
      percentChange = -percentChange; // Make percentage positive for display
    }

    return res.status(200).json({
      customerToday,
      customerYesterday,
      percentChange: percentChange.toFixed(2) + "%",
      state: message
    });
  } catch (error) {
    logger.error('Error calculating new customers:', error);
    return res.status(500).json({ error: 'An error occurred while calculating new customers.' });
  }
};

// Generate the customer report by month
const generateCustomerReport = async (req, res) => {
  const { user } = req.body;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const report = [];

  try {
    for (let i = 0; i < 12; i++) {
      const month = months[i];

      // Calculate start and end dates for the month
      const startDate = new Date(`2024-${i + 1}-01`);
      const endDate = new Date(i === 11 ? `2025-01-01` : `2024-${i + 2}-01`);

      // Find customers with transactions in the month
      const customers = await Customer.find({
        owner: user.id_owner, 
        $or: [
          { "firstPurchaseDate": { $gte: startDate, $lt: endDate } },
          { "lastPurchaseDate": { $gte: startDate, $lt: endDate } }
        ]
      });

      // Categorize customers
      const loyalCustomers = customers.filter(customer => 
        customer.rate >= 2 && parseFloat(customer.money.replace(/\./g, '')) >= 50000
      ).length;

      const newCustomers = customers.filter(customer => 
        customer.rate === 1 && 
        customer.firstPurchaseDate && 
        new Date(customer.firstPurchaseDate).getMonth() === i
      ).length;

      const returningCustomers = customers.filter(customer => 
        customer.rate > 1 && 
        customer.lastPurchaseDate && 
        new Date(customer.lastPurchaseDate).getMonth() === i &&
        customer.firstPurchaseDate && 
        new Date(customer.firstPurchaseDate).getMonth() < i
      ).length;

      // Add data to a report
      report.push({
        name: month,
        "Loyal Customers": loyalCustomers,
        "New Customers": newCustomers,
        "Returning Customers": returningCustomers
      });
    }

    return res.status(200).json(report);
  } catch (error) {
    logger.error('Error generating customer report:', error);
    return res.status(500).json({ error: 'An error occurred while generating customer report.' });
  }
};

// Generate a daily sales report for the last 8 days
const generateDailySale = async (req, res) => {
  const { user } = req.body;

  try {
    const today = new Date();
    const date = [];
    const report = [];

    for (let i = 7; i >= 0; i--) {
      let money = 0;

      // Calculate start and end dates for each day
      const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
      const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i + 1));

      // Format date for display
      date.push(`day ${startDate.getDate()}-Month ${startDate.getMonth() + 1}`);

      // Find bills for the day
      const moneyInDate = await Bill.find({
        owner: user.id_owner,
        orderDate: { $gte: startDate, $lt: endDate }
      });

      // Calculate total amount
      moneyInDate.forEach((bill) => {
        money += parseInt(bill.totalAmount.replace(/\./g, '')) || 0;
      });

      report.push(money);
    }

    return res.status(200).json({
      date,
      report
    });
  } catch (error) {
    logger.error('Error generating daily sales report:', error);
    return res.status(500).json({ error: 'An error occurred while generating daily sales report.' });
  }
};

// Generate the daily new customer report for the last 8 days
const generateDailyCustomer = async (req, res) => {
  const { user } = req.body;

  try {
    const today = new Date();
    const labels = [];
    const data = [];

    for (let i = 7; i >= 0; i--) {
      // Calculate start and end dates for each day
      const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
      const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i + 1));

      // Format date for display
      labels.push(`day ${startDate.getUTCDate()}-Month ${startDate.getUTCMonth() + 1}`);

      // Find customers created on the day
      const customerInDate = await Customer.find({
        owner: user.id_owner,
        createdAt: { $gte: startDate, $lt: endDate }
      });

      data.push(customerInDate.length);
    }

    return res.status(200).json({
      labels,
      data
    });
  } catch (error) {
    logger.error('Error generating daily customer report:', error);
    return res.status(500).json({ error: 'An error occurred while generating daily customer report.' });
  }
};

// Get top-rated products
function getTopRatedProducts(products, topN = 3) {
  return products
    .sort((a, b) => b.rate - a.rate)
    .slice(0, topN);
}

// Generate top-rated products
const generateTopProduct = async (req, res) => {
  const { user } = req.body;

  try {
    const products = await Product.find({
      owner: user.id_owner
    });

    const topProducts = getTopRatedProducts(products);

    return res.status(200).json(topProducts);
  } catch (error) {
    logger.error('Error generating top products:', error);
    return res.status(500).json({ error: 'An error occurred while generating top products.' });
  }
};

// Calculate total pending orders and percentage
const totalPending = async (req, res) => {
  const { user } = req.body;

  try {
    const pendingOrders = await OrderDetail.find({
      ownerId: user.id_owner,
      generalStatus: "pending"
    });

    const totalOrders = await OrderDetail.find({
      ownerId: user.id_owner
    });

    let percentPending = 0;

    if (totalOrders.length > 0) {
      percentPending = (pendingOrders.length / totalOrders.length) * 100;
    }

    return res.status(200).json({
      total: pendingOrders.length,
      percent: percentPending.toFixed(2) + "%"
    });
  } catch (error) {
    logger.error('Error calculating pending orders:', error);
    return res.status(500).json({ error: 'An error occurred while calculating pending orders.' });
  }
};

// Get recent activity from various sources
const recentActivity = async (req, res) => {
  const { user } = req.body;

  try {
    // Query events from different collections
    const roleEvents = await Customer.find({
      owner: user.id_owner
    }).sort({ createdAt: -1 }).limit(10);

    const historyEvents = await History.find({
      owner: user.id_owner
    }).sort({ timestamp: -1 }).limit(10);

    const supplierEvents = await SupplierChangeHistory.find({
      owner: user.id_owner
    }).sort({ timestamp: -1 }).limit(10);

    // Merge events from three collections
    const allEvents = [
      ...roleEvents.map(event => ({
        type: "feed-item-success",
        detail: "create customer : " + event.name,
        date: new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })),
      ...historyEvents.map(event => ({
        type: "feed-item-danger",
        detail: event.product + " <br /> " + event.action + " <br /> " + event.details,
        date: new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })),
      ...supplierEvents.map(event => ({
        type: "feed-item-info",
        detail: event.supplier + " <br /> " + event.action + " <br /> " + event.details,
        date: new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))
    ];

    // Sort all events by date in descending order
    const sortedEvents = allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get the 7 most recent events
    const recentEvents = sortedEvents.slice(0, 7);

    return res.status(200).json({
      events: recentEvents
    });
  } catch (error) {
    logger.error('Error fetching recent activity:', error);
    return res.status(500).json({ error: 'An error occurred while fetching recent activity.' });
  }
};

module.exports = {
  totalRevenue,
  todayIncome,
  newCustomer,
  generateCustomerReport,
  generateDailySale,
  generateDailyCustomer,
  generateTopProduct,
  totalPending,
  recentActivity
};
