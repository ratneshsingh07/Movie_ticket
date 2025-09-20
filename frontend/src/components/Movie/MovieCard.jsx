import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { formatTime, formatCurrency } from '../../utils/helpers';

const MovieCard = ({ movieShow, onShowSelect }) => {
  const { movie, shows } = movieShow;

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-32 h-48 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x300?text=Movie+Poster';
              }}
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {movie.title}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{movie.duration} min</span>
              </div>
              {movie.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>{movie.rating}/10</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {movie.genre.map((g, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {movie.description}
            </p>

            {/* Show Times */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Show Times ({formatCurrency(shows[0]?.price || 0)} per seat)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {shows.map((show) => (
                  <Link
                    key={show._id}
                    to={`/shows/${show._id}/seats`}
                    onClick={() => onShowSelect && onShowSelect(show)}
                    className="btn-secondary text-center py-2 text-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 transition-colors"
                  >
                    {formatTime(show.showTime)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;