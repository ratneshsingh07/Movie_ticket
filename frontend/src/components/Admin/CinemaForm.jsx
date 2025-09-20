
import { useState, useEffect } from 'react';
import { cinemaAPI } from '../../utils/api';
import LoadingSpinner from '../Layout/LoadingSpinner';
import toast from 'react-hot-toast';

const CinemaForm = ({ cinema, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    screenCount: 3
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cinema) {
      setFormData({
        name: cinema.name || '',
        location: cinema.location || '',
        screenCount: cinema.screens?.length || 3
      });
    }
  }, [cinema]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (cinema) {
        await cinemaAPI.update(cinema._id, {
          name: formData.name,
          location: formData.location
        });
        toast.success('Cinema updated successfully');
      } else {
        await cinemaAPI.create(formData);
        toast.success('Cinema created successfully');
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving cinema:', error);
      toast.error('Failed to save cinema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {cinema ? 'Edit Cinema' : 'Add Cinema'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cinema Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {!cinema && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Screens
              </label>
              <input
                type="number"
                name="screenCount"
                value={formData.screenCount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Saving...</span>
                </div>
              ) : (
                cinema ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CinemaForm;