const verifyRole = (allowedRole)=>{
    return (req,res,next)=>{
        if(!req?.role){
            console.log("mochkol lena !")
            return res.status(401).json({message: "aaaa 7ama rak Unauthorized"})
        }
        const result = req.role===allowedRole
        if(!result){
            return res.status(401).json({message: "Unauthorized Not Allowed !"})
        }
        next()
    }
}

module.exports = verifyRole