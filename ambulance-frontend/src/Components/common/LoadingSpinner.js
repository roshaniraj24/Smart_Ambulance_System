// import React from 'react';
// import './LoadingSpinner.css';

// const LoadingSpinner = ({ size = 'medium', color = 'primary', text = null }) => {
//   const sizeClass = `spinner-${size}`;
//   const colorClass = `spinner-${color}`;

//   return (
//     <div className="spinner-container">
//       <div className={`loading-spinner ${sizeClass} ${colorClass}`}></div>
//       {text && <p className="spinner-text">{text}</p>}
//     </div>
//   );
// };

// export default LoadingSpinner;


import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const spinnerStyle = {
    width: size === 'small' ? '20px' : size === 'large' ? '50px' : '30px',
    height: size === 'small' ? '20px' : size === 'large' ? '50px' : '30px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </>
  );
};

export default LoadingSpinner;