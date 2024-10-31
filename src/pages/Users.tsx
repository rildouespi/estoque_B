import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useCompanyStore } from '../store/companyStore';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { User, UserRole } from '../types';

function Users() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const { companies } = useCompanyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'regular_user' as UserRole,
    companyIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'regular_user',
      companyIds: [],
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      companyIds: user.companyIds || [],
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Companies',
      accessor: (user: User) =>
        user.companyIds
          ?.map(
            (id) => companies.find((company) => company.id === id)?.name || ''
          )
          .join(', ') || '-',
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(user)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteUser(user.id)}
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
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <Table columns={columns} data={users} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
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
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as UserRole,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="regular_user">Regular User</option>
              <option value="company_operator">Company Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formData.role === 'company_operator' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Companies
              </label>
              <select
                multiple
                value={formData.companyIds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    companyIds: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
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
              {editingUser ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Users;