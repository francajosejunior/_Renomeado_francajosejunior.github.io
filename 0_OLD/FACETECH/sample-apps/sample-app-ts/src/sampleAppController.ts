import { Config } from "../../../Config";
import { FaceTecSDK } from "../../../core-sdk/FaceTecSDK.js/FaceTecSDK";
import { LivenessCheckProcessor } from "./processors/LivenessCheckProcessor";
import { EnrollmentProcessor } from "./processors/EnrollmentProcessor";
import { AuthenticateProcessor } from "./processors/AuthenticateProcessor";
import { SampleAppUtilities } from "./utilities/SampleAppUtilities";
import { PhotoIDMatchProcessor } from "./processors/PhotoIDMatchProcessor";
import { ThemeHelpers } from "./utilities/ThemeHelpers";
import { FaceTecSessionResult, FaceTecIDScanResult } from "../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi";

export var SampleApp = (function() {
  var latestEnrollmentIdentifier = "";
  var latestProcessor: LivenessCheckProcessor | EnrollmentProcessor | AuthenticateProcessor | PhotoIDMatchProcessor;
  var latestSessionResult: FaceTecSessionResult | null = null;
  var latestIDScanResult: FaceTecIDScanResult | null = null;

  // Wait for onload to be complete before attempting to access the Browser SDK.
  window.onload = function() {

    // Set a the directory path for other FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory("../../core-sdk/FaceTecSDK.js/resources");

    // Set the directory path for required FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory("../../core-sdk/FaceTec_images");

    // Set your FaceTec Device SDK Customizations.
    FaceTecSDK.setCustomization(Config.retrieveConfigurationWizardCustomization(FaceTecSDK));

    // Initialize FaceTec Browser SDK and configure the UI features.
    Config.initializeFromAutogeneratedConfig(FaceTecSDK, function(initializedSuccessfully: boolean) {
      if(initializedSuccessfully) {
        SampleAppUtilities.enableControlButtons();
        SampleAppUtilities.setVocalGuidanceSoundFiles();
      }
      SampleAppUtilities.displayStatus(FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(FaceTecSDK.getStatus()));
    });

    SampleAppUtilities.formatUIForDevice();
  };

  // Initiate a 3D Liveness Check.
  function onLivenessCheckPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    getSessionToken(function(sessionToken) {
      latestProcessor = new LivenessCheckProcessor(sessionToken as string, SampleApp as any);
    });
  }

  // Initiate a 3D Liveness Check, then storing the 3D FaceMap in the Database, also known as "Enrollment".  A random enrollmentIdentifier is generated each time to guarantee uniqueness.
  function onEnrollUserPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the Enrollment.
    getSessionToken(function(sessionToken) {
      latestEnrollmentIdentifier = "browser_sample_app_" + SampleAppUtilities.generateUUId();
      latestProcessor = new EnrollmentProcessor(sessionToken as string, SampleApp as any);
    });
  }

  // Perform 3D to 3D Authentication against the Enrollment previously performed.
  function onAuthenticateUserPressed() {

    // For demonstration purposes, verify that we have an enrollmentIdentifier to Authenticate against.
    if(latestEnrollmentIdentifier.length === 0){
      SampleAppUtilities.displayStatus("Please enroll first before trying authentication.");
    }
    else {
      SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

      // Get a Session Token from the FaceTec SDK, then start the 3D to 3D Matching.
      getSessionToken(function(sessionToken) {
        latestProcessor = new AuthenticateProcessor(sessionToken as string, SampleApp as any);
      });
    }
  }

  // Perform a 3D Liveness Check, then an ID Scan, then Match the 3D FaceMap to the ID Scan.
  function onPhotoIDMatchPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.  On Success, ID Scanning will start automatically.
    getSessionToken(function(sessionToken) {
      latestEnrollmentIdentifier = "browser_sample_app_" + SampleAppUtilities.generateUUId();
      latestProcessor = new PhotoIDMatchProcessor(sessionToken as string, SampleApp as any);
    });
  }

  // Show the final result with the Session Review Screen.
  function onComplete(sessionResult: FaceTecSessionResult, idScanResult: FaceTecIDScanResult) {
    latestSessionResult = sessionResult;
    latestIDScanResult = idScanResult;

    if(latestProcessor.isSuccess()) {
      // Show successful message to screen
      SampleAppUtilities.displayStatus("Success");
    }
    else {
      // Show early exit message to screen.  If this occurs, please check logs.
      SampleAppUtilities.displayStatus("Session exited early, see logs for more details. Latest getStatus(): " + FaceTecSDK.getStatus());
    }

    SampleAppUtilities.showMainUI();
  }

  // Set a new customization for FaceTec Browser SDK.
  function onDesignShowcasePressed(){
    ThemeHelpers.showNewTheme();
  }

  function onVocalGuidanceSettingsButtonPressed() {
    SampleAppUtilities.setVocalGuidanceMode();
  }

  // Display audit trail images captured from user's last FaceTec Browser SDK Session (if available).
  function onViewAuditTrailPressed(){
    SampleAppUtilities.showAuditTrailImages(latestSessionResult, latestIDScanResult);
  }

  // Get the Session Token from the server
  function getSessionToken(sessionTokenCallback: (sessionToken?: string)=>void) {
    var XHR = new XMLHttpRequest();
    XHR.open("GET", Config.BaseURL + "/session-token");
    XHR.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    XHR.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(""));
    XHR.onreadystatechange = function() {
      if(this.readyState === XMLHttpRequest.DONE) {
        var sessionToken = "";
        try {
          // Attempt to get the sessionToken from the response object.
          sessionToken = JSON.parse(this.responseText).sessionToken;
          // Something went wrong in parsing the response. Return an error.
          if(typeof sessionToken !== "string") {
            onServerSessionTokenError();
            return;
          }
        }
        catch {
          // Something went wrong in parsing the response. Return an error.
          onServerSessionTokenError();
          return;
        }
        SampleAppUtilities.hideLoadingSessionToken();
        sessionTokenCallback(sessionToken);
      }
    };

    // Wait 3s, if the request is not completed yet, show the session token loading screen
    window.setTimeout( () => {
      if(XHR.readyState !== XMLHttpRequest.DONE) {
        SampleAppUtilities.showLoadingSessionToken();
      }
    }, 3000);

    XHR.onerror = function() {
      onServerSessionTokenError();
    };
    XHR.send();
  }

  function onServerSessionTokenError() {
    SampleAppUtilities.handleErrorGettingServerSessionToken();
  }

  function getLatestEnrollmentIdentifier() {
    return latestEnrollmentIdentifier;
  }

  function clearLatestEnrollmentIdentifier() {
    latestEnrollmentIdentifier = "";
  }


  return {
    onLivenessCheckPressed,
    onEnrollUserPressed,
    onAuthenticateUserPressed,
    onPhotoIDMatchPressed,
    onDesignShowcasePressed,
    onComplete,
    getLatestEnrollmentIdentifier,
    clearLatestEnrollmentIdentifier,
    onVocalGuidanceSettingsButtonPressed,
    onViewAuditTrailPressed,
    latestSessionResult: latestSessionResult,
    latestIDScanResult: latestIDScanResult
  };

})();