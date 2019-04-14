module.exports = function (req, res, next) {
    // 401 Unauthorized, trying to access a protected resource, we give them a chance to provide 
    //authorization key (token)

    //403 Forbidden, if they give the token and still cannot access, we tell them that they cannot
    //access the resource, they should stop trying

    if (!req.user.isAdmin) return res.status(403).send('Access denied');

    //if the user happens to be the admin, he can proceed to the next middleware
    next();

}
