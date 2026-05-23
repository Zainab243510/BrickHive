
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center text-white px-6 py-12 md:px-12 md:py-24">
        <h1 className="text-8xl font-extrabold mb-4 animate__animated animate__fadeIn">
          404
        </h1>
        <p className="text-2xl mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Oops! The page you are looking for doesn't exist.
        </p>
        <p className="text-lg mb-8 animate__animated animate__fadeIn animate__delay-2s">
          It seems you've taken a wrong turn.
        </p>
        <Link
          to="/"
          className="bg-white text-slate-800 dark:text-slate-100 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 animate__animated animate__fadeIn animate__delay-3s"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
