const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//import files
const users = require('../models/userSchema');
const {validationResponse,successResponse,errorResponse} = require('../exception/responseFormat');

const signUp = async (req, res) => {
    const { firstName, lastName, email, mobileNumber, role, password } = req.body;
    try {

        if (!firstName) {
            return res.status(400).json(validationResponse(400, "firstName is required"));
        } else if(!lastName){
            return res.status(400).json(validationResponse(400, "lastName is required"));   
        }
        else if (!email) {
            return res.status(400).json(validationResponse(400, "Email is required"));
        }  else if (!mobileNumber) {
            return res.status(400).json(validationResponse(400, "Mobile number is required"));
        }else if (!password) {
            return res.status(400).json(validationResponse(400, "Password is required"));
        }
        
        
        

    // email validation checking email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    //mobile number validation starting with 6, 7, 8, or 9
    const mobileRegex = /^[6-9]\d{9}$/;
    
    // Check if email is valid
    if (!emailRegex.test(email)) {
        return res.status(400).json(validationResponse(400, "Invalid email format"));
    }

    //email already in database or not 
    const existingEmail = await users.findOne({
        email
    });

    if(existingEmail){
        return res.status(409).json(validationResponse(400, "Email already Registered"));
    }
    
    // Check if mobile number is valid
    if (!mobileRegex.test(mobileNumber)) {
        return res.status(400).json(validationResponse(400, "Invalid mobile number"));
    }

    //mobile number already registered or not 
    const existingMobileNumber = await users.findOne({
        mobileNumber
    });

     // Password validation: at least 8 characters, one uppercase, one special symbol
     const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

     // Check if password meets requirements
     if (!passwordRegex.test(password)) {
        return res.status(400).json(validationResponse(400, "Password must be at least 8 characters long and contain at least one uppercase letter and one special symbol"));
    }

    if(existingMobileNumber){
        return res.status(409).json(validationResponse(400, "mobile number already Registered"));   
    }
    

       // Hash the password using bcrypt
       const hashedPassword = await bcrypt.hash(password, 8);


        const newUser = await users.create({
            firstName,
            lastName,
            email,
            mobileNumber,
            role,
            password: hashedPassword
        });

    res.status(200).json(successResponse(200, "User created successfully", newUser));
    } catch (error) {
        res.status(500).json(errorResponse());
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || email.length === 0) {
            return res.status(400).json(validationResponse(400, "Email is Required"));
        }

        if (!password || password.length === 0) {
            return res.status(400).json(validationResponse(400, "Password is Required"));
        }

        // Email validation: checking email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Check if email is valid
        if (!emailRegex.test(email)) {
            return res.status(400).json(validationResponse(400, "Invalid email format"));
        }

        const userDetails = await users.findOne({ email });

        // Check if user exists
        if (!userDetails) {
            return res.status(401).json(validationResponse(401, "User not found"));
        }

        // Check if password is correct
        const passwordMatch = await bcrypt.compare(password, userDetails.password);
        if (!passwordMatch) {
            return res.status(401).json(validationResponse(401, "Invalid password"));
        }

        // Generate access token
        const accessToken = jwt.sign({ userId: userDetails._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        // Generate refresh token
        const refreshToken = jwt.sign({ userId: userDetails._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        const data = {
            accessToken,
            refreshToken,
            userDetails
        };

        res.status(200).json(successResponse(200, "Login Successfully", data));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse());
    }
};


const updateUser = async (req, res) => {
    const { firstName, lastName, email, mobileNumber, role, password } = req.body;
    try {
        
        let user = await users.findById({
            _id:req.user[0].id
        });

        
        if (!user) {
            return res.status(404).json(validationResponse(404, "User not found"));
        }

        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (email) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json(validationResponse(400, "Invalid email format"));
            }
            // Check if email already exists
            const existingEmail = await users.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== id) {
                return res.status(409).json(validationResponse(409, "Email already registered"));
            }
            user.email = email;
        }


        if (mobileNumber) {
            // Validate mobile number format
            const mobileRegex = /^[6-9]\d{9}$/;
            if (!mobileRegex.test(mobileNumber)) {
                return res.status(400).json(validationResponse(400, "Invalid mobile number"));
            }
            // Check if mobile number already exists
            const existingMobileNumber = await users.findOne({ mobileNumber });
            if (existingMobileNumber && existingMobileNumber._id.toString() !== id) {
                return res.status(409).json(validationResponse(409, "Mobile number already registered"));
            }
            user.mobileNumber = mobileNumber;
        }
        if (role) {
            // Validate role
            const roles = ["User", "Admin"];
            if (!roles.includes(role)) {
                return res.status(400).json(validationResponse(400, "Invalid role"));
            }
            user.role = role;
        }
        if (password) {
            // Validate password
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json(validationResponse(400, "Password must be at least 8 characters long and contain at least one uppercase letter and one special symbol"));
            }
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

       const updateUser = await user.save();

        res.status(200).json(successResponse(200, "User updated successfully", updateUser));
    } catch (error) {
        res.status(500).json(errorResponse());
    }
};


const getOneUserDetails = async(req,res)=>{
   try{
    const findUser = await users.findOne({
        _id:req.user[0].id,
    });
    res.status(200).json(successResponse(200,"User Retrieve Successfully",findUser))

}catch(error){
    res.status(500).json(errorResponse());
}
}


const getAllUserDetails = async(req,res)=>{
    try{
        const findAllUser = await users.find();
        res.status(200).json(successResponse(200,"All User Details Retrieve Successfully",findAllUser))
    }catch(error){
    console.log(error);
    res.status(500).json(errorResponse()); 
    }
}


module.exports = {
    signUp,
    login,
    updateUser,
    getOneUserDetails,
    getAllUserDetails
};
