import { useState } from "react";
import axios from 'axios'; 
import NoteModal from "../components/NoteModal"; 
import { useAuth } from '../context/ContextProvider';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isModalOpen, setModalOpen] = useState(false); 
    
    const { user } = useAuth();

    const closeModal = () => { 
        setModalOpen(false)
    }

    const addNote = async (title, description) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                `${backendUrl}/api/note/add-note`, 
                { title, description },
                {
                    headers: {
                        'token': token 
                    }
                }
            );
            
            if (response.data.success) {
                closeModal()
                toast.success('Note created successfully!'); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding note:', error);
            toast.error(error.response?.data?.message || 'Error creating note');
        }
    }

    return (
        <div className="bg-gray-100  flex flex-col items-center justify-center p-4"> {/* ADDED: min-h-screen */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-md text-center">
                <h1 className="text-xl font-bold mb-2">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">Email: {user?.email}</p>
            </div>

            <button
                onClick={() => setModalOpen(true)} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded w-full max-w-md"
            >
                Create Note
            </button>
            
            {isModalOpen && (
                <NoteModal
                    closeModal={closeModal} 
                    addNote={addNote}
                />
            )}
        </div>
    );
};

export default Dashboard;