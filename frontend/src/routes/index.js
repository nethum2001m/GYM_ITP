import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element:<App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "sign-up",
                element : <Signup/>
            }
            
        ]
    }
])

export default router;