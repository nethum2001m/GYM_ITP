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
    }
}

export default SummaryApi