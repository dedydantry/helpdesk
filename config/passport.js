let passwordHash = require('password-hash');
module.exports = function(passport, user){
	let User = user;
	let LocalStrategy = require('passport-local').Strategy;

	passport.serializeUser(function(user, done) {
		done(null, user.id_users);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

		new User({'id_users':id}).fetch({
			withRelated:'roles',
		})
		.then(collection => {
			if(collection){
				
				done(null, collection.toJSON());
			}
			else {
				done(collection.errors, null);
			}
		})
		.catch(err => console.log(err.stack))
		
    });

	passport.use('local-signup', new LocalStrategy(
		{
			usernameField : 'email',
			passReqToCallback : true
		},

		function(req, email, password, done){
			var generateHash = function(password){
				return passwordHash.generate(password);
			};

			User.where('email', email).fetch()
			.then(result => {
				if(result){
					return done(null, false,{
						message:'Email telah terdaftar'
					});
				}
				else{
					var userPassword = generateHash(password);
					var data = {
						'name' : req.body.name,
				        'email' : email,
				        'password' : passwordHash.generate(password.replace(email)),
				        'status' : true,
				        'jabatan' : req.body.jabatan
					};

					User(data).save()
					.then(function(model){
						if(model){
							return done(null, model);
						}
					})
				}
			})
		}
	));

	passport.use('local-signin', new LocalStrategy(
		{
		 	usernameField: 'email',
		 	passwordField: 'password',
		  	passReqToCallback: true 
		},

		function(req, email, password, done){
			var isValidPassword = function(userpass, password){
				return passwordHash.verify(password, userpass);
			}
			User.where('email', email).fetch({withRelated:'roles',})
			.then(model=>{
				let result = model.toJSON();
				console.log(result);
				if(!result){
					console.log('email salah');
					return done(null, false,{
						message: 'Email not found'
					})
				}

				if(!isValidPassword(result.password, password)){
					console.log('password salah');
					return done(null, false, {
						message : 'password salah'
					})
				}
					
				console.log('berhasil');
				return done(null, result);
			})
			.catch(err => {
				console.log(err.stack);
				return done(null, false, {
					message : 'Failed to login'
				})
			})
		}

	))
}