const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const equipmentRouter = require("./routes/equipmentRouter.js");
const supplyMaintenanceRouter = require("./routes/supplyMaintenanceRouter.js");
const supplierRouter = require("./routes/supplierRoutes.js"); // Import the supplier routes

//----


const app = express();
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true,
    
}))

app.use(express.json())

app.use(cookieParser())

app.use(express.json())
app.use("/api",router)

//-------attendance-------//
const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);

//----Packages-------//
const packageRoutes = require('./routes/packageRoutes');
app.use('/api/packages', packageRoutes);

// Import Employee Routes

const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

// diet plan //

//--Payment--//
const paymentRoutes = require('./routes/paymentRoutes.js');
app.use("/api/payments", paymentRoutes);

//--Equipment--//

//--store--//


// API routes
app.use("/api", equipmentRouter); // Equipment routes
app.use("/api", supplyMaintenanceRouter); // Supply maintenance routes
app.use("/api", supplierRouter); // Supplier routes



const PORT = 8080 || process.env.PORT

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`connect to DB`)
        console.log(`Server is running`)
    })
})
