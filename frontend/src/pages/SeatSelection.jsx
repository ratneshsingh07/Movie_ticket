import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { showAPI, bookingAPI } from '../utils/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import SeatMap from '../components/Booking/SeatMap';
import BookingSummary from '../components/Booking/BookingSummary';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedShow, 
    selectedSeats, 
    setSelectedSeats, 
    setSelectedShow 
  } = useBooking();

  const [show, setShow] = useState(selectedShow);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchShow();
    initializeSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [showId]);

  const initializeSocket = () => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join-show', showId);
    });

    newSocket.on('seats-blocked', (data) => {
      if (data.userId !== user.id) {
        setBlockedSeats(prev => [
          ...prev.filter(blocked => !data.seats.includes(blocked.seatId)),
          ...data.seats.map(seatId => ({ seatId, userId: data.userId }))
        ]);
      }
    });

    newSocket.on('seats-unblocked', (data) => {
      if (data.userId !== user.id) {
        setBlockedSeats(prev => 
          prev.filter(blocked => !data.seats.includes(blocked.seatId))
        );
      }
    });

    newSocket.on('booking-confirmed', (data) => {
      if (data.userId !== user.id) {
        setBookedSeats(prev => [...prev, ...data.seats]);
        setBlockedSeats(prev => 
          prev.filter(blocked => !data.seats.includes(blocked.seatId))
        );
      }
    });

    setSocket(newSocket);
  };

  const fetchShow = async () => {
    try {
      const response = await showAPI.getById(showId);
      const showData = response.data.data.show;
      
      setShow(showData);
      setSelectedShow(showData);
      setBookedSeats(showData.bookedSeats || []);
      setBlockedSeats(showData.blockedSeats || []);
      
    } catch (error) {
      console.error('Error fetching show:', error);
      toast.error('Failed to load show details');
      navigate('/cinemas');
    } finally {
      setLoading(false);
    }
  };

  const blockSeatsOnServer = useCallback(async (seatsToBlock) => {
    try {
      await showAPI.blockSeats(showId, seatsToBlock);
    } catch (error) {
      console.error('Error blocking seats:', error);
    }
  }, [showId]);

  const unblockSeatsOnServer = useCallback(async () => {
    try {
      await showAPI.unblockSeats(showId);
    } catch (error) {
      console.error('Error unblocking seats:', error);
    }
  }, [showId]);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    
    const blockedSeat = blockedSeats.find(blocked => blocked.seatId === seatId);
    if (blockedSeat && blockedSeat.userId !== user.id) return;
    
    const newSelectedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter(seat => seat !== seatId)
      : selectedSeats.length < 6 
        ? [...selectedSeats, seatId]
        : selectedSeats;
    
    if (selectedSeats.length >= 6 && !selectedSeats.includes(seatId)) {
      toast.error('You can select maximum 6 seats');
      return;
    }
    
    setSelectedSeats(newSelectedSeats);
    
    // Update server
    if (newSelectedSeats.length > 0) {
      blockSeatsOnServer(newSelectedSeats);
    } else {
      unblockSeatsOnServer();
    }
    
    // Emit socket events
    if (socket) {
      if (selectedSeats.includes(seatId)) {
        socket.emit('seat-deselected', { showId, seatId, userId: user.id });
      } else {
        socket.emit('seat-selected', { showId, seatId, userId: user.id });
      }
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    try {
      setBookingLoading(true);
      
      const response = await bookingAPI.create({
        showId: show._id,
        seats: selectedSeats
      });

      if (response.data.success) {
        // Emit booking confirmation
        if (socket) {
          socket.emit('booking-confirmed', {
            showId: show._id,
            seats: selectedSeats,
            userId: user.id
          });
        }
        
        toast.success('Booking confirmed successfully!');
        navigate('/booking/confirmation', { 
          state: { booking: response.data.data.booking } 
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Show Not Found
        </h2>
        <button
          onClick={() => navigate('/cinemas')}
          className="btn-primary"
        >
          Back to Cinemas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Shows</span>
        </button>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">Selected Seats: {selectedSeats.length}/6</div>
        </div>
      </div>

      {/* Show Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start space-x-4">
          <img
            src={show.movie.poster}
            alt={show.movie.title}
            className="w-16 h-24 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/64x96?text=Movie';
            }}
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {show.movie.title}
            </h1>
            <div className="space-y-1 text-sm text-gray-600">
              <div>{show.cinema.name} - Screen {show.screen.screenNumber}</div>
              <div>{new Date(show.showTime).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <SeatMap 
        show={show}
        bookedSeats={bookedSeats}
        blockedSeats={blockedSeats}
        selectedSeats={selectedSeats}
        onSeatClick={handleSeatClick}
        currentUserId={user.id}
      />

      {/* Booking Summary */}
      <BookingSummary 
        selectedSeats={selectedSeats}
        show={show}
        onConfirmBooking={handleBooking}
        loading={bookingLoading}
      />
    </div>
  );
};

export default SeatSelection;