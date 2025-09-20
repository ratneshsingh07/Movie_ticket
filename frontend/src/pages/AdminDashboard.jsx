// src/pages/AdminDashboard.jsx - Complete Dark Theme Version with Black Text
import { useState, useEffect } from 'react';
import { 
  Film, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Settings,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  DollarSign,
  Eye,
  ArrowUp,
  ArrowDown,
  Star,
  Clock,
  Zap
} from 'lucide-react';
import { 
  cinemaAPI, 
  movieAPI 
} from '../utils/api';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import AdminStats from '../components/Admin/AdminStats';
import CinemaTable from '../components/Admin/CinemaTable';
import MovieGrid from '../components/Admin/MovieGrid';
import ShowManagement from '../components/Admin/ShowManagement';
import BookingManagement from '../components/Admin/BookingManagement';
import CinemaForm from '../components/Admin/CinemaForm';
import MovieForm from '../components/Admin/MovieForm';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCinemas: 0,
    totalMovies: 0,
    totalShows: 0,
    totalBookings: 0,
    revenue: 0,
    activeUsers: 0
  });

  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [cinemasRes, moviesRes] = await Promise.all([
        cinemaAPI.getAll(),
        movieAPI.getAll()
      ]);

      setCinemas(cinemasRes.data.data.cinemas);
      setMovies(moviesRes.data.data.movies);
      
      setStats({
        totalCinemas: cinemasRes.data.data.cinemas.length,
        totalMovies: moviesRes.data.data.movies.length,
        totalShows: 47,
        totalBookings: 1,
        revenue: 125000,
        activeUsers: 89
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      if (type === 'cinema') {
        await cinemaAPI.delete(id);
        setCinemas(cinemas.filter(cinema => cinema._id !== id));
        setStats(prev => ({ ...prev, totalCinemas: prev.totalCinemas - 1 }));
      } else if (type === 'movie') {
        await movieAPI.delete(id);
        setMovies(movies.filter(movie => movie._id !== id));
        setStats(prev => ({ ...prev, totalMovies: prev.totalMovies - 1 }));
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const tabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: BarChart3,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'cinemas', 
      name: 'Cinemas', 
      icon: MapPin,
      gradient: 'from-green-500 to-teal-600'
    },
    { 
      id: 'movies', 
      name: 'Movies', 
      icon: Film,
      gradient: 'from-pink-500 to-rose-600'
    },
    { 
      id: 'shows', 
      name: 'Shows', 
      icon: Calendar,
      gradient: 'from-yellow-500 to-orange-600'
    },
    { 
      id: 'bookings', 
      name: 'Bookings', 
      icon: Users,
      gradient: 'from-indigo-500 to-blue-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-black">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Dark Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-black border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-black">🎬 Admin Dashboard</h1>
              <p className="text-black text-lg">Manage your movie booking empire</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 border border-gray-700">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-black">System Online</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-black">Today</div>
                <div className="font-semibold text-black">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-4">
        {/* Dark Navigation Tabs */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 py-6 px-4 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'relative'
                    : 'hover:bg-gray-800'
                }`}
              >
                {activeTab === tab.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl`}></div>
                )}
                <div className={`relative flex flex-col items-center space-y-2 ${
                  activeTab === tab.id ? 'text-black' : 'text-black'
                }`}>
                  <tab.icon className="w-6 h-6" />
                  <span className="font-medium text-sm">{tab.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === 'overview' && (
            <DarkOverviewTab 
              stats={stats} 
              onAddCinema={() => handleAddNew('cinema')}
              onAddMovie={() => handleAddNew('movie')}
            />
          )}
          {activeTab === 'cinemas' && (
            <DarkCinemasTab 
              cinemas={cinemas}
              onAdd={() => handleAddNew('cinema')}
              onEdit={(cinema) => handleEdit('cinema', cinema)}
              onDelete={(id) => handleDelete('cinema', id)}
            />
          )}
          {activeTab === 'movies' && (
            <DarkMoviesTab 
              movies={movies}
              onAdd={() => handleAddNew('movie')}
              onEdit={(movie) => handleEdit('movie', movie)}
              onDelete={(id) => handleDelete('movie', id)}
            />
          )}
          {activeTab === 'shows' && <ShowManagement />}
          {activeTab === 'bookings' && <BookingManagement />}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          {modalType === 'cinema' && (
            <CinemaForm 
              cinema={editingItem}
              onClose={() => setShowModal(false)}
              onSave={fetchDashboardData}
            />
          )}
          {modalType === 'movie' && (
            <MovieForm 
              movie={editingItem}
              onClose={() => setShowModal(false)}
              onSave={fetchDashboardData}
            />
          )}
        </>
      )}
    </div>
  );
};

