'use strict';

module.exports = (action) => {
    return (req, res, next) => {
        try {
            if (req.user.actions.includes(action)) {
                next();
            } else {
                next('Access Denied')
            }
        } catch (e) {
            next('invalid login')
        }
    }
}