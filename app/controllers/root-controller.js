/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */

var util = require('util'),
    fs = require('fs'),
    https = require('https');
    web = require('most-web'),
    async = require('async'),
    mailer = require('most-web-mailer'),
    path = require('path');

/**
 * Root HTTP Controller class
 * @constructor
 * @augments {HttpController}
 */
function RootController() {
    //
}
util.inherits(RootController, web.controllers.HttpBaseController);

RootController.prototype.index = function(callback)
{
    callback(null, this.view());
};

function return_() {
    return this.context.params.attr('returnUrl') || this.context.params.attr('returnUrl') || '/';
}

RootController.prototype.login = function(callback)
{
    var self = this;
    try {
        self.context.handle('GET', function() {
            return callback(null, self.view());
        }).handle('POST', function() {
            try {
                //validate anti-forgery token
                self.context.validateAntiForgeryToken();
                //try to login
                var credentials = self.context.params;
                //get auth service
                var auth = self.context.application.service('$auth')(self.context);
                auth.login(credentials.username, credentials.password, function(err) {
                    if (err) {
                        web.common.log(err);
                        if ((err instanceof web.common.HttpUnauthorizedException) || (err instanceof web.common.HttpForbiddenException)) {
                            return callback(null, self.view({message:err.message, status:err.status, substatus: err.substatus}));
                        }
                        else {
                            return callback(null, self.view({message:'Login failed due to server error. Please try again or contact system administrator.'}));
                        }
                    }
                    return callback(null, self.redirect(return_.call(self)));
                });
            }
            catch(err) {
                return callback(err);
            }
        }).unhandle(function() {
            return callback(new web.common.HttpMethodNotAllowed());
        });
    }
    catch(err) {
        return callback(err);
    }
};

RootController.prototype.logout = function(callback)
{
    var self = this;
    try {
        self.context.application.setAuthCookie(self.context, 'anonymous');
        return callback(null, self.redirect(return_.call(self)));
    }
    catch(err) {
        return callback(err);
    }

};

RootController.prototype.checkSites = function(callback)
{
    var self = this;
    try {
        self.context.handle('GET', function() {
            return callback(new web.common.HttpMethodNotAllowed());
        }).handle('POST', function() {
            var sites = self.context.request.body.sites;

            async.eachSeries(sites,
                function(site,cb){
                    https.get(site.url, function (res) {
                        if(res.statusCode == 200){
                            console.log("SUCCESS Fetching "+site.url);
                            return cb();
                        }
                    }).on('error', function(e) {
                        console.log("ERROR! cannot retrieve "+site.url);
                        _sendMail(cb,site, self.context);
                    });
                },
                function done(error){
                    if(error){
                        return callback(null,self.result(error));
                    }
                    else{
                        return callback(null,self.result({sites:"OK"}));
                    }
                });
        }).unhandle(function() {
            return callback(new web.common.HttpMethodNotAllowed());
        });
    }
    catch(err) {
        return callback(err);
    }
}

function _sendMail(cb, site, context){
    var data = {
        site:site
    }

    mailer.getMailer(context).transporter({
        service:'gmail',
        auth:{
            user:process.env.mail,
            pass:process.env.pass
        }
    }).template("site-down").subject("SITE DOWN").to(process.env.to).cc(process.env.cc).send(data, function (err, result) {
        if (err) {
            console.log("error", err);
            return cb(err);
        }
        console.log("Mail sent for "+site.url);
        return cb();
    });
}

if (typeof module !== 'undefined') module.exports = RootController;