// Dark Overview Tab
const DarkOverviewTab = ({ stats, onAddCinema, onAddMovie }) => {
  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-green-400 to-emerald-600',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Cinemas',
      value: stats.totalCinemas || 0,
      icon: MapPin,
      gradient: 'from-blue-400 to-indigo-600',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Movies',
      value: stats.totalMovies || 0,
      icon: Film,
      gradient: 'from-purple-400 to-pink-600',
      change: '+5.2%',
      changeType: 'positive'
    },
    {
      title: 'Active Shows',
      value: stats.totalShows || 0,
      icon: Calendar,
      gradient: 'from-yellow-400 to-orange-600',
      change: '+8.1%',
      changeType: 'positive'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings || 0,
      icon: Users,
      gradient: 'from-indigo-400 to-purple-600',
      change: '+15.3%',
      changeType: 'positive'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      icon: Activity,
      gradient: 'from-pink-400 to-rose-600',
      change: '+7.8%',
      changeType: 'positive'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'booking',
      message: 'New booking for Avengers: Endgame',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-green-400 bg-green-900/50'
    },
    {
      id: 2,
      type: 'movie',
      message: 'Movie "The Batman" was added',
      time: '1 hour ago',
      icon: Film,
      color: 'text-blue-400 bg-blue-900/50'
    },
    {
      id: 3,
      type: 'cinema',
      message: 'New cinema "Multiplex Plaza" added',
      time: '3 hours ago',
      icon: MapPin,
      color: 'text-purple-400 bg-purple-900/50'
    },
    {
      id: 4,
      type: 'show',
      message: 'Show schedule updated for weekend',
      time: '5 hours ago',
      icon: Calendar,
      color: 'text-orange-400 bg-orange-900/50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Dark Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="group relative overflow-hidden bg-gray-900 rounded-2xl shadow-2xl hover:shadow-black/50 transition-all duration-300 transform hover:-translate-y-2 border border-gray-800"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-black text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-black">{stat.value}</p>
                <p className="text-xs text-black mt-1">from last month</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Dark Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
            <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-indigo-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Add New Cinema',
                  description: 'Create a new cinema location with screens',
                  icon: MapPin,
                  gradient: 'from-blue-500 to-indigo-600',
                  action: onAddCinema
                },
                {
                  title: 'Add New Movie',
                  description: 'Add a movie to your catalog',
                  icon: Film,
                  gradient: 'from-purple-500 to-pink-600',
                  action: onAddMovie
                },
                {
                  title: 'Schedule Show',
                  description: 'Create new show timings',
                  icon: Calendar,
                  gradient: 'from-yellow-500 to-orange-600',
                  action: () => toast.info('Show scheduling coming soon!')
                },
                {
                  title: 'View Analytics',
                  description: 'Generate detailed reports',
                  icon: BarChart3,
                  gradient: 'from-green-500 to-teal-600',
                  action: () => toast.info('Analytics dashboard coming soon!')
                }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative overflow-hidden bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-gray-700 hover:border-gray-600"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-black mb-1">{action.title}</h4>
                      <p className="text-sm text-black">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dark Recent Activity */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <h3 className="text-xl font-bold text-black mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-3 text-green-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors border border-gray-800 hover:border-gray-700">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black">{activity.message}</p>
                  <p className="text-xs text-black flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm text-indigo-400 hover:text-indigo-300 font-medium py-2 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800 hover:border-gray-700">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

// Dark Cinemas Tab
const DarkCinemasTab = ({ cinemas, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-black flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-400" />
              Cinema Management
            </h2>
            <p className="text-black mt-1">Manage cinema locations and their screens</p>
          </div>
          <button 
            onClick={onAdd}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Cinema</span>
          </button>
        </div>

        <CinemaTable 
          cinemas={cinemas}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

// Dark Movies Tab
const DarkMoviesTab = ({ movies, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-black flex items-center">
              <Film className="w-6 h-6 mr-3 text-purple-400" />
              Movie Management
            </h2>
            <p className="text-black mt-1">Add and manage your movie catalog</p>
          </div>
          <button 
            onClick={onAdd}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Movie</span>
          </button>
        </div>

        <MovieGrid 
          movies={movies}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;