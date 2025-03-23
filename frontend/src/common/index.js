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
        url : `${backendDomain}/api/all-users`,
        method: "GET"
    }
}

export default SummaryApi