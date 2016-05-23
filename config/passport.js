var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		passReqToCallback: true,
		profileFields: ["emails", "displayName"]
	}, function(req, accessToken, refreshToken, profile, done){
		process.nextTick(function(){
			//user not logged in yet
			if(!req.user) {
				User.findOne({'facebook.id': profile.id}, function(err, user){
				if (err)
					return done(err);
				if(user) {
					if(!user.facebook.token){
						user.facebook.token = accessToken;
						user.facebook.name = profile.displayName;
						user.facebook.email = profile.emails[0].value;

						user.save(function(err){
							if(err)
								throw err;
						});
					}
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.name = profile.displayName;
					newUser.facebook.email = profile.emails[0].value;

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
			}
			//user already logged in and now needs to be merged
			else {
				var user = req.user;
				user.facebook.id = profile.id;
				user.facebook.token = accessToken;
				user.facebook.name = profile.displayName;
				user.facebook.email = profile.emails[0].value;

				user.save(function(err){
					if (err)
						throw err;
					return done(null, user);
				});
			}

		});
	}
	));

}