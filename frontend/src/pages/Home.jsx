
import React from 'react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-600 rounded-2xl text-white" style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
      }}>
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Book Your Movie Tickets
          </h1>
          <p className="text-xl mb-8" style={{ color: '#dbeafe' }}>
            Experience cinema like never before. Choose your seats, pick your time, and enjoy the show.
          </p>
          <div className="flex flex-col space-y-4 justify-center" style={{ gap: '1rem' }}>
            <a
              href="/cinemas"
              className="btn btn-primary"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              Browse Cinemas
            </a>
            <a
              href="/register"
              className="btn btn-secondary"
              style={{
                border: '2px solid white',
                color: 'white',
                backgroundColor: 'transparent',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Sign Up Free
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose MovieBook?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make movie booking simple, fast, and convenient. Here's what makes us special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: '🎬', 
              title: 'Latest Movies', 
              description: 'Book tickets for the latest blockbusters and indie films' 
            },
            { 
              icon: '📍', 
              title: 'Multiple Locations', 
              description: 'Find cinemas near you across various cities' 
            },
            { 
              icon: '⏰', 
              title: 'Flexible Timings', 
              description: 'Choose from multiple show times that fit your schedule' 
            },
            { 
              icon: '⭐', 
              title: 'Best Experience', 
              description: 'Enjoy premium viewing experience with comfortable seating' 
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 card hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease'
              }}
            >
              <div 
                className="text-4xl mb-4"
                style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section 
        className="p-8 rounded-2xl"
        style={{
          backgroundColor: '#f9fafb',
          borderRadius: '1rem',
          padding: '2rem'
        }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Booking movie tickets has never been easier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Choose Cinema',
              description: 'Browse through our list of partner cinemas and select your preferred location.'
            },
            {
              step: '02',
              title: 'Select Show',
              description: 'Pick your favorite movie and the showtime that works best for you.'
            },
            {
              step: '03',
              title: 'Book Seats',
              description: 'Choose your seats from our interactive seat map and confirm your booking.'
            }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontSize: '1.25rem',
                  fontWeight: '700'
                }}
              >
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="text-center py-16 rounded-2xl text-white"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
          borderRadius: '1rem',
          padding: '4rem 1.5rem'
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Next Movie?
          </h2>
          <p 
            className="text-lg mb-8"
            style={{ color: '#d1d5db', marginBottom: '2rem' }}
          >
            Join thousands of movie lovers who trust MovieBook for their cinema experience.
          </p>
          <a
            href="/cinemas"
            className="btn btn-primary"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Start Booking Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;