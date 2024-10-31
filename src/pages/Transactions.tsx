import React, { useState } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useProductStore } from '../store/productStore';
import { useCompanyStore } from '../store/companyStore';
import { useAuthStore } from '../store/authStore';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';
import { Transaction, InventoryItem } from '../types';
import { format } from 'date-fns';

function Transactions() {
  const { user } = useAuthStore();
  const { transactions, addTransaction } = useTransactionStore();
  const { items, updateItem } = useInventoryStore();
  const { products } = useProductStore();
  const { companies } = useCompanyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    itemId: '',
    type: 'out' as const,
    quantity: 0,
    salePrice: 0,
  });

  // Filter items based on user's company access
  const accessibleItems = user?.role === 'admin'
    ? items
    : items.filter(item => 
        user?.companyIds?.includes(item.companyId)
      );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newQuantity =
      formData.type === 'in'
        ? selectedItem.quantity + formData.quantity
        : selectedItem.quantity - formData.quantity;

    // Update inventory
    updateItem(selectedItem.id, { quantity: newQuantity });

    // Calculate profit for outbound transactions
    const profit =
      formData.type === 'out'
        ? (formData.salePrice - selectedItem.unitPrice) * formData.quantity
        : undefined;

    // Add transaction
    addTransaction({
      itemId: selectedItem.id,
      type: formData.type,
      quantity: formData.quantity,
      unitPrice: selectedItem.unitPrice,
      icmsRate: selectedItem.icmsRate,
      salePrice: formData.type === 'out' ? formData.salePrice : undefined,
      profit,
      date: new Date().toISOString(),
    });

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormData({
      itemId: '',
      type: 'out',
      quantity: 0,
      salePrice: 0,
    });
  };

  const columns = [
    {
      header: 'Date',
      accessor: (transaction: Transaction) =>
        format(new Date(transaction.date), 'MM/dd/yyyy HH:mm'),
    },
    {
      header: 'Product',
      accessor: (transaction: Transaction) => {
        const item = items.find((i) => i.id === transaction.itemId);
        const product = products.find((p) => p.id === item?.productId);
        return product?.name || '';
      },
    },
    {
      header: 'Company',
      accessor: (transaction: Transaction) => {
        const item = items.find((i) => i.id === transaction.itemId);
        const company = companies.find((c) => c.id === item?.companyId);
        return company?.name || '';
      },
    },
    {
      header: 'Type',
      accessor: (transaction: Transaction) =>
        transaction.type === 'in' ? 'Stock In' : 'Stock Out',
    },
    { header: 'Quantity', accessor: 'quantity' },
    {
      header: 'Unit Price',
      accessor: (transaction: Transaction) =>
        `$${transaction.unitPrice.toFixed(2)}`,
    },
    {
      header: 'Sale Price',
      accessor: (transaction: Transaction) =>
        transaction.salePrice ? `$${transaction.salePrice.toFixed(2)}` : '-',
    },
    {
      header: 'Profit',
      accessor: (transaction: Transaction) =>
        transaction.profit ? `$${transaction.profit.toFixed(2)}` : '-',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </button>
      </div>

      <Table columns={columns} data={transactions} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="New Transaction"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item
            </label>
            <select
              value={formData.itemId}
              onChange={(e) => {
                const item = items.find((i) => i.id === e.target.value);
                setSelectedItem(item || null);
                setFormData({ ...formData, itemId: e.target.value });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select an item</option>
              {accessibleItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                const company = companies.find((c) => c.id === item.companyId);
                return (
                  <option key={item.id} value={item.id}>
                    {product?.name} - {company?.name} (Stock: {item.quantity})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'in' | 'out',
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={
                formData.type === 'out' && selectedItem
                  ? selectedItem.quantity
                  : undefined
              }
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
          {formData.type === 'out' && selectedItem && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Price (without ICMS)
                </label>
                <input
                  type="text"
                  value={selectedItem.unitPrice.toFixed(2)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ICMS Rate
                </label>
                <input
                  type="text"
                  value={`${(selectedItem.icmsRate * 100).toFixed(1)}%`}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sale Price (per unit)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {formData.salePrice > 0 && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Transaction Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      Unit Price with ICMS: $
                      {(
                        selectedItem.unitPrice *
                        (1 + selectedItem.icmsRate)
                      ).toFixed(2)}
                    </p>
                    <p>
                      Total Sale Value: $
                      {(formData.salePrice * formData.quantity).toFixed(2)}
                    </p>
                    <p>
                      Estimated Profit: $
                      {(
                        (formData.salePrice - selectedItem.unitPrice) *
                        formData.quantity
                      ).toFixed(2)}
                    </p>
                    <p>
                      Profit Margin:{' '}
                      {(
                        ((formData.salePrice - selectedItem.unitPrice) /
                          selectedItem.unitPrice) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
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
              Create Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Transactions;