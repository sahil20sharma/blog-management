const{validatetoken} = require("../service/authentication");
function checkforauthenticationcookie(cookiename){
    return(req,res,next)=>{
        const tokencookievalue = req.cookies[cookiename];
        if(!tokencookievalue){
            return next();
        }
    
    try{
        const userpayload=validatetoken(tokencookievalue);
        console.log("USER PAYLOAD:", userpayload);
        req.user=userpayload;
    }catch(error){
        console.log("TOKEN ERROR:", error);

    }
    return next();
};
}

module.exports = {
    checkforauthenticationcookie,
}
    
