
// import { createContext, useContext, useReducer, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     case 'SET_USER':
//       return { ...state, user: action.payload, loading: false };
//     case 'LOGOUT':
//       return { ...state, user: null, token: null, loading: false };
//     case 'SET_TOKEN':
//       return { ...state, token: action.payload };
//     default:
//       return state;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, {
//     user: null,
//     token: localStorage.getItem('token'),
//     loading: true
//   });

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

//   // Configure axios defaults
//   useEffect(() => {
//     if (state.token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [state.token]);

//   // Load user on mount
//   useEffect(() => {
//     const loadUser = async () => {
//       if (state.token) {
//         try {
//           const response = await axios.get(`${API_URL}/auth/profile`);
//           dispatch({ type: 'SET_USER', payload: response.data.data.user });
//         } catch (error) {
//           localStorage.removeItem('token');
//           dispatch({ type: 'LOGOUT' });
//         }
//       } else {
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     };

//     loadUser();
//   }, [state.token, API_URL]);

//   const login = async (email, password) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       const response = await axios.post(`${API_URL}/auth/login`, {
//         email,
//         password
//       });

//       const { user, token } = response.data.data;
      
//       localStorage.setItem('token', token);
//       dispatch({ type: 'SET_TOKEN', payload: token });
//       dispatch({ type: 'SET_USER', payload: user });
      
//       toast.success('Login successful!');
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed';
//       toast.error(message);
//       dispatch({ type: 'SET_LOADING', payload: false });
//       return { success: false, message };
//     }
//   };

//   const register = async (name, email, password) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       const response = await axios.post(`${API_URL}/auth/register`, {
//         name,
//         email,
//         password
//       });

//       const { user, token } = response.data.data;
      
//       localStorage.setItem('token', token);
//       dispatch({ type: 'SET_TOKEN', payload: token });
//       dispatch({ type: 'SET_USER', payload: user });
      
//       toast.success('Registration successful!');
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Registration failed';
//       toast.error(message);
//       dispatch({ type: 'SET_LOADING', payload: false });
//       return { success: false, message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     dispatch({ type: 'LOGOUT' });
//     toast.success('Logged out successfully');
//   };

//   const value = {
//     user: state.user,
//     token: state.token,
//     loading: state.loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!state.user,
//     isAdmin: state.user?.role === 'admin'
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// src/context/AuthContext.jsx - Updated for Production
import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    loading: true
  });

  // Production API URL - Replace with your actual OnRender backend URL
  const API_URL = 'https://movie-ticket-rxxa.onrender.com/api';

  // Configure axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await axios.get(`${API_URL}/auth/profile`);
          dispatch({ type: 'SET_USER', payload: response.data.data.user });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, [state.token, API_URL]);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Login successful!');
      
      // Return user data so we can check role in component
      return { 
        success: true, 
        user: user,
        isAdmin: user.role === 'admin'
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });

      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    login,
    register,
    logout,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
