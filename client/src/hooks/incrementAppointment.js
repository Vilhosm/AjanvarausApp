

// Notification stuff
const incrementAppointments = async (id) => {
    try {
        const response = await fetch('http://localhost:5000/api/increment-appointments', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id }),
        });
        if (response.ok) {
            console.log("incremented succesfully");
        }
    } catch (error) {
        console.error("Could not increment appointmets", error);
    };
};

export default incrementAppointments;
