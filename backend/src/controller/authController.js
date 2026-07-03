import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateTokent } from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        error: "User already exists with this email",
      });
    }
      //hash the pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // ← fixed order
     // create the user 
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token =generateTokent(user.id, res)


    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error); // full error in terminal
    res.status(500).json({
      error: error.message, // real error in Postman
      code: error.code,     // Prisma error code e.g. P2002
    });
  }
};

const login= async (req,res)=>{
  const {email,password}=req.body
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      error: "User doesnt exist with this email",
    });
  }
  //verify password
  const isPasswordValid=await bcrypt.compare(password,user.password)
  if (!isPasswordValid){
    return res.status(401).json({
      error: "invalid email or password",
    });
  }

  //generate JWT token
  const token =generateTokent(user.id,res)

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        
        email: user.email,
      },
    },
    token,
  });
    

}

const logout =async(req,res)=>{
  res.cookie("jwt","",{
    httpOnly:true,
    
    expires: new Date(0),
  })

  res.status(200).json({
    status: "success",
    message:"logged out "
  });

}
const getMe = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
};


export { register ,login,logout,getMe};