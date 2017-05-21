var web = require('most-web');
var cron = require('node-cron');

/**
 * start application
 */
web.current.start({
    port:process.env.PORT ? process.env.PORT: 3000,
    bind:process.env.IP || '127.0.0.1'
});

/*

var merchantBalanceChecker = require('./tasks/merchant-balance-checker.js');

cron.schedule('1 30 4 * * *', function(){//κάθε 04:30:01 το πρωί, κάθε μέρα
    merchantBalanceChecker.checkBalance(function(){
        winston.log("info","Balance check cron process finished!");
    });
});*/
