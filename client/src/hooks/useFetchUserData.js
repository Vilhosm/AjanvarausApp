// Import necessary libraries and components
import { useState } from 'react';

// Custom hook to fetch user data
// from the database
const useFetchUserData = () => {
    // Initialize state variables
    const [userData, setUserData] = useState({ firstname: "", lastname: "" });
    const [avatar, setAvatar] = useState(null);

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                // Transforms the first letters to uppercase
                setUserData({
                    firstname: data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1),
                    lastname: data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
                });
                // Sets the avatar for the user
                const avatar = `http://localhost:5000/api/avatar/${data.id}`;
                setAvatar(avatar);
            } else {
                console.error('Error fetching user data');
            }
        } catch (error) {
            console.error('Error in fetchUserData function', error);
        }
    };

    return { userData, avatar, fetchUserData };
};

export default useFetchUserData;
