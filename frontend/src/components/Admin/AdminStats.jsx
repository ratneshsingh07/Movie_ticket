import { MapPin, Film, Calendar, Users } from 'lucide-react';

const AdminStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Cinemas',
      value: stats.totalCinemas || 0,
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Movies',
      value: stats.totalMovies || 0,
      icon: Film,
      color: 'bg-green-500',
      change: '+5.2%',
      changeType: 'positive'
    },
    {
      title: 'Active Shows',
      value: stats.totalShows || 0,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: '+1.8%',
      changeType: 'positive'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+12.3%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <div className="flex items-center">
                <span className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className={`${stat.color} p-3 rounded-lg flex-shrink-0`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;