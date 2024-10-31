import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { useProductStore } from '../store/productStore';
import { useCompanyStore } from '../store/companyStore';
import { useAuthStore } from '../store/authStore';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { InventoryItem } from '../types';

function Inventory() {
  const { user } = useAuthStore();
  const { items, addItem, updateItem, deleteItem } = useInventoryStore();
  const { products } = useProductStore();
  const { companies } = useCompanyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    companyId: '',
    quantity: 0,
    unitPrice: 0,
    icmsRate: 0,
  });

  // Filter companies based on user role and access
  const accessibleCompanies = user?.role === 'admin'
    ? companies
    : companies.filter(company => 
        user?.companyIds?.includes(company.id)
      );

  // Filter items based on user's company access
  const filteredItems = user?.role === 'admin'
    ? items
    : items.filter(item => 
        user?.companyIds?.includes(item.companyId)
      );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItem(editingItem.id, formData);
    } else {
      addItem(formData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      productId: '',
      companyId: '',
      quantity: 0,
      unitPrice: 0,
      icmsRate: 0,
    });
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      productId: item.productId,
      companyId: item.companyId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      icmsRate: item.icmsRate,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Product',
      accessor: (item: InventoryItem) =>
        products.find((p) => p.id === item.productId)?.name || '',
    },
    {
      header: 'Company',
      accessor: (item: InventoryItem) =>
        companies.find((c) => c.id === item.companyId)?.name || '',
    },
    { header: 'Quantity', accessor: 'quantity' },
    {
      header: 'Unit Price',
      accessor: (item: InventoryItem) =>
        `$${item.unitPrice.toFixed(2)}`,
    },
    {
      header: 'ICMS Rate',
      accessor: (item: InventoryItem) =>
        `${(item.icmsRate * 100).toFixed(1)}%`,
    },
    {
      header: 'Total Value',
      accessor: (item: InventoryItem) =>
        `$${(item.quantity * item.unitPrice).toFixed(2)}`,
    },
    {
      header: 'Actions',
      accessor: (item: InventoryItem) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditItem(item)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteItem(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      <Table columns={columns} data={filteredItems} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <select
              value={formData.productId}
              onChange={(e) =>
                setFormData({ ...formData, productId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <select
              value={formData.companyId}
              onChange={(e) =>
                setFormData({ ...formData, companyId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a company</option>
              {accessibleCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit Price (without ICMS)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unitPrice: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ICMS Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.icmsRate * 100}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  icmsRate: parseFloat(e.target.value) / 100 || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Inventory;