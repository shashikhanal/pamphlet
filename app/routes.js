var User = require('./models/user');
var Ad = require('./models/ad');
var ad = "";
var id = "";

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	app.get('/profile', isLoggedIn, function(req, res){
		id = req.user.id;
		Ad.find(id, function(err, data){
			if(err)
				throw err;
			if(data)
				ad = data;
			console.log("profile ad " + ad);
			res.render('profile.ejs', { user: req.user, ad });
		});
		
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));

	app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

	app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.post('/upload', function(req, res){
			console.log("USERID HERE " + req.user.id);
			
			var newAd = new Ad();
			newAd.ad.id = req.user.id;
			newAd.ad.detail = req.body.adText;

			//console.log(newAd.ad);

			newAd.save(function(err){
				if(err) 
					throw err;
			});

			Ad.find(id, function(err, ad){
				if(err)
					throw err;
				if(ad)
					console.log("ad from db " + ad);
					res.render('profile.ejs', {user: req.user, ad});
			});
	});

}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}