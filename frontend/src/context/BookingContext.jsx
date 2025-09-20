
import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_CINEMA':
      return { ...state, selectedCinema: action.payload, selectedShow: null, selectedSeats: [] };
    case 'SET_SELECTED_SHOW':
      return { ...state, selectedShow: action.payload, selectedSeats: [] };
    case 'SET_SELECTED_SEATS':
      return { ...state, selectedSeats: action.payload };
    case 'ADD_SEAT':
      if (state.selectedSeats.length >= 6) return state;
      return { 
        ...state, 
        selectedSeats: [...state.selectedSeats, action.payload] 
      };
    case 'REMOVE_SEAT':
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(seat => seat !== action.payload)
      };
    case 'CLEAR_BOOKING':
      return {
        selectedCinema: null,
        selectedShow: null,
        selectedSeats: []
      };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, {
    selectedCinema: null,
    selectedShow: null,
    selectedSeats: []
  });

  const value = {
    ...state,
    setSelectedCinema: (cinema) => dispatch({ type: 'SET_SELECTED_CINEMA', payload: cinema }),
    setSelectedShow: (show) => dispatch({ type: 'SET_SELECTED_SHOW', payload: show }),
    setSelectedSeats: (seats) => dispatch({ type: 'SET_SELECTED_SEATS', payload: seats }),
    addSeat: (seat) => dispatch({ type: 'ADD_SEAT', payload: seat }),
    removeSeat: (seat) => dispatch({ type: 'REMOVE_SEAT', payload: seat }),
    clearBooking: () => dispatch({ type: 'CLEAR_BOOKING' })
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};