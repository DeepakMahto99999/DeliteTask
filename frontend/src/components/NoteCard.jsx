import { FaTrash } from 'react-icons/fa'

const NoteCard = ({ note, onNoteClick, onDeleteNote }) => {
    return (
        <div className='bg-white w-full p-4 rounded shadow hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-center'>
                {/* Title section - clickable */}
                <div
                    className='cursor-pointer hover:text-blue-600 transition-colors'
                    onClick={() => onNoteClick(note._id)}
                >
                    <h2 className='text-xl font-bold'>{note.title}</h2>
                </div>

                {/* Delete button */}
                <button
                    className='text-red-500 hover:text-red-700 p-1'
                    onClick={() => onDeleteNote(note._id)}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    )
}

export default NoteCard
