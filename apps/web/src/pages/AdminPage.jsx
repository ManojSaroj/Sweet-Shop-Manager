import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await apiClient.get('/sweets');
      setSweets(response.data);
    } catch (error) {
      toast.error('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      if (editingSweet) {
        await apiClient.put(`/sweets/${editingSweet.id}`, data);
        toast.success('Sweet updated successfully!');
      } else {
        await apiClient.post('/sweets', data);
        toast.success('Sweet created successfully!');
      }

      setShowAddForm(false);
      setEditingSweet(null);
      setFormData({ name: '', category: '', price: '', quantity: '' });
      fetchSweets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
    });
    setShowAddForm(true);
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await apiClient.delete(`/sweets/${sweetId}`);
      toast.success('Sweet deleted successfully!');
      fetchSweets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleRestock = async (sweetId, quantity) => {
    try {
      await apiClient.post(`/sweets/${sweetId}/restock`, { quantity });
      toast.success('Restock successful!');
      fetchSweets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Restock failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sweet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce-slow">⚙️</div>
        <h1 className="text-5xl font-display font-bold gradient-text mb-2">
          Admin Panel
        </h1>
        <p className="text-xl text-gray-600">
          Manage your sweet inventory and delight your customers
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl">🍭</div>
          <h2 className="text-2xl font-semibold text-gray-800">Sweet Management</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <span>✨</span>
          <span>Add New Sweet</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">{editingSweet ? '✏️' : '✨'}</div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sweet Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter sweet name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Indian Sweets">Indian Sweets</option>
                  <option value="Gummy">Gummy</option>
                  <option value="Hard Candy">Hard Candy</option>
                  <option value="Caramel">Caramel</option>
                  <option value="Cake">Cake</option>
                  <option value="Cookie">Cookie</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="input-field"
                  placeholder="Enter price in rupees"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="input-field"
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <span>{editingSweet ? '💾' : '✨'}</span>
                <span>{editingSweet ? 'Update Sweet' : 'Create Sweet'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingSweet(null);
                  setFormData({ name: '', category: '', price: '', quantity: '' });
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>❌</span>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sweets Table */}
      <div className="card">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📊</span>
            Inventory Overview
          </h3>
          <p className="text-gray-600">Manage your sweet collection</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-sweet-50 to-candy-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  🍭 Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  🏷️ Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  💰 Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  📦 Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ⚙️ Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sweets.map(sweet => (
                <tr key={sweet.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sweet.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sweet.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{sweet.price.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sweet.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="btn-secondary text-xs px-3 py-1 flex items-center space-x-1"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          const quantity = prompt('Enter restock quantity:', '10');
                          if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
                            handleRestock(sweet.id, parseInt(quantity));
                          }
                        }}
                        className="btn-success text-xs px-3 py-1 flex items-center space-x-1"
                      >
                        <span>📦</span>
                        <span>Restock</span>
                      </button>
                      <button
                        onClick={() => handleDelete(sweet.id)}
                        className="btn-danger text-xs px-3 py-1 flex items-center space-x-1"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
