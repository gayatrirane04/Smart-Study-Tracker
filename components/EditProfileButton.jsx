'use client';

export default function EditProfileButton() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('editProfile'));
  };

  return (
    <button 
      onClick={handleClick}
      className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm'
    >
      Edit Profile
    </button>
  );
}