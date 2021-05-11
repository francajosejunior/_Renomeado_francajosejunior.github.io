// Welcome to the minimized FaceTec Device SDK code to launch User Sessions and retrieve 3D FaceScans (for further processing)!
// This file removes comment annotations, as well as networking calls,
// in an effort to demonstrate how little code is needed to get the FaceTec Device SDKs to work.

// NOTE: This example DOES NOT perform a secure Photo ID Scan.  To perform a secure Photo ID Scan, you need to actually make an API call.
// Please see the PhotoIDMatchProcessor file for a complete demonstration using the FaceTec Testing API.

import { FaceTecSDK } from "../../../../core-sdk/FaceTecSDK.js/FaceTecSDK";
import type { FaceTecSessionResult, FaceTecFaceScanResultCallback, FaceTecIDScanResult, FaceTecIDScanResultCallback, FaceTecIDScanProcessor } from "../../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi";

export class PhotoIDMatchProcessor implements FaceTecIDScanProcessor {
  enrollmentIdentifier: string;
  constructor(sessionToken: string, enrollmentIdentifier: string) {
    this.enrollmentIdentifier = enrollmentIdentifier;

    // Core FaceTec Device SDK code that starts the User Session.
    new FaceTecSDK.FaceTecSession(this, sessionToken);
  }

  public processSessionResultWhileFaceTecSDKWaits(sessionResult: FaceTecSessionResult, faceScanResultCallback: FaceTecFaceScanResultCallback) {
    // Normally a User will complete a Session.  This checks to see if there was a cancellation, timeout, or some other non-success case.
    if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
      faceScanResultCallback.cancel();
      return;
    }

    // IMPORTANT:  FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully DOES NOT mean the Enrollment was Successful.
    // It simply means the User completed the Session and a 3D FaceScan was created.  You still need to perform the Enrollment on your Servers.

    // These are the core parameters
    var parameters = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      enrollmentIdentifier: this.enrollmentIdentifier,
    };

    // DEVELOPER TODOS:
    // 1.  Call your own API with the above data and pass into the Server SDK
    // 2.  If enrollment Succeeded, call succeed()
    // 3.  If enrollment Was Not Completed, the User Needs to Retry, so call retry()
    // 4.  cancel() is provided in case you detect issues with your own API
    // 5.  uploadProgress(progress) is provided to control the Progress Bar.

    // faceScanResultCallback.succeed();
    // faceScanResultCallback.retry();
    // faceScanResultCallback.cancel();
    // faceScanResultCallback.uploadProgress(yourUploadProgressFloat)
  }

  public processIDScanResultWhileFaceTecSDKWaits(idScanResult: FaceTecIDScanResult, idScanResultCallback: FaceTecIDScanResultCallback) {
    // Normally a User will complete an ID Scan.  This checks to see if there was a cancellation, timeout, or some other non-success case.
    if (idScanResult.status !== FaceTecSDK.FaceTecIDScanStatus.Success) {
      idScanResultCallback.cancel();
      return;
    }

    // IMPORTANT:  FaceTecSDK.FaceTecIDScanStatus.Success DOES NOT mean the ID Scan was Successful.
    // It simply means the User completed the ID Scan and an IDScan was created.  You still need to perform the ID Scan on your Servers.

    // These are the core parameters
    var parameters: any = {
      idScan: idScanResult.idScan,
      idScanFrontImage: idScanResult.frontImages[0]
    }
    if(idScanResult.backImages[0]) {
      parameters.idScanBackImage = idScanResult.backImages[0];
    }
    parameters.minMatchLevel = 3;
    parameters.enrollmentIdentifier = this.enrollmentIdentifier;

    // DEVELOPER TODOS:
    // 1.  Call your own API with the above data and pass into the Server SDK
    // 2.  If ID Scan Succeeded, call succeed()
    // 3.  If ID Scan did not pass quality, spoofing, or matching checks, the User Needs to Retry, so call retry()
    // 4.  cancel() is provided in case you detect issues with your own API
    // 5.  uploadProgress(progress) is provided to control the Progress Bar.

    // idScanResultCallback.succeed();
    // idScanResultCallback.retry();
    // idScanResultCallback.cancel();
    // idScanResultCallback.uploadProgress(yourUploadProgressFloat)
  }

  public onFaceTecSDKCompletelyDone() {
    // Entrypoint where FaceTec SDKs are done and you can proceed
  }
}
