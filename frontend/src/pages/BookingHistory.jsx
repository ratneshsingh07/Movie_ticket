import { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { bookingAPI } from '../utils/api';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import BookingCard from '../components/Booking/BookingCard';
import toast from 'react-hot-toast';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await bookingAPI.cancel(bookingId);
      
      // Update booking status in local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Bookings Found
        </h2>
        <p className="text-gray-500 mb-4">
          You haven't made any movie bookings yet.
        </p>
        <a href="/cinemas" className="btn-primary">
          Book Your First Movie
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600">
          View and manage your movie ticket bookings
        </p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingCard 
            key={booking._id}
            booking={booking}
            onCancel={handleCancelBooking}
            cancelLoading={cancellingId}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;