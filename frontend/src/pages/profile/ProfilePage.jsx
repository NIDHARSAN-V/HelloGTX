import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchProfile } from '../../Store/CustomerProfile';
import ProfileForm from './ProfileForm';
import ProfileView from './ProfileView';
import { fetchProfile } from '../../Store/CustomerProfile';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.customerProfile);
  const {user} = useSelector(state => state.auth);


  const [editMode, setEditMode] = useState(false);
  // console.log(user.id , "In in profile page")

  useEffect(() => {
    dispatch(fetchProfile(user.id));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {profile && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editMode ? 'View Profile' : 'Edit Profile'}
            </button>
          )}
        </div>
        
        {editMode || !profile ? (
          <ProfileForm />
        ) : (
          <ProfileView profile={profile} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;