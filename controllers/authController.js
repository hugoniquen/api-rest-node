const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const generaToken = (user) =>{

    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            roles: user.roles,
        },
        process.env.JWT_SECRET,
        {expiresIn: '1hr'}
    );
};

const authController = {
    register: async(req, res)=>{
        try {
            
            const newUser = new  User(req.body);
            await newUser.save();
            const token = generaToken(newUser);

            restart.status(201).json({token, user: newUser});

        } catch (error) {
            restart.status(500).json({message: error.message});
        }
    },

    login: async(req, res)=>{
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if (!user) {
                return res.status(401).json({message: 'Usuario no encontrado'});
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({message: 'Password incorrecta'});
            }
            const token = generaToken(user);
            res.status(200).json({token, user});

        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }
};

module.exports = authController;