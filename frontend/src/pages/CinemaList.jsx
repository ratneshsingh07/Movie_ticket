import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { cinemaAPI } from '../utils/api';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import CinemaCard from '../components/Cinema/CinemaCard';
import toast from 'react-hot-toast';

const CinemaList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await cinemaAPI.getAll();
      setCinemas(response.data.data.cinemas);
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      toast.error('Failed to load cinemas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (cinemas.length === 0) {
    return (
      <div className="text-center py-16">
        <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Cinemas Available
        </h2>
        <p className="text-gray-500">
          Check back later for updated cinema listings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choose Your Cinema
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our premium cinema locations across the city. Each cinema offers 
          state-of-the-art facilities and comfortable seating for the perfect movie experience.
        </p>
      </div>

      {/* Cinema Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cinemas.map((cinema) => (
          <CinemaCard key={cinema._id} cinema={cinema} />
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 rounded-2xl p-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          What Makes Our Cinemas Special
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🎬',
              title: 'Premium Screens',
              description: 'High-definition projection with crystal clear sound systems'
            },
            {
              icon: '🪑',
              title: 'Comfortable Seating',
              description: 'Luxurious recliner seats with ample legroom and cup holders'
            },
            {
              icon: '🍿',
              title: 'Concessions',
              description: 'Fresh popcorn, beverages, and snacks available at all locations'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CinemaList;
