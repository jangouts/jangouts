import { upgradeAdapter } from "../adapter";
import { FooterComponent } from "./footer.component";

export default angular.module("janusHangouts.footerComponent", [])
  .directive("jhFooter",
             <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(FooterComponent));
