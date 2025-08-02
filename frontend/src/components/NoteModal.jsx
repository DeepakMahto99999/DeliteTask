import { useState } from "react";

const NoteModal = ({ closeModal, addNote }) => { // FIXED: Changed prop name from closeModel to closeModal
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ADDED: Form validation
        if (!title.trim() || !description.trim()) {
            alert('Please fill in both title and description');
            return;
        }
        
        addNote(title, description);
        setTitle("");
        setDescription("");
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Note</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note Title"
                        className="border p-2 w-full mb-4 rounded"
                        required // ADDED: Required attribute
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Note Description"
                        className="border p-2 w-full mb-4 rounded"
                        rows="4" // ADDED: Rows attribute
                        required // ADDED: Required attribute
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Note
                    </button>
                </form>
                <button
                    onClick={closeModal} // FIXED: Changed from closeModel to closeModal
                    className="mt-4 text-red-500 hover:underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NoteModal;