import React from 'react';

const BookingConfirmation = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-gray-600">
          Your movie tickets have been successfully booked.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
          <p className="text-blue-100">Booking ID: #BK123456</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Movie Information</h3>
              <p className="text-gray-600">Avengers: Endgame</p>
              <p className="text-sm text-gray-500">PVR Cinemas - Screen 1</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Show Details</h3>
              <p className="text-gray-600">Today, 7:00 PM</p>
              <p className="text-sm text-gray-500">Seats: A1, A2</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Amount</h3>
              <p className="text-xl font-bold text-blue-600">₹500</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/bookings"
          className="flex-1 text-center py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          View All Bookings
        </a>
        <a
          href="/cinemas"
          className="flex-1 text-center py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Another Movie
        </a>
      </div>
    </div>
  );
};

export default BookingConfirmation;