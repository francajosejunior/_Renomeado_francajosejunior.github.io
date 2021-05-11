import type { FaceTecSessionResult, FaceTecFaceScanResultCallback, FaceTecFaceScanProcessor } from "../../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi.js";
export declare class LivenessCheckProcessor implements FaceTecFaceScanProcessor {
    latestNetworkRequest: XMLHttpRequest;
    latestSessionResult: FaceTecSessionResult | null;
    success: boolean;
    sampleAppControllerReference: any;
    constructor(sessionToken: string, sampleAppControllerReference: any);
    processSessionResultWhileFaceTecSDKWaits(sessionResult: FaceTecSessionResult, faceScanResultCallback: FaceTecFaceScanResultCallback): void;
    onFaceTecSDKCompletelyDone(): void;
    isSuccess(): boolean;
}
