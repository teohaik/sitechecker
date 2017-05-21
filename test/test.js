/**
 * Created by Thodoris on 21-May-17.
 */

var chai = require('chai');
var fs = require("fs");
var web = require("most-web");
var expect = chai.expect; // we are using the "expect" style of Chai


describe('Site auto checker', function () {

    before(function (done) {
        web.current.execute(function (context) {
            requestConfig = {
                url:"/Root/checkSites.json",
                method:"POST",
                body:{
                    "sites":[
                        {url:"https://github.com"},
                        {url:"https://gitskatanatafashub.com"}
                    ]
                }
            }
            done();
        });
    });

    it('check sites', function (done) {
        web.current.executeRequest(requestConfig, function (error,resp) {
            expect(resp.statusCode).to.be.equal(200);
            done(error);
        });
    }).timeout(15000);

});