import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../Layout/LoadingSpinner';

const BookingSummary = ({ 
  selectedSeats, 
  show, 
  onConfirmBooking, 
  loading 
}) => {
  if (selectedSeats.length === 0) return null;

  const totalAmount = selectedSeats.length * show.price;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Summary
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Selected Seats:</span>
          <span className="font-medium">{selectedSeats.join(', ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Price per seat:</span>
          <span className="font-medium">{formatCurrency(show.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Number of seats:</span>
          <span className="font-medium">{selectedSeats.length}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-bold text-primary-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirmBooking}
        disabled={loading}
        className="w-full btn-primary mt-6 py-3 text-lg font-semibold disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="small" />
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </div>
  );
};

export default BookingSummary;