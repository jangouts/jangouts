import BrowserInfoCtrl from './browser-info.controller';
import jhBrowserInfoDirective from './jh-browser-info.directive';

export default angular.module('janusHangouts.browserInfoComponent', [])
    .controller('BrowserInfoCtrl', BrowserInfoCtrl)
    .directive('jhBrowserInfo', jhBrowserInfoDirective);
