const jwt = require('jsonwebtoken');

// adminLogin function to handle admin login requests
async function adminLogin(req, res) {
    try {

        // if theres no data privide from user
        if (!req.body) {
            return res.status(400).json({ 
                error:"please provide request data"
            });
        }      

        // check if the request body contains username and password
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('Missing username or password in request body:', req.body);
            return res.status(400).json({ 
                error: "please provide both username and password" 
            });
        }

        // check admin data that already stored in .env file
        const isUsernameCorrect = username === process.env.ADMIN_USERNAME;
        const isPasswordCorrect = password === process.env.ADMIN_PASSWORD;

        if (!isUsernameCorrect || !isPasswordCorrect) {
            console.log('Invalid login attempt:', { username, password });
            return res.status(401).json({ 
                error: 'username or password is incorrect' 
            });
        }

        // Generate a JWT token for the admin user
        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        console.log('Admin login successful, token generated:', token); // token is wrong but add for test cases (trail version)
        console.log('Admin username:', username);
        return res.json({ success: true, token , message: 'Admin login successful' , data: { username , token} });

        
        

    } catch (error) {
        console.error('Error in adminLogin:', error);
        return res.status(500).json({ 
            error: 'An error occurred while logging in' 
        });
    }
}
module.exports = {
    adminLogin,

};