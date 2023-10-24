module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('Success'),
        'error': req.flash('err')
    }
    next();
}