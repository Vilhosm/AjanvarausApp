import React from 'react';
import { useAuthUser } from 'react-auth-kit';

// Hook to check the user role
// and authorize proper page for them to see
const withAdminRole = (WrappedComponent) => {
  const RequiresAdminRole = (props) => {
    // Initialize state variables
    const auth = useAuthUser();
    const userRole = auth()?.role;

    if (userRole === 'admin') {
      return <WrappedComponent {...props} />;
    }
    // Redirect to login or display an unauthorized message
    return <p>You are not authorized to access this page.</p>;
  };

  return RequiresAdminRole;
};

export default withAdminRole;
