import cartModel from '../../model/cartModel.js';
import productModel from '../../model/productModel.js';

// Add item to cart
export const addItemCartController = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    const parsedQuantity = parseInt(quantity);
    if (!productId || !parsedQuantity || parsedQuantity < 1) {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const productDoc = await productModel.findById(productId).populate('vendor');
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [{ product: productId, quantity: parsedQuantity, vendor: productDoc.vendor._id }],
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += parsedQuantity;
      } else {
        cart.items.push({ product: productId, quantity: parsedQuantity, vendor: productDoc.vendor._id });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove item from cart
export const deleteItemCartController = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    let cart = await cartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

    cart.items.splice(index, 1);
    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get cart total
export const getTotalCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ userId }).populate('items.product', 'price name images').populate('items.vendor', 'name'); // Populate product and vendor
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const total = cart.items.reduce((acc, item) => {
      return acc + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.status(200).json({ success: true, message: 'Total price calculated', total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// Sync cart
export const syncCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid cart items format' });
    }

    // Ensure each item in the array has the correct format
    const validItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      vendor: item.vendor,  // Ensure vendor is included in each item
    }));

    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({ userId, items: validItems });
    } else {
      cart.items = validItems;  // Replace old items with new items
    }

    await cart.save();
    res.status(200).json({ message: 'Cart synced successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get all carts (Admin)
export const getAllCartsController = async (req, res) => {
  try {
    const carts = await cartModel.find().populate('items.product', 'name price');
    res.status(200).json({ success: true, message: "All carts fetched", carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get current user's cart
export const getUserCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ userId })
      .populate({
        path: 'items.product',
        select: 'name price images vendor',
        populate: {
          path: 'vendor',
          select: 'name businessName'
        }
      });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, message: "User cart fetched", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

