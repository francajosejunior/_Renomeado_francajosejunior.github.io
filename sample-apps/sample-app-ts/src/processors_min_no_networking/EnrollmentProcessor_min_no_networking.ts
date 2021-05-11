// Welcome to the minimized FaceTec Device SDK code to launch User Sessions and retrieve 3D FaceScans (for further processing)!
// This file removes comment annotations, as well as networking calls,
// in an effort to demonstrate how little code is needed to get the FaceTec Device SDKs to work.

// NOTE: This example DOES NOT perform a secure Enrollment.  To perform a secure Enrollment, you need to actually make an API call.
// Please see the EnrollmentProcessor file for a complete demonstration using the FaceTec Testing API.

import { FaceTecSDK } from "../../../../core-sdk/FaceTecSDK.js/FaceTecSDK.js";
import type { FaceTecSessionResult, FaceTecFaceScanResultCallback, FaceTecFaceScanProcessor } from "../../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi.js";

export class EnrollmentProcessor implements FaceTecFaceScanProcessor {
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
    // 2.  If Enrollment Succeeded, call succeed()
    // 3.  If Enrollment Was Not Completed, the User Needs to Retry, so call retry()
    // 4.  cancel() is provided in case you detect issues with your own API
    // 5.  uploadProgress(progress) is provided to control the Progress Bar.

    // faceScanResultCallback.succeed();
    // faceScanResultCallback.retry();
    // faceScanResultCallback.cancel();
    // faceScanResultCallback.uploadProgress(yourUploadProgressFloat)
  }

  public onFaceTecSDKCompletelyDone() {
    // Entrypoint where FaceTec SDKs are done and you can proceed
  }
}
