/**
 * Place application controllers here
 */
angular.module('main.controllers', []);
/**
* Place application directives here
*/
angular.module('main.directives', []);
/**
 * Place application filters here
 */
angular.module('main.filters', []);
/**
 * Application initialization
 */
var app = angular.module('main',['ngRoute','main.directives', 'main.controllers',  'main.filters']);