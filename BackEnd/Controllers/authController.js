// const jwt = require('jsonwebtoken');

// // adminLogin function to handle admin login requests
// async function adminLogin(req, res) {
//     try {

//         // if theres no data privide from user
//         if (!req.body) {
//             return res.status(400).json({ 
//                 error:"please provide request data"
//             });
//         }      

//         // check if the request body contains username and password
//         const { username, password } = req.body;

//         if (!username || !password) {
//             console.log('Missing username or password in request body:', req.body);
//             return res.status(400).json({ 
//                 error: "please provide both username and password" 
//             });
//         }

//         // check admin data that already stored in .env file
//         const isAdmin = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;

//         // check data entry that already stored in .env file
//         const isDataEntry = username === process.env.DATA_ENTRY_USERNAME && password === process.env.DATA_ENTRY_PASSWORD;

//         // const isDataEntry =
//         //     username === process.env.DATA_ENTRY_USERNAME &&
//         //     password === process.env.DATA_ENTRY_PASSWORD;        


//         if (!isAdmin || !isDataEntry) {
//             console.log('Invalid login attempt:', { username, password });
//             return res.status(401).json({ 
//                 error: 'username or password is incorrect' 
//             });
//         }

//        if (!isAdmin || !isDataEntry) {
//             console.log('Invalid login attempt:', { username, password });
//             return res.status(401).json({ 
//                 error: 'username or password is incorrect' 
//             });
//         } 

//         const role = isAdmin ? 'admin' : 'data_entry';


//         // Generate a JWT token for the admin user
//         const token = jwt.sign(
//             { username, role },
//             process.env.JWT_SECRET,
//             { expiresIn: '12h' }
//         );
//         console.log(' login successful, token generated:', token); // token is wrong but add for test cases (trail version)
//         console.log(' username:', username);
//         return res.json({ success: true, token , message: 'login successful' , data: { username , token , role: 'admin' } });

        
        

//     } catch (error) {
//         console.error('Error in adminLogin:', error);
//         return res.status(500).json({ 
//             error: 'An error occurred while logging in' 
//         });
//     }
// }
// module.exports = {
//     adminLogin,

// };


const jwt = require("jsonwebtoken");

// ============================================================
// Login
// Supports:
// - Admin
// - Data Entry
// ============================================================
async function login(req, res) {
    try {

        // ========================================================
        // Validate Request Body
        // ========================================================
        if (!req.body) {
            return res.status(400).json({
                error: "Please provide request data"
            });
        }

        const { username, password } = req.body;

        // ========================================================
        // Validate Username & Password
        // ========================================================
        if (!username || !password) {
            return res.status(400).json({
                error: "Please provide both username and password"
            });
        }

        // ========================================================
        // Determine User Role
        // ========================================================
        let role = null;

        // --------------------------------------------------------
        // Check Admin Credentials
        // --------------------------------------------------------
        const isAdmin =
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD;

        if (isAdmin) {
            role = "admin";
        }

        // --------------------------------------------------------
        // Check Data Entry Credentials
        // --------------------------------------------------------
        const isDataEntry =
            username === process.env.DATA_ENTRY_USERNAME &&
            password === process.env.DATA_ENTRY_PASSWORD;

        if (isDataEntry) {
            role = "DataEntry";
        }

        // ========================================================
        // Invalid Credentials
        // ========================================================
        if (!role) {
            console.log("Invalid login attempt:", {
                username
            });

            return res.status(401).json({
                error: "Username or password is incorrect"
            });
        }

        // ========================================================
        // Generate JWT
        // ========================================================
        const token = jwt.sign(
            {
                username,
                role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "12h"
            }
        );

        // ========================================================
        // Success Response
        // ========================================================
        console.log("Login successful:", {
            username,
            role
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",

            data: {
                username,
                role,
                token
            }
        });

    } catch (error) {

        console.error("Error in login:", error);

        return res.status(500).json({
            error: "An error occurred while logging in"
        });
    }
}


// ============================================================
// Exports
// ============================================================
module.exports = {
    login
};




/*
let role;

if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
) {
    role = 'admin';
} else if (
    username === process.env.DATA_ENTRY_USERNAME &&
    password === process.env.DATA_ENTRY_PASSWORD
) {
    role = 'dataEntry';
} else {
    return res.status(401).json({
        error: 'username or password is incorrect'
    });
}
    */