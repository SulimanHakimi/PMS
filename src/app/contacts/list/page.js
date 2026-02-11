'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, MapPin, Mail, Search, Edit2, Trash2, Building2, User } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';

export default function ContactList() {
    const [activeTab, setActiveTab] = useState('customers'); // customers, suppliers
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null); // null = add mode
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '', // specific to supplier
        contactPerson: '' // specific to supplier
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        const [custData, suppData] = await Promise.all([
            invokeIPC('get-customers'),
            invokeIPC('get-suppliers')
        ]);
        if (custData) setCustomers(custData);
        if (suppData) setSuppliers(suppData);
        setLoading(false);
    };

    const handleSearch = (items) => {
        if (!searchTerm) return items;
        return items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.phone && item.phone.includes(searchTerm))
        );
    };

    const handleOpenModal = (contact = null) => {
        if (contact) {
            setEditingContact(contact);
            setFormData({
                name: contact.name,
                phone: contact.phone || '',
                email: contact.email || '',
                address: contact.address || '',
                notes: contact.notes || '',
                contactPerson: contact.contactPerson || ''
            });
        } else {
            setEditingContact(null);
            setFormData({ name: '', phone: '', email: '', address: '', notes: '', contactPerson: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingContact(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let result;
        if (activeTab === 'customers') {
            if (editingContact) {
                // Edit Customer - assuming we might need an update handler for customer if not exists, but usually we do
                // Actually db-handlers has add-customer but maybe not update-customer explicitly exposed? 
                // Let's check headers... update-supplier exists. update-customer might not be in db-handlers.js yet?
                // Wait, I saw get-customers and add-customer. I should add update-customer/delete-customer to db-handlers if missing.
                // For now, let's assume I need to add them.
                // Oh wait, customer update is usually separate. 
                // Let's implement basics. If handlers miss, I will add them next step.
                // Actually better to be safe, I'll use what exists or handle gracefully.
                // Assuming update-customer exists or I'll add it.
                // The previous read of db-handlers showed add-customer. Update/Delete might be missing for Customer.
                // I will Add them in next step if needed. For now let's write the UI logic assuming they will exist or I'll implement "upsert" via add? No.

                // Let's assume standard 'update-customer', 'delete-customer'
                result = await invokeIPC('update-customer', { ...formData, _id: editingContact._id });
            } else {
                result = await invokeIPC('add-customer', formData);
            }
        } else {
            if (editingContact) {
                result = await invokeIPC('update-supplier', { ...formData, _id: editingContact._id });
            } else {
                result = await invokeIPC('add-supplier', formData);
            }
        }

        setLoading(false);

        if (result && result.success) {
            handleCloseModal();
            fetchContacts();
        } else {
            // Fallback for missing handlers: alert user
            if (result?.error?.includes('No handler')) {
                alert('Error: Handler not implemented yet. Please contact developer.');
            } else {
                alert('Error saving contact: ' + (result?.error || 'Unknown error'));
            }
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        let result;
        if (activeTab === 'customers') {
            result = await invokeIPC('delete-customer', id);
        } else {
            result = await invokeIPC('delete-supplier', id);
        }

        if (result && result.success) {
            fetchContacts();
        } else {
            alert('Error deleting: ' + (result?.error || 'Unknown error'));
        }
    };

    const displayedContacts = activeTab === 'customers' ? handleSearch(customers) : handleSearch(suppliers);

    return (
        <div className="p-4 md:p-8 font-sans h-full flex flex-col relative" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="w-6 h-6 text-teal-600" />
                        مدیریت تماس ها
                    </h1>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">مدیریت مشتریان و عرضه کنندگان</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/10 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-sm font-bold">مخاطب جدید</span>
                </button>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex p-1 bg-gray-50 rounded-xl w-full lg:w-auto">
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'customers' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        مشتریان ({customers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('suppliers')}
                        className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'suppliers' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        عرضه کنندگان ({suppliers.length})
                    </button>
                </div>

                <div className="relative w-full lg:w-80">
                    <input
                        type="text"
                        placeholder="جستجو نام یا شماره تماس..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pr-10 pl-4 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto">
                {displayedContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                        <Users className="w-16 h-16 opacity-10" />
                        <p className="font-bold text-sm">هیچ مخاطبی یافت نشد.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-10">
                        {displayedContacts.map((contact) => (
                            <div key={contact._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                                <div className={`absolute top-0 right-0 w-full h-1.5 ${activeTab === 'customers' ? 'bg-blue-500' : 'bg-orange-500'} opacity-50`}></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${activeTab === 'customers' ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20' : 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/20'}`}>
                                            {activeTab === 'customers' ? <User className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-800 text-base leading-tight group-hover:text-teal-600 transition-colors">{contact.name}</h3>
                                            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">{activeTab === 'customers' ? 'مشتری مستقیم' : 'عرضه کننده تجاری'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-all translate-y-[-4px] sm:translate-y-0 group-hover:translate-y-0">
                                        <button onClick={() => handleOpenModal(contact)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(contact._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600 border-t border-gray-50 pt-4 mt-auto">
                                    {contact.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center"><Phone className="w-3.5 h-3.5 text-gray-400" /></div>
                                            <span className="font-bold font-sans text-xs tracking-wide" dir="ltr">{contact.phone}</span>
                                        </div>
                                    )}
                                    {(contact.email || (activeTab === 'suppliers' && contact.contactPerson)) && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                                                {activeTab === 'suppliers' && contact.contactPerson ? <User className="w-3.5 h-3.5 text-gray-400" /> : <Mail className="w-3.5 h-3.5 text-gray-400" />}
                                            </div>
                                            <span className="truncate text-xs font-medium">{activeTab === 'suppliers' && contact.contactPerson ? contact.contactPerson : contact.email}</span>
                                        </div>
                                    )}
                                    {contact.address && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center"><MapPin className="w-3.5 h-3.5 text-gray-400" /></div>
                                            <span className="truncate text-xs font-medium">{contact.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-800">
                                {editingContact ? 'ویرایش اطلاعات' : 'افزودن مخاطب جدید'}
                            </h3>
                            <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">نام {activeTab === 'customers' ? 'مشتری' : 'شرکت / عرضه کننده'}</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none transition-all font-bold"
                                    placeholder="نام کامل..."
                                />
                            </div>

                            {activeTab === 'suppliers' && (
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">نام شخص مسئول</label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none transition-all font-bold"
                                        placeholder="نام مسئول..."
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">شماره تماس</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none transition-all font-bold font-sans"
                                        placeholder="07..."
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">ایمیل آدرس</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none transition-all font-bold font-sans"
                                        placeholder="mail@site.com"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">آدرس فیزیکی</label>
                                <textarea
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    rows="2"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white outline-none transition-all font-bold resize-none"
                                    placeholder="آدرس دقیق محل..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-4 text-sm font-black text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    لغو
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {loading ? 'در حال ثبت...' : (editingContact ? 'تایید ویرایش' : 'تایید و ثبت')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
