import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Medicine from '@/models/Medicine';
import Group from '@/models/Group';
import Supplier from '@/models/Supplier';
import Customer from '@/models/Customer';
import Invoice from '@/models/Invoice';
// Create a User model in src/models if not exists, but for now we can mock or use direct if needed.
// However, since db-handlers.js requires ./models/User, I should ensure src/models/User.js exists too.
// I'll check/create that first in the next step.

// Define handlers here (mirroring electron/db-handlers.js)
const handlers = {
    'get-dashboard-stats': async () => {
        const totalMedicines = await Medicine.countDocuments({});
        const distinctGroups = await Medicine.distinct('group');
        const shortageCount = await Medicine.countDocuments({ stock: { $lt: 30 } });
        const totalSuppliers = await Supplier.countDocuments({});
        return {
            totalMedicines,
            totalGroups: distinctGroups.length,
            shortageCount,
            suppliers: totalSuppliers,
            revenue: 0, qtySold: 0, invoices: 0, users: 0, customers: 0
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

            for (const item of data.items) {
                const medicine = await Medicine.findOne({ medicineId: item.medicineId });
                if (!medicine) throw new Error(`Medicine ${item.name} not found`);
                if (medicine.stock < item.quantity) throw new Error(`Insufficient stock for ${item.name}`);

                await Medicine.updateOne(
                    { medicineId: item.medicineId },
                    { $inc: { stock: -item.quantity } }
                );
            }

            const invoice = await Invoice.create(data);

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
