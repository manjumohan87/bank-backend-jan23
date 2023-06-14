//define application specific middleware

const appMiddleware = (req,res,next)=>{
    console.log("Bank app -Application Specific Middleware ");
    next()
}

module.exports={
    appMiddleware
}