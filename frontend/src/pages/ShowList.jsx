import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Film } from 'lucide-react';
import { showAPI, cinemaAPI } from '../utils/api';
import { useBooking } from '../context/BookingContext';
import { getNextSevenDays } from '../utils/helpers';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import MovieCard from '../components/Movie/MovieCard';
import toast from 'react-hot-toast';

const ShowList = () => {
  const { cinemaId } = useParams();
  const [cinema, setCinema] = useState(null);
  const [movieShows, setMovieShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  
  const { setSelectedCinema, setSelectedShow } = useBooking();

  useEffect(() => {
    fetchCinemaAndShows();
  }, [cinemaId, selectedDate]);

  const fetchCinemaAndShows = async () => {
    try {
      setLoading(true);
      
      // Fetch cinema details
      const cinemaResponse = await cinemaAPI.getById(cinemaId);
      const cinemaData = cinemaResponse.data.data.cinema;
      setCinema(cinemaData);
      setSelectedCinema(cinemaData);

      // Fetch shows for selected date
      const showsResponse = await showAPI.getByCinema(cinemaId, selectedDate);
      setMovieShows(showsResponse.data.data.movieShows);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load shows');
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!cinema) {
    return (
      <div className="text-center py-16">
        <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Cinema Not Found
        </h2>
        <Link to="/cinemas" className="btn-primary">
          Back to Cinemas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cinema Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {cinema.name}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{cinema.location}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{cinema.screens?.length || 0} screens</span>
              <span>•</span>
              <span>{(cinema.screens?.length || 0) * 100} total seats</span>
            </div>
          </div>
          <Link
            to="/cinemas"
            className="btn-secondary"
          >
            Change Cinema
          </Link>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Select Date
        </h2>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {getNextSevenDays().map((date) => (
            <button
              key={date.value}
              onClick={() => setSelectedDate(date.value)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedDate === date.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-center">
                <div>{date.label}</div>
                {date.isToday && (
                  <div className="text-xs opacity-75">Today</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Movies and Shows */}
      {movieShows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Shows Available
          </h2>
          <p className="text-gray-500 mb-4">
            No shows scheduled for {new Date(selectedDate).toLocaleDateString()}
          </p>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="btn-primary"
          >
            View Today's Shows
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {movieShows.map((movieShow) => (
            <MovieCard 
              key={movieShow.movie._id} 
              movieShow={movieShow} 
              onShowSelect={handleShowSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowList;