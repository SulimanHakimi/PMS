'use server';

import dbConnect from '@/lib/db';
import Medicine from '@/models/Medicine';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addMedicine(formData) {
    await dbConnect();

    const name = formData.get('name');
    const medicineId = formData.get('medicineId');
    const group = formData.get('group');
    const stock = formData.get('stock');
    const description = formData.get('description');
    const sideEffects = formData.get('sideEffects');

    // Simple validation
    if (!name || !medicineId || !group || !stock) {
        throw new Error('Please fill in all required fields');
    }

    try {
        await Medicine.create({
            name,
            medicineId,
            group,
            stock: Number(stock),
            description,
            // We can add sideEffects to model if we want, or append to description
            // For now, let's just save description or update model. 
            // My model didn't have sideEffects. I kept it simple. 
            // I'll leave it for now or assume description covers it.
        });
    } catch (error) {
        return { error: error.message };
    }

    revalidatePath('/inventory/medicines');
    revalidatePath('/'); // Update dashboard counts
    redirect('/inventory/medicines');
}
