import { FaceTecSessionResult, FaceTecIDScanResult } from "../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi";
export declare var SampleApp: {
    onLivenessCheckPressed: () => void;
    onEnrollUserPressed: () => void;
    onAuthenticateUserPressed: () => void;
    onPhotoIDMatchPressed: () => void;
    onDesignShowcasePressed: () => void;
    onComplete: (sessionResult: FaceTecSessionResult, idScanResult: FaceTecIDScanResult) => void;
    getLatestEnrollmentIdentifier: () => string;
    clearLatestEnrollmentIdentifier: () => void;
    onVocalGuidanceSettingsButtonPressed: () => void;
    onViewAuditTrailPressed: () => void;
    latestSessionResult: null;
    latestIDScanResult: null;
};
