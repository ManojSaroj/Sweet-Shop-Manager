import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

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

  const handlePurchase = async (sweetId, quantity = 1) => {
    try {
      await apiClient.post(`/sweets/${sweetId}/purchase`, { quantity });
      toast.success('Purchase successful!');
      fetchSweets(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    }
  };

  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || sweet.category === categoryFilter;
    const matchesMinPrice = !priceRange.min || sweet.price >= parseFloat(priceRange.min);
    const matchesMaxPrice = !priceRange.max || sweet.price <= parseFloat(priceRange.max);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const categories = [...new Set(sweets.map(sweet => sweet.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sweet-600"></div>
      </div>
    );
  }

  const getSweetIcon = (category) => {
    const icons = {
      'Chocolate': '🍫',
      'Gummy': '🍬',
      'Hard Candy': '🍭',
      'Caramel': '🍯',
      'Cake': '🍰',
      'Cookie': '🍪',
      'Cupcake': '🧁',
      'Donut': '🍩',
      'Indian Sweets': '🥮',
      'Macarons': '🍪',
      'Tarts': '🥧',
      'Fudge': '🍫',
      'Desserts': '🍮'
    };
    return icons[category] || '🍭';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce-slow">🍭</div>
        <h1 className="text-5xl font-display font-bold gradient-text mb-2">
          Sweet Delights
        </h1>
        <p className="text-xl text-gray-600">
          Discover our amazing collection of {filteredSweets.length} delicious treats!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl mb-2">🍭</div>
          <h3 className="text-2xl font-bold text-gray-800">{sweets.length}</h3>
          <p className="text-gray-600">Total Sweets</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-2">📦</div>
          <h3 className="text-2xl font-bold text-gray-800">{sweets.reduce((sum, sweet) => sum + sweet.quantity, 0)}</h3>
          <p className="text-gray-600">Items in Stock</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-2">🏷️</div>
          <h3 className="text-2xl font-bold text-gray-800">{categories.length}</h3>
          <p className="text-gray-600">Categories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          Filter & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Sweets
            </label>
            <input
              type="text"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Min Price (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="input-field"
              step="1"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Price (₹)
            </label>
            <input
              type="number"
              placeholder="1000"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="input-field"
              step="1"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Sweets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSweets.map(sweet => (
          <div key={sweet.id} className="sweet-card group">
            <div className="text-center">
              <div className="sweet-icon group-hover:animate-wiggle">
                {getSweetIcon(sweet.category)}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sweet-600 transition-colors">
                {sweet.name}
              </h3>
              
              <div className="inline-block bg-sweet-100 text-sweet-800 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                {sweet.category}
              </div>
              
              <div className="price-tag mb-3">
                ₹{sweet.price.toFixed(0)}
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-sm text-gray-500">Stock:</span>
                <span className={`font-semibold ${sweet.quantity > 10 ? 'text-green-600' : sweet.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {sweet.quantity} {sweet.quantity === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              <button
                onClick={() => handlePurchase(sweet.id)}
                disabled={sweet.quantity === 0}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  sweet.quantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary hover:scale-105'
                }`}
                title={sweet.quantity === 0 ? 'Out of stock' : 'Purchase now'}
              >
                {sweet.quantity === 0 ? (
                  <>
                    <span>❌</span>
                    <span>Out of Stock</span>
                  </>
                ) : (
                  <>
                    <span>🛍️</span>
                    <span>Purchase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSweets.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No sweets found</h3>
          <p className="text-gray-600 text-lg">Try adjusting your search criteria to find more delicious treats!</p>
        </div>
      )}
    </div>
  );
}
