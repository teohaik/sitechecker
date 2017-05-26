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
            process.env.cc = "chaikalis@uom.gr";
            process.env.to = "teohaik@gmail.com";
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
            var res = JSON.parse(resp.body);
            expect(res.sites).to.not.be.undefined;
            expect(res.sites).to.be.equal("OK");
            done(error);
        });
    }).timeout(15000);

});