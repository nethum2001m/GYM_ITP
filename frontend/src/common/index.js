const backendDomain = "http://localhost:8080"

const SummaryApi = {
    signUP : {
        url: `${backendDomain}/api/signup`,
        method: "POST"
    },
    signIN : {
        url: `${backendDomain}/api/signin`,
        method: "POST"
    },
    current_user : {
        url : `${backendDomain}/api/user-details`,
        method: "GET"
    },
    logout : {
        url : `${backendDomain}/api/userLogout`,
        method: "GET"
    },
    allUser : {
        url : `${backendDomain}/api/all-user`,
        method: "GET"
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method: "POST"
    },
    deleteUser: {
        url: `${backendDomain}/api/delete-User`,
        method: "POST"
    },
     deleteFeedback: {
        url: `${backendDomain}/api/delete-feedback`,
        method: "POST"
    },
    allFeedback: {
        url: `${backendDomain}/api/get-feedbacks`,
        method: "GET"
    },
    getFeedbackById :{
        url: `${backendDomain}/api/get-feedback`,
        method: "GET"
    },
    updateFeedback : {
        url: `${backendDomain}/api/update-feedback:id`,
        method: "POST"
    },
    allServiceFeedback : {
        url: `${backendDomain}/api/get-service-feedback`,
        method: "GET"
    },
    deleteServiceFeedback :{
        url: `${backendDomain}/api/delete-service-feedback`,
        method: "Delete"
    },
    getServiceFeedbackById :{
        url: `${backendDomain}/api/get-service-feedback`,
        method: "GET"
    },
    updateServiceFeedback :{
        url: `${backendDomain}/api/update-service-feedback:id`,
        method: "POST"
    },
    createBooking :{
        url:`${backendDomain}/api/create-booking`,
        method: "POST"
    },
    getBookingById: {
        url: `${backendDomain}/api/get-booking`,
        method: "GET"
    },
    getUserBookings: {
        url: `${backendDomain}/api/get-user-bookings`,
        method: "GET"
    },
    getAllBookings: {
        url: `${backendDomain}/api/get-all-bookings`,
        method: "GET"
    },
    getInstructorBookings: {
        url: `${backendDomain}/api/get-instructor-bookings`,
        method: "GET"
    },
    updateBooking: {
        url: `${backendDomain}/api/update-booking`,
        method: "PUT"
    },
    deleteBooking: {
        url: `${backendDomain}/api/delete-booking`,
        method: "DELETE"
    },
    updateBookingStatus: {
        url: `${backendDomain}/api/update-status`,
        method: "POST"

        }


}

export default SummaryApi