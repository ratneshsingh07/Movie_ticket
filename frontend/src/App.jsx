// // src/App.jsx - Updated to handle admin routes separately
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { BookingProvider } from './context/BookingContext';

// // Layout Components
// import Navbar from './components/Layout/Navbar';

// // Auth Components
// import ProtectedRoute from './components/Auth/ProtectedRoute';
// import AdminRoute from './components/Auth/AdminRoute';

// // Regular Pages (with navbar)
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import CinemaList from './pages/CinemaList';
// import ShowList from './pages/ShowList';
// import SeatSelection from './pages/SeatSelection';
// import BookingConfirmation from './pages/BookingConfirmation';
// import BookingHistory from './pages/BookingHistory';

// // Admin Pages (without navbar)
// import AdminDashboard from './pages/AdminDashboard';

// // Regular Layout Component (with navbar)
// const RegularLayout = ({ children }) => (
//   <div className="min-h-screen bg-gray-50">
//     <Navbar />
//     <main className="container mx-auto px-4 py-8">
//       {children}
//     </main>
//   </div>
// );

// // Simple Layout Component (without navbar for admin)
// const SimpleLayout = ({ children }) => (
//   <div className="min-h-screen">
//     {children}
//   </div>
// );

// function App() {
//   return (
//     <AuthProvider>
//       <BookingProvider>
//         <Router>
//           <Routes>
//             {/* Admin Routes - No Navbar */}
//             <Route 
//               path="/admin/*" 
//               element={
//                 <AdminRoute>
//                   <SimpleLayout>
//                     <AdminDashboard />
//                   </SimpleLayout>
//                 </AdminRoute>
//               } 
//             />
            
//             {/* Auth Routes - No Navbar */}
//             <Route 
//               path="/login" 
//               element={
//                 <SimpleLayout>
//                   <Login />
//                 </SimpleLayout>
//               } 
//             />
//             <Route 
//               path="/register" 
//               element={
//                 <SimpleLayout>
//                   <Register />
//                 </SimpleLayout>
//               } 
//             />

//             {/* Regular User Routes - With Navbar */}
//             <Route 
//               path="/" 
//               element={
//                 <RegularLayout>
//                   <Home />
//                 </RegularLayout>
//               } 
//             />
//             <Route 
//               path="/cinemas" 
//               element={
//                 <RegularLayout>
//                   <CinemaList />
//                 </RegularLayout>
//               } 
//             />
//             <Route 
//               path="/cinemas/:cinemaId/shows" 
//               element={
//                 <ProtectedRoute>
//                   <RegularLayout>
//                     <ShowList />
//                   </RegularLayout>
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/shows/:showId/seats" 
//               element={
//                 <ProtectedRoute>
//                   <RegularLayout>
//                     <SeatSelection />
//                   </RegularLayout>
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/booking/confirmation" 
//               element={
//                 <ProtectedRoute>
//                   <RegularLayout>
//                     <BookingConfirmation />
//                   </RegularLayout>
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/bookings" 
//               element={
//                 <ProtectedRoute>
//                   <RegularLayout>
//                     <BookingHistory />
//                   </RegularLayout>
//                 </ProtectedRoute>
//               } 
//             />
//           </Routes>

//           {/* Toast Notifications */}
//           <Toaster 
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//               success: {
//                 duration: 3000,
//                 iconTheme: {
//                   primary: '#22c55e',
//                   secondary: '#fff',
//                 },
//               },
//               error: {
//                 duration: 4000,
//                 iconTheme: {
//                   primary: '#ef4444',
//                   secondary: '#fff',
//                 },
//               },
//             }}
//           />
//         </Router>
//       </BookingProvider>
//     </AuthProvider>
//   );
// }

// export default App;


// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Layout Components
import Navbar from './components/Layout/Navbar';

// Auth Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CinemaList from './pages/CinemaList';
import ShowList from './pages/ShowList';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';

// Admin Redirect Handler Component
const AdminRedirectHandler = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if user just logged in and is admin
    if (isAuthenticated && user?.role === 'admin') {
      // Avoid redirect loop if already on admin page
      if (!location.pathname.startsWith('/admin')) {
        console.log('Admin user detected, redirecting to admin dashboard');
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return null; // This component doesn't render anything
};

// Main App Content Component
const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminRedirectHandler />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cinemas" element={<CinemaList />} />
          <Route 
            path="/cinemas/:cinemaId/shows" 
            element={
              <ProtectedRoute>
                <ShowList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shows/:showId/seats" 
            element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/confirmation" 
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          {/* Catch all route for 404 */}
          <Route 
            path="*" 
            element={
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Page Not Found
                </h2>
                <p className="text-gray-500 mb-4">
                  The page you're looking for doesn't exist.
                </p>
                <Link to="/" className="btn-primary">
                  Go Home
                </Link>
              </div>
            } 
          />
        </Routes>
      </main>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <AppContent />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;