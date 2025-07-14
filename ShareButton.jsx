import React, { useState } from 'react';
import { useSharing } from '../hooks/useSharing';
import { useJournalEntries } from '../hooks/useJournalEntries';

const ShareButton = ({ entryId }) => {
  const [showModal, setShowModal] = useState(false);
  const { isShared } = useSharing(entryId);
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`px-4 py-2 rounded flex items-center ${
          isShared 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
          />
        </svg>
        {isShared ? 'Manage Share' : 'Share'}
      </button>
      
      {showModal && (
        <ShareEntryModal 
          entryId={entryId} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

const EntryActions = ({ entry, onDelete }) => {
  const { deleteEntry } = useJournalEntries();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDelete = async () => {
    if (await deleteEntry(entry.entry_id)) {
      onDelete();
    }
  };
  
  return (
    <div className="flex space-x-2">
      <ShareButton entryId={entry.entry_id} />
      
      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
          Delete
        </button>
      ) : (
        <div className="flex space-x-1">
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export { ShareButton, EntryActions };
