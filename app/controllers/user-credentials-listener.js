/**
 * MOST Web Framework Model Listener
 * Created by kbarbounakis on 2015-11-20.
 */

var web = require('most-web');
/**
 * @param {DataEventArgs} event
 * @param {function(Error=)} callback
 */
exports.afterSave = function (event, callback) {
    try {
        if (event.state!==1) {
            return callback();
        }
        var context = event.model.context;
        event.model.where('id').equal(event.target.id).select('external').silent().value().then(function(value) {
            if (value) { return callback(); }
            //search for creds
            var credentials = context.model('UserCredential');
            if (web.common.isNullOrUndefined(credentials)) { return callback(); }
            credentials.where('id').equal(event.target.id).silent().count().then(function(count) {
                if (count==1) { return callback(); }
                //create credentials
                var creds = {
                    id:event.target.id,
                    pwdLastSet: true,
                    $state:1
                };
                credentials.silent().save(creds, function(err) {
                    if (err) {
                        web.common.log(err);
                        var er = new Error('An error occured while updating user data.');
                        return callback(er);
                    }
                    return callback();
                });
            }).catch(function(err) {
                web.common.log(err);
                var er = new Error('An error occured while getting post update data.');
                callback(er);
            }) ;
        }).catch(function(err) {
            web.common.log(err);
            var er = new Error('An error occured while executing post update operations.');
            callback(er);
        });
    }
    catch (e) {
        callback(e)
    }
};