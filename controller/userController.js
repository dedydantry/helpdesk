var exports = module.exports = {}
let User = require('../model/user');


function saveToRole(data){
    new User(data).save()
        .then(function(model){
            return true;
        })
        .catch(function(err){
            return false;
        });

}
exports.index = (req,res) => {
    new User().fetchAll()
        .then(function(model){
            return res.render('user/index', {'user':model.toJSON()});
        });
}

exports.create = (req, res) => {
    return res.render('user/create');
}

exports.store = (req, res) => {
    let password = req.body.email;
    let userData = {
        'name' : req.body.name,
        'email' : req.body.email,
        'password' : passwordHash.generate(password.replace(/\s/g, '')),
        'status' : true,
        'jabatan' : req.body.jabatan
    }
    new User(userData).save()
        .then(function(model){
            let callback = model.toJSON();
            let roleData = {
                'user_id' : callback.id_users,
                'role_id' : req.body.roles
            }
            saveToRole(roleData); //save role user
            return res.redirect('http://'+req.headers.host+'/users');
        })
        .catch(function(err){
            console.log(err.stack);
        });
}