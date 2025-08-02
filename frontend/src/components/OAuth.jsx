import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useAuth } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {

    const { login } = useAuth();
    const navigate = useNavigate()

    const handleGoogleClick = async (e) => {

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        e.preventDefault();

        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const { data } = await axios.post(`${backendUrl}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
            });

            if (data && data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                login(data.user);

                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                toast.error(data?.message || 'Login failed');
            }

        } catch (error) {
            console.error('Google login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            toast.error(errorMessage)
        }
    }

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="bg-red-600  text-white w-full py-2 rounded-md text-base hover:opacity-95"
        >
            Continue with Google
        </button>
    )
}

export default OAuth
