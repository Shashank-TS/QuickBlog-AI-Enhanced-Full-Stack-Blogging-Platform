import React from 'react';

const Spinner = ({ size = 'md', color = 'text-blue-500', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',    // Small
    md: 'w-10 h-10 border-4',  // Medium (default)
    lg: 'w-16 h-16 border-4',  // Large
    xl: 'w-24 h-24 border-8',  // Extra Large
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.md; 

  return (
    <div className={`
      animate-spin
      ${spinnerClass}
      ${color}
      border-solid
      border-current
      border-t-transparent
      rounded-full
      ${className}
    `}>
      {/* This div acts as the spinning element */}
    </div>
  );
};

const Loader = ({
  loading, 
  children, 
  fullScreen = false, 
  overlay = false, 
  spinnerSize = 'md', 
  spinnerColor = 'text-blue-500', 
  message = null 
}) => {
  if (!loading) {
    return children; 
  }

  let containerClasses = `
    flex items-center justify-center
    ${message ? 'flex-col' : ''} // Add column flex if message is present
  `;

  if (fullScreen) {
    containerClasses += ' fixed inset-0 z-50'; 
  } else if (overlay) {
    containerClasses += ' absolute inset-0 z-40'; 
  } else {
    containerClasses += ' relative'; 
  }

  return (
    <div className={`
      ${containerClasses}
      ${overlay ? 'bg-white bg-opacity-30' : ''} // Semi-transparent overlay background
    `}>
      <Spinner size={spinnerSize} color={spinnerColor} />
      {message && (
        <p className={`
          mt-4 text-center
          ${overlay || fullScreen ? 'text-white' : 'text-gray-700'} // Adjust text color for visibility
        `}>{message}</p>
      )}
    </div>
  );
};

export default Loader;