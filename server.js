var web = require('most-web');
var cron = require('node-cron');
var winston = require('winston');
/**
 * start application
 */
web.current.start({
    port:process.env.PORT ? process.env.PORT: 3000,
    bind:process.env.IP || '127.0.0.1'
});

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: './logs/siteCheckerLog.log' })
    ]
});

var parseArgs  = require('minimist');

var args = parseArgs(process.argv.slice(2), {string:true});
if(!args.mail || !args.pass || !args.to || !args.cc){
    winston.exception("Invalid arguments!");
    process.exit()
}
else {
    process.env.mail = args.mail;
    process.env.pass = args.pass;
    process.env.cc = args.cc;
    process.env.to = args.to;
}


var requestConfig = {
    url:"/Root/checkSites.json",
    method:"POST",
    body:{
        "sites":[
            {url:"http://chaikalis.gr"},
            {url:"http://english-superfast.com/elearning"},
            {url:"http://english-superfast.com/elearning-arab"},
            {url:"http://english-superfast.com/elearning-rus"},
            {url:"http://english-superfast.comaaaa"}
        ]
    }
}

cron.schedule('* */30 * * * *', function(){ //every 15 minutes
    web.current.executeRequest(requestConfig, function (error,resp) {
        var res = JSON.parse(resp.body);
        logger.info(res);
    });
});
