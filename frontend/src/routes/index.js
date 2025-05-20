import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import Scanner from "../component/Scanner";
//-----
import PackageList from "../pages/member_package/PackageList";
import AddPackage from "../pages/member_package/AddPackage";
import EditPackage from "../pages/member_package/EditPackage";
import Services from "../pages/Services"

import EmployeeList from "../pages/Employee/EmployeeList";
import AddEmployee from "../pages/Employee/AddEmployee";
import EditEmployee from "../pages/Employee/EditEmployee";

import Packageuser from "../pages/member_package/Packageuser"

import Dietplan from "../pages/Diet_plan/Dietplan"
import PaymentPage from "../pages/payment/PaymentPage";
//import RequestDietPlan from "../pages/Diet_plan/RequestDietPlan";
import AdminPayments from "../pages/payment/AdminPayments";
import Equipmanage from "../pages/equipment/Equipmanage";
import Equipment from "../pages/equipment/Equipment";
import EquipmentForm from "../pages/equipment/EquipmentForm";
import EquipmentTable from "../pages/equipment/EquipmentTable";
import SupplyMaintenanceTable from "../pages/supplier/SupplyMaintenanceTable";
import SupplyMaintenanceForm from "../pages/supplier/SupplyMaintenanceForm";
import SuppliersTable from "../pages/supplier/SuppliersTable";
import SuppliersForm from "../pages/supplier/SuppliersForm";
import ScheduleTimeInstructor from "../pages/ScheduleManagement/ScheduleTimeInstructor";
import ContactUs from "../pages/CustomerAffairManagement/ContactUs";
import InstructorFeedbackform from "../pages/CustomerAffairManagement/InstructorFeedbackform";
import ServiceFeedbackForm from "../pages/CustomerAffairManagement/ServiceFeedbackForm";
import ScheduleTimeInUser from "../pages/ScheduleManagement/ScheduleTimeInUser";
import SelectInstructor from "../pages/ScheduleManagement/SelectInstructor";
import Profile from "../pages/Profile";
import UpdateTimeSlot from "../pages/ScheduleManagement/UpdateTimeSlot";
import AllFeedbacks from "../pages/CustomerAffairManagement/AllFeedbacks";
import UpdateFeedback from "../pages/CustomerAffairManagement/UpdateFeedback";
import AllServiceFeedback from "../pages/CustomerAffairManagement/AllServiceFeedback";
import UpdateServiceFeedback from "../pages/CustomerAffairManagement/UpdateServiceFeedback";
import AboutUs from "../pages/CustomerAffairManagement/AboutUs";
import BMIcal from "../pages/BMIcal";


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
            },
            {
                path : "admin-panel" , 
                element : <AdminPanel/>,
                children : [
                    {
                        path : "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path : "attendance",
                        element : <Scanner/>,  
                    },
                    // ------- Packages Module ------- //
                    {
                        path: "packages",
                        element: <PackageList />
                    },
                    {
                        path: "packages/add",
                        element: <AddPackage />
                    },
                    {
                        path: "packages/edit/:id",
                        element: <EditPackage />
                    },
                    // ------- Employee Module ------- //
                    {
                        path: "employees",
                        element: <EmployeeList />
                    },
                    {
                        path: "employees/add",
                        element: <AddEmployee />
                    },
                    {
                        path: "employees/edit/:id",
                        element: <EditEmployee />
                    },
                    {
                        path : "adminpayment",
                        element : <AdminPayments/>,
                        
                    },
                    {
                        path : "eqipmanage",
                        element : <Equipmanage/> 
                    },
                    { 
                        path: "eqipmanage/equipment", 
                        element: <Equipment /> 
                    },
                    { 
                        path: "eqipmanage/equipment-form",
                        element: <EquipmentForm /> 
                    },
                    { 
                        path: 'eqipmanage/equipment-table',
                        element: <EquipmentTable />
                    },
                    { 
                        path: 'eqipmanage/supply-maintenance-table',
                        element: <SupplyMaintenanceTable /> 
                    },
                    { 
                        path: 'eqipmanage/supply-maintenance-form',
                        element: <SupplyMaintenanceForm /> 
                    },
                    { 
                        path: 'eqipmanage/suppliers-table',
                        element: <SuppliersTable /> 
                    },
                    { 
                        path: 'eqipmanage/suppliers-form',
                        element: <SuppliersForm /> 
                    },
                    {
                        path : "confirm-reject-time",
                        element : <ScheduleTimeInstructor/>
                    },

                      
                            //{ path: '/', element: <App /> },
                    
                        
                        
                   
                    
                    
                    
                      
                    
                    
                    
                    
                    
                    
                ]
            },
            {
                path : "profile",
                element : <Profile/>
            },
            {
                path : "profile/userview",
                element : <ScheduleTimeInUser/>
            },
            {
                path : "profile/update/:id",
                element : <UpdateTimeSlot/>
            },
            {
                path : "aboutus",
                element : <AboutUs/>, 
                
            },
            
            {
                path : "services",
                element : <Services/>, 
                
            },
            {
                path : "profile/Myfeedback",
                element : <AllFeedbacks/>
            },
            {
                path : "/updatefeedback/:id",
                element : <UpdateFeedback/>
  
            },
             {
                path : "profile/serviceFeedback",
                element : <AllServiceFeedback/>
            },
            {
                path : "profile/serviceFeedback",
                element : <AllServiceFeedback/>
            },
                        {
                path : "/updateServicefeedback/:id",
                element : <UpdateServiceFeedback/>
  
            },
            {
                path : "packageuse",
                element : <Packageuser/>
            },
            { 
                path: "/pay",
                element: <PaymentPage />
            },
            { 
                path: "services/dietplan",
                element: <Dietplan />
                
            },
                        { 
                path: "services/workoutschedule",
                element: <SelectInstructor />
                
            },
            {
                        
                path: "/services/bmicalculator",
                element: <BMIcal />
                
            },

            { 
                path: "contact-us",
                element: <ContactUs/>,
                
            },
                {
                        path : "contact-us/Feedback-Form",
                        element : <InstructorFeedbackform/>
                    },
                    {
                        path : "contact-us/service-feedback",
                        element : <ServiceFeedbackForm/>
                    },
            
            
            
           
        ]
    }
])

export default router;