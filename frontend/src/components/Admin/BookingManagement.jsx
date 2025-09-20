import { useState } from 'react';
import { Users, Search, Filter, Download } from 'lucide-react';

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockBookings = [
    {
      id: 'BK001',
      user: 'John Doe',
      email: 'john@example.com',
      movie: 'Avengers: Endgame',
      cinema: 'PVR Cinemas',
      showTime: '2024-01-15 10:00',
      seats: ['A1', 'A2'],
      amount: 500,
      status: 'confirmed',
      bookingDate: '2024-01-10'
    },
    {
      id: 'BK002',
      user: 'Jane Smith',
      email: 'jane@example.com',
      movie: 'The Dark Knight',
      cinema: 'INOX Movies',
      showTime: '2024-01-15 14:30',
      seats: ['B5', 'B6', 'B7'],
      amount: 900,
      status: 'confirmed',
      bookingDate: '2024-01-12'
    },
    {
      id: 'BK003',
      user: 'Mike Johnson',
      email: 'mike@example.com',
      movie: 'Inception',
      cinema: 'Cinepolis',
      showTime: '2024-01-16 19:00',
      seats: ['C10'],
      amount: 350,
      status: 'cancelled',
      bookingDate: '2024-01-14'
    }
  ];

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Booking Management</h2>
        <button className="btn-secondary">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by user, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input min-w-0"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Show Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seats & Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {booking.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.movie}</div>
                  <div className="text-sm text-gray-500">{booking.cinema}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(booking.showTime).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Seats: {booking.seats.join(', ')}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{booking.amount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">
                    View Details
                  </button>
                  {booking.status === 'confirmed' && (
                    <button className="text-red-600 hover:text-red-900">
                      Cancel Booking
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search filters.'
              : 'Bookings will appear here once customers start making reservations.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;