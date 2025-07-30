import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center pt-32 px-4 text-center text-gray-800"> 
            <img
                className="mb-8 drop-shadow-md"
                width={280}
                src={assets.notes_img}
                alt="Notes Illustration"
            />

            <h1 className="text-2xl sm:text-4xl font-bold mb-3 flex items-center gap-2">
                Time to Make Some Notes 🧠
            </h1>

            <h2 className="text-lg sm:text-2xl font-semibold text-gray-600 mb-4">
                Welcome to our productivity space!
            </h2>

            <p className="max-w-md text-sm sm:text-base text-gray-500 mb-8">
                Start capturing your thoughts and ideas instantly — it’s fast, simple, and fun!
            </p>

            <button
                onClick={() => navigate('/login')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full px-8 py-3 shadow-md transition-all duration-200 ease-in-out"
            >
                Make Notes
            </button>
        </div>
    );
};

export default Header;
