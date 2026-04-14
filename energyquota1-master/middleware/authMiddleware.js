const isAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        next()
    }else{
        res.render("login", {
            message: "Welcome!.Login to continue."
        })
    }
}


module.exports = {
    isAuth
}