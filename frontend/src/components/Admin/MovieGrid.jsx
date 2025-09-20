import { Edit, Trash2, Film, Star, Clock } from 'lucide-react';

const MovieGrid = ({ movies, onEdit, onDelete }) => {
  if (movies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Movies Found</h3>
        <p className="text-gray-500">Add your first movie to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {movies.map((movie) => (
        <div key={movie._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Movie+Poster';
              }}
            />
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={() => onEdit(movie)}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                title="Edit movie"
              >
                <Edit className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => onDelete(movie._id)}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                title="Delete movie"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {movie.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {movie.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
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
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.slice(0, 3).map((g, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {g}
                </span>
              ))}
              {movie.genre.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  +{movie.genre.length - 3} more
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              Released: {new Date(movie.releaseDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
