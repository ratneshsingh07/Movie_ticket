import { Link } from 'react-router-dom';
import { MapPin, Film } from 'lucide-react';

const CinemaCard = ({ cinema }) => {
  return (
    <div className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {cinema.name}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{cinema.location}</span>
          </div>
        </div>
        <div className="bg-primary-100 p-2 rounded-lg">
          <Film className="w-6 h-6 text-primary-600" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Screens:</span>
          <span className="font-medium text-gray-900">
            {cinema.screens?.length || 0} screens
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Capacity:</span>
          <span className="font-medium text-gray-900">
            {(cinema.screens?.length || 0) * 100} seats
          </span>
        </div>
      </div>

      <Link
        to={`/cinemas/${cinema._id}/shows`}
        className="w-full btn-primary text-center"
      >
        View Shows
      </Link>
    </div>
  );
};

export default CinemaCard;