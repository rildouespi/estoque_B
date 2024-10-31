import React, { useState } from 'react';
import { useCompanyStore } from '../store/companyStore';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Company } from '../types';

function Companies() {
  const { companies, addCompany, updateCompany, deleteCompany } =
    useCompanyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      updateCompany(editingCompany.id, formData);
    } else {
      addCompany(formData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    setFormData({ name: '', cnpj: '' });
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      cnpj: company.cnpj,
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'CNPJ', accessor: 'cnpj' },
    {
      header: 'Actions',
      accessor: (company: Company) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditCompany(company)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteCompany(company.id)}
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
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </button>
      </div>

      <Table columns={columns} data={companies} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCompany ? 'Edit Company' : 'Add Company'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              CNPJ
            </label>
            <input
              type="text"
              value={formData.cnpj}
              onChange={(e) =>
                setFormData({ ...formData, cnpj: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="XX.XXX.XXX/XXXX-XX"
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
              {editingCompany ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Companies;