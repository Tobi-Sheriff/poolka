const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/pages');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
module.exports.login = (req, res) => {
    // const f = req.user;
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || ('/pages');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.renderProfile = (req, res) => {
    res.render('users/profile');
}
module.exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.profile });
    // const staffRole = document.querySelector('#staffRole');
    // user.staff = staffRole.innerText
    // console.log(staffRole.innerText);
    console.log(user);
    await user.save();
    console.log("THIS IS THE BODY:  ");
    console.log(req.body.profile);
    console.log(user);
    req.flash('success', 'Successfully updated user!');
    res.redirect('/pages')
}

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) {
            // req.flash('error', 'You are not logged in');
            return err;
        }
    });
    // req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/login');
}