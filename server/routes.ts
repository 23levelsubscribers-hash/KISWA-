import express, { Request, Response } from 'express';
import { db } from './db';
import { OrderStatus } from '../src/types';

export const apiRouter = express.Router();

apiRouter.use(express.json());

// Health Check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), app: 'KASWAH FAST FOODS API' });
});

// Authentication
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (role === 'admin') {
    // Admin credentials
    if (email === 'admin@kaswah.com' && password === 'admin123') {
      return res.json({
        success: true,
        user: {
          id: 'admin-1',
          name: 'Hamza Khan (Head Manager)',
          email: 'admin@kaswah.com',
          role: 'Super Admin'
        },
        token: 'kaswah-admin-token-secure-9921'
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials. Use admin@kaswah.com / admin123' });
    }
  } else {
    // Customer login
    let customer = db.getCustomers().find(c => c.email.toLowerCase() === email?.toLowerCase());
    if (!customer) {
      // Auto-register or demo account
      customer = db.addCustomer({
        name: email.split('@')[0].toUpperCase(),
        email,
        phone: '+92 300 0000000',
        addresses: [],
        favoriteProductIds: []
      });
    }
    return res.json({
      success: true,
      customer,
      token: `kaswah-cust-token-${customer.id}`
    });
  }
});

// Restaurant Settings
apiRouter.get('/settings', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

apiRouter.put('/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Categories
apiRouter.get('/categories', (req: Request, res: Response) => {
  res.json(db.getCategories());
});

apiRouter.post('/categories', (req: Request, res: Response) => {
  const { name, slug, iconName, image, isActive, displayOrder } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  const newCat = db.addCategory({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    iconName: iconName || 'Utensils',
    image,
    isActive: isActive ?? true,
    displayOrder: displayOrder || db.getCategories().length + 1
  });
  res.status(201).json(newCat);
});

apiRouter.put('/categories/:id', (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
});

apiRouter.delete('/categories/:id', (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) return res.status(404).json({ error: 'Category not found' });
  res.json({ success: true });
});

// Products
apiRouter.get('/products', (req: Request, res: Response) => {
  const includeInactive = req.query.all === 'true';
  const categoryId = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;

  let products = db.getProducts(includeInactive);

  if (categoryId && categoryId !== 'all') {
    products = products.filter(p => p.categoryId === categoryId);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  res.json(products);
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

apiRouter.post('/products', (req: Request, res: Response) => {
  const { name, price, categoryId } = req.body;
  if (!name || price === undefined || !categoryId) {
    return res.status(400).json({ error: 'Name, price, and categoryId are required' });
  }

  const category = db.getCategories().find(c => c.id === categoryId);
  const newProd = db.addProduct({
    ...req.body,
    categoryName: category ? category.name : req.body.categoryName || 'General',
    slug: req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  });
  res.status(201).json(newProd);
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const category = req.body.categoryId ? db.getCategories().find(c => c.id === req.body.categoryId) : undefined;
  const updates = { ...req.body };
  if (category) {
    updates.categoryName = category.name;
  }
  const updated = db.updateProduct(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

// Orders
apiRouter.get('/orders', (req: Request, res: Response) => {
  const { status, customerId, search } = req.query;
  let orders = db.getOrders();

  if (status && status !== 'all') {
    orders = orders.filter(o => o.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (customerId) {
    orders = orders.filter(o => o.customerId === customerId);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    orders = orders.filter(
      o =>
        o.id.toLowerCase().includes(q) ||
        o.orderNumber.includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  }

  res.json(orders);
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  const { customerName, customerPhone, deliveryAddress, items, grandTotal } = req.body;
  if (!customerName || !customerPhone || !items || !items.length) {
    return res.status(400).json({ error: 'Customer name, phone and at least one item required' });
  }

  const newOrder = db.createOrder(req.body);
  res.status(201).json(newOrder);
});

apiRouter.patch('/orders/:id/status', (req: Request, res: Response) => {
  const { status, note } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const updated = db.updateOrderStatus(req.params.id, status as OrderStatus, note);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

// Customers
apiRouter.get('/customers', (req: Request, res: Response) => {
  res.json(db.getCustomers());
});

apiRouter.get('/customers/:id', (req: Request, res: Response) => {
  const customer = db.getCustomerById(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

apiRouter.post('/customers', (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }
  const existing = db.getCustomerById(email);
  if (existing) {
    return res.status(409).json({ error: 'Customer with this email already exists', customer: existing });
  }
  const newCustomer = db.addCustomer(req.body);
  res.status(201).json(newCustomer);
});

apiRouter.put('/customers/:id', (req: Request, res: Response) => {
  const updated = db.updateCustomer(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Customer not found' });
  res.json(updated);
});

apiRouter.get('/customers/:id/orders', (req: Request, res: Response) => {
  const orders = db.getCustomerOrders(req.params.id);
  res.json(orders);
});

// Coupons
apiRouter.get('/coupons', (req: Request, res: Response) => {
  res.json(db.getCoupons());
});

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, error: 'Coupon code required' });
  const result = db.validateCoupon(code, Number(subtotal) || 0);
  res.json(result);
});

apiRouter.post('/coupons', (req: Request, res: Response) => {
  const { code, discountValue, minOrderAmount } = req.body;
  if (!code || discountValue === undefined) {
    return res.status(400).json({ error: 'Code and discount value required' });
  }
  const newCoupon = db.addCoupon(req.body);
  res.status(201).json(newCoupon);
});

apiRouter.put('/coupons/:id', (req: Request, res: Response) => {
  const updated = db.updateCoupon(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Coupon not found' });
  res.json(updated);
});

apiRouter.delete('/coupons/:id', (req: Request, res: Response) => {
  const success = db.deleteCoupon(req.params.id);
  if (!success) return res.status(404).json({ error: 'Coupon not found' });
  res.json({ success: true });
});

// Deals
apiRouter.get('/deals', (req: Request, res: Response) => {
  res.json(db.getDeals());
});

apiRouter.post('/deals', (req: Request, res: Response) => {
  const { title, subtitle } = req.body;
  if (!title) return res.status(400).json({ error: 'Deal title is required' });
  const newDeal = db.addDeal(req.body);
  res.status(201).json(newDeal);
});

apiRouter.put('/deals/:id', (req: Request, res: Response) => {
  const updated = db.updateDeal(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Deal not found' });
  res.json(updated);
});

apiRouter.delete('/deals/:id', (req: Request, res: Response) => {
  const success = db.deleteDeal(req.params.id);
  if (!success) return res.status(404).json({ error: 'Deal not found' });
  res.json({ success: true });
});

// Notifications
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const target = req.query.target as 'admin' | 'customer' | undefined;
  const customerId = req.query.customerId as string | undefined;
  res.json(db.getNotifications(target, customerId));
});

apiRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const success = db.markNotificationRead(req.params.id);
  res.json({ success });
});

apiRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  const target = req.body.target || 'admin';
  db.markAllNotificationsRead(target);
  res.json({ success: true });
});

// Reports & Analytics
apiRouter.get('/reports', (req: Request, res: Response) => {
  res.json(db.getReports());
});

// Reset Demo Data
apiRouter.post('/reset-demo', (req: Request, res: Response) => {
  db.resetToDefaults();
  res.json({ success: true, message: 'Database reset to default seed data successfully' });
});
