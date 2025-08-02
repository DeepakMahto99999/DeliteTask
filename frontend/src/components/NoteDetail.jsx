import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

const NoteDetail = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNoteDetail();
    }, [noteId]);

    const fetchNoteDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${backendUrl}/api/note/${noteId}`, {
                headers: { token }
            });

            if (data.success) {
                setNote(data.note);
            } else {
                toast.error(data.message);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error fetching note:', error);
            toast.error('Error loading note');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`${backendUrl}/api/note/${noteId}`, {
                    headers: { token }
                });

                if (response.data.success) {
                    toast.success('Note deleted successfully!');
                    navigate('/dashboard');
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Error deleting note:', error);
                toast.error('Error deleting note');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500 text-lg font-medium">Loading note...</div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500 text-lg font-medium">Note not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                {/* Top Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </button>

                    <button
                        onClick={handleDelete}
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-sm transition"
                    >
                        <FaTrash className="mr-2" />
                        Delete
                    </button>
                </div>

                {/* Note Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {note.title}
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Created on: {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                    <hr className="mb-6 border-gray-200" />
                    <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {note.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetail;
