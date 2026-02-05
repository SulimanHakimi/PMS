const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const Group = require('./models/Group');
const User = require('./models/User');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const Invoice = require('./models/Invoice');

let isConnected = false;

async function connectDB(uri) {
    if (isConnected) return;
    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log('MongoDB Connected via Electron Main Process');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

const handlers = {
    'get-dashboard-stats': async () => {
        const totalMedicines = await Medicine.countDocuments({});
        const distinctGroups = await Medicine.distinct('group');
        const totalGroups = distinctGroups.length;
        const shortageCount = await Medicine.countDocuments({ stock: { $lt: 30 } });
        const totalSuppliers = await Supplier.countDocuments({});

        return {
            totalMedicines,
            totalGroups,
            shortageCount,
            suppliers: totalSuppliers,
            // Placeholders
            revenue: 0,
            qtySold: 0,
            invoices: 0,
            users: 0,
            customers: 0
        };
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
        medicineCounts.forEach(item => {
            if (item._id) countsMap[item._id] = item.count;
        });

        const result = groups.map(group => ({
            ...group,
            count: countsMap[group.name] || 0
        }));

        return JSON.parse(JSON.stringify(result));
    },
    'add-medicine': async (event, data) => {
        try {
            const newMedicine = await Medicine.create({
                name: data.name,
                medicineId: data.medicineId,
                group: data.group,
                supplier: data.supplier,
                stock: Number(data.stock),
                buyPrice: Number(data.buyPrice),
                sellPrice: Number(data.sellPrice),
                description: data.description,
            });
            return { success: true, medicine: JSON.parse(JSON.stringify(newMedicine)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'update-medicine': async (event, data) => {
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
    'delete-medicine': async (event, medicineId) => {
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

    'add-group': async (event, data) => {
        try {
            // Check if group already exists
            const existing = await Group.findOne({ name: data.name });
            if (existing) {
                return { success: false, error: 'Group already exists' };
            }

            const newGroup = await Group.create({ name: data.name });
            return { success: true, group: JSON.parse(JSON.stringify(newGroup)) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'delete-group': async (event, groupName) => {
        try {
            // Check if medicines exist in this group
            const count = await Medicine.countDocuments({ group: groupName });
            if (count > 0) {
                return { success: false, error: `نمی توان گروپ را حذف کرد زیرا ${count} دوا در آن موجود است.` };
            }

            const deleted = await Group.findOneAndDelete({ name: groupName });
            if (!deleted) return { success: false, error: 'Group not found' };

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'get-medicine-by-id': async (event, medicineId) => {
        try {
            const medicine = await Medicine.findOne({ medicineId }).lean();
            if (!medicine) return null;
            return JSON.parse(JSON.stringify(medicine));
        } catch (error) {
            console.error('get-medicine-by-id error:', error);
            return null;
        }
    },
    'login': async (event, { username, password }) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return { success: false, error: 'Invalid credentials' };
            }
            // In a real app, verify hash. Here we use plain text for simplicity/demo as per context
            if (user.password !== password) {
                return { success: false, error: 'Invalid credentials' };
            }
            return { success: true, user: { username: user.username, role: user.role } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    'create-user': async (event, { username, password }) => {
        try {
            // Simple check if user exists
            const exists = await User.findOne({ username });
            if (exists) return { success: false, error: 'User already exists' };
            const newUser = await User.create({ username, password });
            return { success: true, user: { username: newUser.username } };
        } catch (error) {
            return { success: false, error: error.message };
        }
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
    'add-supplier': async (event, data) => {
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
    'update-supplier': async (event, data) => {
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
    'delete-supplier': async (event, supplierId) => {
        try {
            // Check if medicines exist with this supplier
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
    'get-supplier-by-id': async (event, supplierId) => {
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
    'add-customer': async (event, data) => {
        try {
            const customer = await Customer.create(data);
            return { success: true, customer: JSON.parse(JSON.stringify(customer)) };
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
    'create-invoice': async (event, data) => {
        if (!data) return { success: false, error: 'No data provided' };

        // Try with session, but fallback if not supported (standard for standalone local DB)
        let session = null;
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (e) {
            console.log('Transactions not supported, proceeding without session');
            session = null;
        }

        try {
            // 1. Calculate invoice number if not provided
            if (!data.invoiceNumber) {
                const count = await Invoice.countDocuments();
                const now = new Date();
                data.invoiceNumber = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${(count + 1).toString().padStart(4, '0')}`;
            }

            // 2. Decrease Stock for each item
            for (const item of data.items) {
                const medicine = await Medicine.findOne({ medicineId: item.medicineId }).session(session);
                if (!medicine) throw new Error(`Medicine ${item.name} not found`);
                if (medicine.stock < item.quantity) throw new Error(`Insufficient stock for ${item.name}`);

                medicine.stock -= item.quantity;
                await medicine.save({ session });
            }

            // 3. Create Invoice
            const invoiceResults = await Invoice.create([data], { session });
            const savedInvoice = invoiceResults[0];

            // 4. Update/Create Customer if needed
            if (data.customerName && data.customerPhone) {
                await Customer.findOneAndUpdate(
                    { phone: data.customerPhone },
                    { name: data.customerName },
                    { upsert: true, session }
                );
            }

            if (session) await session.commitTransaction();
            return { success: true, invoice: JSON.parse(JSON.stringify(savedInvoice)) };
        } catch (error) {
            if (session) await session.abortTransaction();
            return { success: false, error: error.message };
        } finally {
            if (session) session.endSession();
        }
    },
    'get-invoice-by-id': async (event, id) => {
        try {
            const invoice = await Invoice.findById(id).lean();
            return JSON.parse(JSON.stringify(invoice));
        } catch (error) {
            return null;
        }
    }
};

module.exports = { connectDB, handlers };
