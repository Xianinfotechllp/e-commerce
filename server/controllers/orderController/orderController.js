import Order from '../../model/orderModel.js';

// Create Order
export const createOrderController = async (req, res) => {
  try {
    const { user, items, paymentStatus, address, status } = req.body;

    if (!user || !Array.isArray(items) || !items.length || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    for (const i of items) {
      if (!i.product || !i.vendor || !i.quantity || !i.price) {
        console.log(i.vendor)
        return res.status(400).json({ error: 'Each item must have product, vendor, quantity, and price' });
      }
    }

    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    const orderItems = items.map(i => ({
      product: i.product,
      vendor: i.vendor,
      quantity: i.quantity,
    }));
    // console.log(orderItems)

    const newOrder = new Order({
      user,
      items: orderItems,
      totalAmount,
      paymentStatus: paymentStatus || 'Pending',
      address,
      status: status || 'Pending',
    });

    const saved = await newOrder.save();

    const populated = await Order.findById(saved._id)
      .populate('user', 'name email')
      .populate('items.product')
      .populate('items.vendor', 'name');

    return res.status(201).json(populated);
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get All Orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .populate('items.vendor', 'name');

    return res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Error fetching all orders:', err.message);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get One Order
export const getOrderByIdController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .populate('items.vendor', 'name');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.status(200).json(order);
  } catch (err) {
    console.error('❌ Error fetching order:', err.message);
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Update Order
export const updateOrderController = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status' });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.orderid,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .populate('items.vendor', 'name');

    if (!updated) return res.status(404).json({ error: 'Order not found' });

    return res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Error updating order status:', err.message);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Delete Order
export const deleteOrderController = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.orderid);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting order:', err.message);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
};

// Orders By User
export const getOrdersByUserController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product', 'name price')
      .populate('items.vendor', 'name');

    return res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Error fetching user orders:', err.message);
    return res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

// Orders By Vendor
export const getOrdersByVendorController = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.vendor': req.params.vendorId })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .populate('items.vendor', 'name');

    return res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Error fetching vendor orders:', err.message);
    return res.status(500).json({ error: 'Failed to fetch vendor orders' });
  }
};

