import jsonwebtoken from "jsonwebtoken";

export const generateTokent =(userId,res)=>{
    const payload={id:userId}
    const token=jsonwebtoken.sign(payload,process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    })
    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production", 
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      
    return token
}