import { FaceTecIDScanResult, FaceTecSessionResult } from "../../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi";
export declare var SampleAppUtilities: {
    displayStatus: (message: string) => void;
    fadeInMainUIContainer: () => void;
    fadeInMainUIControls: (callback?: (() => void) | undefined) => void;
    fadeOutMainUIAndPrepareForSession: () => void;
    disableControlButtons: () => void;
    enableControlButtons: () => void;
    generateUUId: () => any;
    formatUIForDevice: () => void;
    handleErrorGettingServerSessionToken: () => void;
    setVocalGuidanceSoundFiles: () => void;
    setVocalGuidanceMode: () => void;
    showMainUI: () => void;
    hideLoadingSessionToken: () => void;
    showLoadingSessionToken: () => void;
    isLikelyMobileDevice: () => boolean;
    UI: (elementString: string) => {
        fadeOut: (duration?: any, callback?: any) => void;
        fadeIn: (duration?: any, callback?: any) => void;
        show: () => void;
        hide: () => void;
        scrollTop: (value: number) => void;
        css: (styleProperTies: any) => void;
    };
    showAuditTrailImages: (sessionResult: FaceTecSessionResult | null, idScanResult: FaceTecIDScanResult | null) => void;
};
