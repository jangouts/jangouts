import { upgradeAdapter } from '../../adapter';
import { FooterComponent } from './jh-footer.directive';

export default angular.module('janusHangouts.footerComponent', [])
  .directive('jhFooter',
             <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(FooterComponent));
