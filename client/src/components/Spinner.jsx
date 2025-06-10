import React from 'react';

const Spinner = ({ size = 'md', color = 'text-blue-500', className = '' }) => {
  // Determine spinner dimensions based on 'size' prop
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',    // Small
    md: 'w-10 h-10 border-4',  // Medium (default)
    lg: 'w-16 h-16 border-4',  // Large
    xl: 'w-24 h-24 border-8',  // Extra Large
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.md; // Fallback to md if invalid size

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

// Main Loader component that can wrap content or be used standalone
const Loader = ({
  loading, // Boolean: If true, show the loader.
  children, // Optional: Content to display when not loading.
  fullScreen = false, // Boolean: If true, centers the loader on the full screen.
  overlay = false, // Boolean: If true, creates a semi-transparent overlay over content.
  spinnerSize = 'md', // Size of the spinner ('sm', 'md', 'lg', 'xl')
  spinnerColor = 'text-blue-500', // Tailwind color class for the spinner
  message = null // Optional: A message to display below the spinner
}) => {
  if (!loading) {
    return children; // If not loading, render children (or null if no children)
  }

  // Base classes for centering the loader
  let containerClasses = `
    flex items-center justify-center
    ${message ? 'flex-col' : ''} // Add column flex if message is present
  `;

  // Apply full screen or overlay styles
  if (fullScreen) {
    containerClasses += ' fixed inset-0 z-50'; // Fixed position, takes full screen, high z-index
  } else if (overlay) {
    containerClasses += ' absolute inset-0 z-40'; // Absolute position within parent, covers content
  } else {
    containerClasses += ' relative'; // Default to relative if neither fullscreen nor overlay
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