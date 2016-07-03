import { upgradeAdapter } from "../adapter";

export class Config {
    public janusServer: any = null;
    public janusServerSSL: any = null;
    public janusDebug: boolean = false;
    public httpsAvailable: boolean = true;
    public httpsUrl: any = null;
    public videoThumbnails: boolean = true;
    public joinUnmutedLimit: number = 3;
}

angular.module("janusHangouts.config", [])
.provider("jhConfig", upgradeAdapter.downgradeNg2Provider(Config));
