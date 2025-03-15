import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Card = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const metadata = location.state?.metadata || {};

  // Function to format metadata keys for better readability
  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  return (
    <>
      <div className="card-container">
        {/* Heading at the top center */}
        <h2>Metadata Details</h2>

        {/* Metadata details centered in the middle */}
        <div className="metadata-center">
          {Object.keys(metadata).length > 0 ? (
            <div className="metadata-list">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="metadata-item">
                  <strong>{formatKey(key)}:</strong>
                  <span>{value || 'N/A'}</span> {/* Display 'N/A' if value is empty */}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-metadata">Record is not in the database.</p>
          )}
        </div>
      </div>

      {/* Back button aligned to the right */}
      <div className="button-container">
        <button onClick={() => navigate('/')}>Back to Upload</button>
      </div>
    </>
  );
};

export default Card;