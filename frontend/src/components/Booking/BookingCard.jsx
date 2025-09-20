import { Calendar, MapPin, Clock, Users, Receipt, XCircle } from 'lucide-react';
import { formatDateTime, formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../Layout/LoadingSpinner';

const BookingCard = ({ 
  booking, 
  onCancel, 
  cancelLoading 
}) => {
  const canCancel = () => {
    if (booking.status !== 'confirmed') return false;
    
    const showTime = new Date(booking.show.showTime);
    const now = new Date();
    const timeDiff = showTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return hoursDiff > 2;
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
        booking.status === 'cancelled' ? 'opacity-75' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={booking.show.movie.poster}
              alt={booking.show.movie.title}
              className="w-16 h-24 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/64x96?text=Movie';
              }}
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {booking.show.movie.title}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{booking.show.cinema.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Screen {booking.show.screen.screenNumber}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatDateTime(booking.show.showTime)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'confirmed' 
                ? 'bg-success-100 text-success-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Booking ID: #{booking._id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Users className="w-4 h-4 mr-1" />
              <span>Seats</span>
            </div>
            <div className="font-medium">{booking.seats.join(', ')}</div>
          </div>

          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Receipt className="w-4 h-4 mr-1" />
              <span>Total Amount</span>
            </div>
            <div className="font-medium text-primary-600">
              {formatCurrency(booking.totalAmount)}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            {canCancel() && (
              <button
                onClick={() => onCancel(booking._id)}
                disabled={cancelLoading === booking._id}
                className="btn-danger text-sm px-4 py-2 disabled:opacity-50"
              >
                {cancelLoading === booking._id ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" />
                    <span className="ml-1">Cancelling...</span>
                  </div>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {booking.status === 'cancelled' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-red-800 text-sm">
              <XCircle className="w-4 h-4 mr-2" />
              <span>This booking has been cancelled</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;