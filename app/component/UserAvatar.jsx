import React from 'react';

const UserAvatar = ({ src, alt, size = 12 }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`w-${size} h-${size} rounded-full object-cover`}
    />
  );
};

export default UserAvatar;