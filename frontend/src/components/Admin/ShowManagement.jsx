import { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Film } from 'lucide-react';

const ShowManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const mockShows = [
    {
      id: 1,
      movie: 'Avengers: Endgame',
      cinema: 'PVR Cinemas',
      screen: 'Screen 1',
      time: '10:00 AM',
      price: 250,
      bookedSeats: 45,
      totalSeats: 100
    },
    {
      id: 2,
      movie: 'The Dark Knight',
      cinema: 'INOX Movies',
      screen: 'Screen 2',
      time: '2:30 PM',
      price: 300,
      bookedSeats: 67,
      totalSeats: 100
    },
    {
      id: 3,
      movie: 'Inception',
      cinema: 'Cinepolis',
      screen: 'Screen 1',
      time: '7:00 PM',
      price: 350,
      bookedSeats: 89,
      totalSeats: 100
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Show Management</h2>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Show
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input max-w-xs"
          />
          <span className="text-sm text-gray-600">
            Showing {mockShows.length} shows
          </span>
        </div>
      </div>

      {/* Shows List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Movie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cinema & Screen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occupancy
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockShows.map((show) => (
              <tr key={show.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Film className="w-8 h-8 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {show.movie}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{show.cinema}</div>
                  <div className="text-sm text-gray-500">{show.screen}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    {show.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{show.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900">
                      {show.bookedSeats}/{show.totalSeats}
                    </div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(show.bookedSeats / show.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">
                    View Details
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Cancel Show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowManagement;