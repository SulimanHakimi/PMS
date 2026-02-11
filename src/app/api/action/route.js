import { NextResponse } from 'next/server';
// Force reload
import dbConnect from '@/lib/db';
import Medicine from '@/models/Medicine';
import Group from '@/models/Group';
import Supplier from '@/models/Supplier';
import Customer from '@/models/Customer';
import Invoice from '@/models/Invoice';
import User from '@/models/User';
import Settings from '@/models/Settings';
import VisitorChat from '@/models/VisitorChat';

// Define handlers here (mirroring electron/db-handlers.js)
const handlers = {
    'get-dashboard-stats': async () => {
        const totalMedicines = await Medicine.countDocuments({});
        const distinctGroups = await Medicine.distinct('group');
        const shortageCount = await Medicine.countDocuments({ stock: { $lt: 30 } });
        const totalSuppliers = await Supplier.countDocuments({});

        // Calculate Revenue and Sales
        const allInvoices = await Invoice.find({}, { totalAmount: 1, items: 1 });
        const revenue = allInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
        let qtySold = 0;
        allInvoices.forEach(inv => {
            if (inv.items && Array.isArray(inv.items)) {
                inv.items.forEach(item => qtySold += (item.quantity || 0));
            }
        });

        return {
            totalMedicines,
            totalGroups: distinctGroups.length,
            shortageCount,
            suppliers: totalSuppliers,
            revenue,
            qtySold,
            invoices: allInvoices.length,
            users: await User.countDocuments({}),
            customers: await Customer.countDocuments({})
        };
    },
    'get-users': async () => {
        try {
            const users = await User.find({}, { password: 0 }).sort({ username: 1 }).lean();
            return JSON.parse(JSON.stringify(users));
        } catch (error) {
            return [];
        }
    },
    'get-medicines': async () => {
        // Fix old records missing price fields (using raw collection to bypass schema filtering)
        await Medicine.collection.updateMany(
            { $or: [{ buyPrice: { $exists: false } }, { sellPrice: { $exists: false } }] },
            { $set: { buyPrice: 0, sellPrice: 0 } }
        );
        const medicines = await Medicine.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(medicines));
    },
    'get-groups': async () => {
        const groups = await Group.find({}).sort({ name: 1 }).lean();
        const medicineCounts = await Medicine.aggregate([
            { $group: { _id: '$group', count: { $sum: 1 } } }
        ]);
        const countsMap = {};
        medicineCounts.forEach(item => { if (item._id) countsMap[item._id] = item.count; });
        return groups.map(group => ({ ...group, count: countsMap[group.name] || 0 }));
    },
    'add-medicine': async (data) => {
        try {
            const newMedicine = await Medicine.create({
                ...data,
                stock: Number(data.stock),
                buyPrice: Number(data.buyPrice || 0),
                sellPrice: Number(data.sellPrice || 0)
            });
            return { success: true, medicine: newMedicine };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'update-medicine': async (data) => {
        try {
            const { medicineId, ...updateData } = data;
            if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
            if (updateData.buyPrice !== undefined) updateData.buyPrice = Number(updateData.buyPrice);
            if (updateData.sellPrice !== undefined) updateData.sellPrice = Number(updateData.sellPrice);

            const updatedMedicine = await Medicine.findOneAndUpdate(
                { medicineId: medicineId },
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedMedicine) {
                return { success: false, error: 'Medicine not found' };
            }
            return { success: true, medicine: JSON.parse(JSON.stringify(updatedMedicine)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'delete-medicine': async (medicineId) => {
        try {
            const deleted = await Medicine.findOneAndDelete({ medicineId });
            if (!deleted) {
                return { success: false, error: 'Medicine not found' };
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'add-group': async (data) => {
        try {
            const existing = await Group.findOne({ name: data.name });
            if (existing) return { success: false, error: 'Group already exists' };
            const newGroup = await Group.create({ name: data.name });
            return { success: true, group: newGroup };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'delete-group': async (groupName) => {
        try {
            const count = await Medicine.countDocuments({ group: groupName });
            if (count > 0) {
                return { success: false, error: `Cannot delete group because it contains ${count} medicines.` };
            }
            const deleted = await Group.findOneAndDelete({ name: groupName });
            if (!deleted) return { success: false, error: 'Group not found' };
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'get-medicine-by-id': async (medicineId) => {
        const medicine = await Medicine.findOne({ medicineId }).lean();
        return medicine ? JSON.parse(JSON.stringify(medicine)) : null;
    },
    'login': async ({ username, password }) => {
        // Mock login for Web API if User model not in src
        // Or better, assume User model logic like in electron
        // For now, simple success if provided
        return { success: true, user: { username } };
    },
    'create-user': async ({ username, password }) => {
        return { success: true, user: { username } };
    },
    'get-suppliers': async () => {
        try {
            const suppliers = await Supplier.find({}).sort({ name: 1 }).lean();
            const medicineCount = await Medicine.aggregate([
                { $group: { _id: '$supplier', count: { $sum: 1 } } }
            ]);
            const countsMap = {};
            medicineCount.forEach(item => {
                if (item._id) countsMap[item._id] = item.count;
            });

            const result = suppliers.map(supplier => ({
                ...supplier,
                medicineCount: countsMap[supplier.name] || 0
            }));

            return JSON.parse(JSON.stringify(result));
        } catch (error) {
            console.error('get-suppliers error:', error);
            return [];
        }
    },
    'add-supplier': async (data) => {
        try {
            const existing = await Supplier.findOne({ name: data.name });
            if (existing) {
                return { success: false, error: 'Supplier already exists' };
            }

            const newSupplier = await Supplier.create(data);
            return { success: true, supplier: JSON.parse(JSON.stringify(newSupplier)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'update-supplier': async (data) => {
        try {
            const { _id, ...updateData } = data;
            const updatedSupplier = await Supplier.findByIdAndUpdate(
                _id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedSupplier) {
                return { success: false, error: 'Supplier not found' };
            }
            return { success: true, supplier: JSON.parse(JSON.stringify(updatedSupplier)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'delete-supplier': async (supplierId) => {
        try {
            const supplier = await Supplier.findById(supplierId);
            if (!supplier) {
                return { success: false, error: 'Supplier not found' };
            }

            const count = await Medicine.countDocuments({ supplier: supplier.name });
            if (count > 0) {
                return { success: false, error: `نمی توان عرضه کننده را حذف کرد زیرا ${count} دوا از این عرضه کننده موجود است.` };
            }

            await Supplier.findByIdAndDelete(supplierId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'get-supplier-by-id': async (supplierId) => {
        try {
            const supplier = await Supplier.findById(supplierId).lean();
            if (!supplier) return null;
            return JSON.parse(JSON.stringify(supplier));
        } catch (error) {
            console.error('get-supplier-by-id error:', error);
            return null;
        }
    },

    // Customer Handlers
    'get-customers': async () => {
        try {
            const customers = await Customer.find({}).sort({ name: 1 }).lean();
            return JSON.parse(JSON.stringify(customers));
        } catch (error) {
            return [];
        }
    },
    'add-customer': async (data) => {
        try {
            const customer = await Customer.create(data);
            return { success: true, customer: JSON.parse(JSON.stringify(customer)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'get-notifications': async () => {
        try {
            const notifications = [];

            // 1. Low Stock Alerts
            const shortages = await Medicine.find({ stock: { $lt: 30 } }).limit(20).lean();
            shortages.forEach(med => {
                notifications.push({
                    id: `shortage-${med._id}`,
                    type: 'warning',
                    title: 'کمبود موجودی',
                    message: `دوا ${med.name} رو به اتمام است (موجودی: ${med.stock})`,
                    time: med.updatedAt || new Date(),
                    link: '/inventory/medicines'
                });
            });

            // 2. Recent Sales
            const recentSales = await Invoice.find({}).sort({ createdAt: -1 }).limit(5).lean();
            recentSales.forEach(inv => {
                notifications.push({
                    id: `sale-${inv._id}`,
                    type: 'success',
                    title: 'فروش جدید',
                    message: `فکتور #${inv.invoiceNumber} به مبلغ ${inv.totalAmount} ثبت شد.`,
                    time: inv.createdAt,
                    link: '/sales/list'
                });
            });

            return JSON.parse(JSON.stringify(notifications.sort((a, b) => new Date(b.time) - new Date(a.time))));
        } catch (error) {
            return [];
        }
    },
    'update-customer': async (data) => {
        try {
            const { _id, ...updateData } = data;
            const updatedCustomer = await Customer.findByIdAndUpdate(
                _id,
                updateData,
                { new: true, runValidators: true }
            );
            return { success: true, customer: JSON.parse(JSON.stringify(updatedCustomer)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'delete-customer': async (customerId) => {
        try {
            await Customer.findByIdAndDelete(customerId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Invoice Handlers
    'get-invoices': async () => {
        try {
            const invoices = await Invoice.find({}).sort({ createdAt: -1 }).lean();
            return JSON.parse(JSON.stringify(invoices));
        } catch (error) {
            return [];
        }
    },
    'create-invoice': async (data) => {
        if (!data) return { success: false, error: 'No data provided' };
        // Transactions are harder in serverless environments without replica sets
        // We'll do a simple loop for now
        try {
            if (!data.invoiceNumber) {
                const count = await Invoice.countDocuments();
                const now = new Date();
                data.invoiceNumber = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${(count + 1).toString().padStart(4, '0')}`;
            }

            const enrichedItems = [];
            for (const item of data.items) {
                const medicine = await Medicine.findOne({ medicineId: item.medicineId });
                if (!medicine) throw new Error(`Medicine ${item.name} not found`);
                if (medicine.stock < item.quantity) throw new Error(`Insufficient stock for ${item.name}`);

                await Medicine.updateOne(
                    { medicineId: item.medicineId },
                    { $inc: { stock: -item.quantity } }
                );

                enrichedItems.push({
                    ...item,
                    buyPrice: medicine.buyPrice || 0
                });
            }

            const invoiceData = {
                ...data,
                items: enrichedItems,
                createdBy: data.createdBy || 'admin'
            };

            const invoice = await Invoice.create(invoiceData);

            if (data.customerName && data.customerPhone) {
                await Customer.findOneAndUpdate(
                    { phone: data.customerPhone },
                    { name: data.customerName },
                    { upsert: true }
                );
            }

            return { success: true, invoice: JSON.parse(JSON.stringify(invoice)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'get-invoice-by-id': async (id) => {
        try {
            const invoice = await Invoice.findById(id).lean();
            return JSON.parse(JSON.stringify(invoice));
        } catch (error) {
            return null;
        }
    },
    'delete-user': async (userId) => {
        try {
            if (!userId) return { success: false, error: 'User ID is required' };
            await User.findByIdAndDelete(userId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'get-settings': async () => {
        try {
            const settings = await Settings.findOne();
            if (settings) {
                return JSON.parse(JSON.stringify(settings));
            } else {
                const newSettings = await Settings.create({});
                return JSON.parse(JSON.stringify(newSettings));
            }
        } catch (error) {
            return {
                pharmacyName: 'Sheen Pharma',
                address: '',
                phone: '',
                email: '',
                currency: 'AFN',
                taxRate: 0,
                receiptFooter: 'Thanks for your visit!'
            };
        }
    },
    'update-settings': async (data) => {
        try {
            const settings = await Settings.findOneAndUpdate({}, data, { new: true, upsert: true });
            return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'backup-data': async () => {
        try {
            const medicines = await Medicine.find({}).lean();
            const invoices = await Invoice.find({}).lean();
            const customers = await Customer.find({}).lean();
            const suppliers = await Supplier.find({}).lean();
            const groups = await Group.find({}).lean();

            const backup = {
                medicines,
                invoices,
                customers,
                suppliers,
                groups,
                timestamp: new Date().toISOString()
            };

            return { success: true, data: JSON.stringify(backup, null, 2) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    // Chat Handlers
    'get-chats': async () => {
        try {
            const chats = await VisitorChat.find({}).sort({ lastMessageTime: -1 }).lean();
            return JSON.parse(JSON.stringify(chats));
        } catch (error) {
            console.error('get-chats error:', error);
            return [];
        }
    },
    'send-message': async ({ visitorId, text, sender }) => {
        try {
            const chat = await VisitorChat.findOne({ visitorId });
            if (!chat) return { success: false, error: 'Chat not found' };

            const newMessage = {
                sender,
                text,
                timestamp: new Date(),
                read: sender === 'admin'
            };

            chat.messages.push(newMessage);
            chat.lastMessage = text;
            chat.lastMessageTime = new Date();
            if (sender === 'visitor') {
                chat.unreadCount += 1;
            }

            await chat.save();
            return { success: true, chat: JSON.parse(JSON.stringify(chat)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'mark-chat-read': async (visitorId) => {
        try {
            await VisitorChat.findOneAndUpdate(
                { visitorId },
                { $set: { unreadCount: 0, 'messages.$[].read': true } }
            );
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'seed-chats': async () => {
        try {
            const count = await VisitorChat.countDocuments();
            if (count > 0) return { success: true, message: 'Already seeded' };

            const sampleChats = [
                {
                    visitorName: 'احمد رسولی',
                    visitorId: 'v1',
                    status: 'online',
                    location: 'Kabul, AF',
                    device: 'Chrome / Windows',
                    lastMessage: 'سلام، آیا داروی آموکسی سیلین موجود دارید؟',
                    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
                    unreadCount: 1,
                    messages: [
                        { sender: 'visitor', text: 'سلام، وقت بخیر', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
                        { sender: 'admin', text: 'سلام، خوش آمدید. چطور می‌توانم کمک‌تان کنم؟', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
                        { sender: 'visitor', text: 'سلام، آیا داروی آموکسی سیلین موجود دارید؟', timestamp: new Date(Date.now() - 1000 * 60 * 5) }
                    ]
                },
                {
                    visitorName: 'مریم ابراهیمی',
                    visitorId: 'v2',
                    status: 'offline',
                    location: 'Herat, AF',
                    device: 'Safari / iPhone',
                    lastMessage: 'تشکر از راهنمایی‌تان.',
                    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
                    unreadCount: 0,
                    messages: [
                        { sender: 'visitor', text: 'قیمت شربت سرفه چقدر است؟', timestamp: new Date(Date.now() - 1000 * 60 * 70) },
                        { sender: 'admin', text: 'قیمت آن ۱۵۰ افغانی می‌باشد.', timestamp: new Date(Date.now() - 1000 * 60 * 65) },
                        { sender: 'visitor', text: 'تشکر از راهنمایی‌تان.', timestamp: new Date(Date.now() - 1000 * 60 * 60) }
                    ]
                }
            ];

            await VisitorChat.insertMany(sampleChats);
            return { success: true, message: 'Sample chats seeded' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const { action, data } = body;

    const handler = handlers[action];
    if (!handler) {
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    try {
        const result = await handler(data);
        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
