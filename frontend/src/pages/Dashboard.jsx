import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; // ADDED: For navigation
import axios from 'axios';
import NoteModal from "../components/NoteModal";
import { useAuth } from '../context/ContextProvider';
import { toast } from 'react-toastify';
import NoteCard from "../components/NoteCard";

const Dashboard = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate(); // ADDED: Navigation hook

    const [isModalOpen, setModalOpen] = useState(false);
    const [notes, setNotes] = useState([])

    const { user } = useAuth();

    const closeModal = () => {
        setModalOpen(false)
    }

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${backendUrl}/api/note`, {
                headers: {
                    'token': token
                }
            })
            
            if (data.success) {
                setNotes(data.notes)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching notes:', error)
            toast.error(error.response?.data?.message || 'Error fetching notes')
        }
    }

    // ADDED: Handle note click for navigation
    const handleNoteClick = (noteId) => {
        navigate(`/dashboard/${noteId}`) // Navigate to note detail page
    }

    // ADDED: Handle note deletion
    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`${backendUrl}/api/note/${noteId}`, {
                    headers: {
                        'token': token
                    }
                });

                if (response.data.success) {
                    toast.success('Note deleted successfully!');
                    fetchNotes(); // Refresh notes list
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Error deleting note:', error);
                toast.error(error.response?.data?.message || 'Error deleting note');
            }
        }
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
                fetchNotes()
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
        <div className="bg-gray-100 min-h-screen  p-4">  

            <div className="max-w-md md:max-w-2xl mx-auto space-y-6"> 

                <div className="bg-white shadow rounded-lg p-6 mb-6 text-center">
                    <h1 className="text-xl font-bold mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-gray-600">Email: {user?.email}</p>
                </div>

                <div className="text-center mb-14"> {/* ADDED: Margin bottom */}
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-800 text-white w-full font-medium py-3 px-4 rounded"
                    >
                        Create Note
                    </button>
                </div>

                {/* UPDATED: Better grid layout */}
                <div className=' grid grid-cols-1  gap-4'>
                    {notes.length > 0 ? (
                        notes.map(note => (
                            <NoteCard 
                                key={note._id}
                                note={note}
                                onNoteClick={handleNoteClick} // ADDED: Pass click handler
                                onDeleteNote={handleDeleteNote} // ADDED: Pass delete handler
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-8"> {/* ADDED: Empty state */}
                            No notes yet. Create your first note!
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <NoteModal
                        closeModal={closeModal}
                        addNote={addNote}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;