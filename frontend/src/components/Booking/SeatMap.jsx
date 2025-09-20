import { Monitor } from 'lucide-react';
import { getSeatStatus } from '../../utils/helpers';

const SeatMap = ({ 
  show, 
  bookedSeats, 
  blockedSeats, 
  selectedSeats, 
  onSeatClick, 
  currentUserId 
}) => {
  const { rows, columns } = show.screen.seatLayout;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center mb-8">
        <div className="bg-gray-800 text-white py-3 px-8 rounded-t-lg inline-block">
          <Monitor className="w-6 h-6 inline mr-2" />
          SCREEN
        </div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center mb-2">
              <div className="w-8 text-center text-sm font-medium text-gray-600 mr-4">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              
              <div className="flex space-x-2">
                {Array.from({ length: columns }, (_, colIndex) => {
                  const seatId = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
                  const status = getSeatStatus(
                    seatId, 
                    bookedSeats, 
                    blockedSeats, 
                    selectedSeats, 
                    currentUserId
                  );

                  return (
                    <button
                      key={seatId}
                      onClick={() => onSeatClick(seatId)}
                      disabled={status === 'booked' || (status === 'blocked' && !selectedSeats.includes(seatId))}
                      className={`seat-${status}`}
                      title={`Seat ${seatId} - ${status}`}
                    >
                      {colIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-8 space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="seat-available"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="seat-selected"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="seat-booked"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="seat-blocked"></div>
          <span>Blocked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;