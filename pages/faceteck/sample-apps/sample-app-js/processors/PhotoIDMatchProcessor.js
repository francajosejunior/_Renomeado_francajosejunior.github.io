//
// Welcome to the annotated FaceTec Device SDK core code for performing secure Photo ID Scan.
//
//
// This is an example self-contained class to perform Photo ID Scans with the FaceTec SDK.
// You may choose to further componentize parts of this in your own Apps based on your specific requirements.
//
var PhotoIDMatchProcessor = /** @class */ (function () {
    function PhotoIDMatchProcessor(sessionToken, sampleAppControllerReference) {
        var _this = this;
        this.latestNetworkRequest = new XMLHttpRequest();
        //
        // Part 18:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
        //
        this.onFaceTecSDKCompletelyDone = function () {
            //
            // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after the Session has completed or you signal the FaceTec SDK with cancel().
            // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
            //
            // If the Photo ID Scan was processed get the success result from isCompletelyDone
            if (_this.latestIDScanResult) {
                _this.success = _this.latestIDScanResult.isCompletelyDone;
            }
            // If enrollment was not successful, clear the enrollment identifier
            if (!_this.success) {
                _this.sampleAppControllerReference.clearLatestEnrollmentIdentifier();
            }
            _this.sampleAppControllerReference.onComplete(_this.latestSessionResult, _this.latestIDScanResult, _this.latestNetworkRequest.status);
        };
        //
        // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
        // In your code, you may not even want or need to do this.
        //
        this.isSuccess = function () {
            return _this.success;
        };
        //
        // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
        // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
        //
        this.success = false;
        this.sampleAppControllerReference = sampleAppControllerReference;
        this.latestSessionResult = null;
        this.latestIDScanResult = null;
        //
        // Part 1:  Starting the FaceTec Session
        //
        // Required parameters:
        // - FaceTecIDScanProcessor:  A class that implements FaceTecIDScanProcessor, which handles the IDScan when the User completes an ID Scan.  In this example, "this" implements the class.
        // - sessionToken:  A valid Session Token you just created by calling your API to get a Session Token from the Server SDK.
        //
        new FaceTecSDK.FaceTecSession(this, sessionToken);
    }
    //
    // Part 2:  Handling the Result of a FaceScan - First part of the Photo ID Scan
    //
    PhotoIDMatchProcessor.prototype.processSessionResultWhileFaceTecSDKWaits = function (sessionResult, faceScanResultCallback) {
        var _this = this;
        this.latestSessionResult = sessionResult;
        //
        // Part 3:  Handles early exit scenarios where there is no FaceScan to handle -- i.e. User Cancellation, Timeouts, etc.
        //
        if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
            console.log("Session was not completed successfully, cancelling.  Session Status: " + FaceTecSDK.FaceTecSessionStatus[sessionResult.status]);
            this.latestNetworkRequest.abort();
            faceScanResultCallback.cancel();
            return;
        }
        // IMPORTANT:  FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully DOES NOT mean the Enrollment was Successful.
        // It simply means the User completed the Session and a 3D FaceScan was created.  You still need to perform the Enrollment on your Servers.
        //
        // Part 4:  Get essential data off the FaceTecSessionResult
        //
        var parameters = {
            faceScan: sessionResult.faceScan,
            auditTrailImage: sessionResult.auditTrail[0],
            lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
            sessionId: sessionResult.sessionId,
            externalDatabaseRefID: this.sampleAppControllerReference.getLatestEnrollmentIdentifier()
        };
        //
        // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
        //
        this.latestNetworkRequest = new XMLHttpRequest();
        this.latestNetworkRequest.open("POST", Config.BaseURL + "/enrollment-3d");
        this.latestNetworkRequest.setRequestHeader("Content-Type", "application/json");
        this.latestNetworkRequest.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
        this.latestNetworkRequest.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(sessionResult.sessionId));
        this.latestNetworkRequest.onreadystatechange = function () {
            //
            // Part 6:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
            // and handle all other responses by cancelling out.
            // You may have different paradigms in your own API and are free to customize based on these.
            //
            if (_this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
                try {
                    var responseJSON = JSON.parse(_this.latestNetworkRequest.responseText);
                    var scanResultBlob = responseJSON.scanResultBlob;
                    // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
                    // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
                    if (responseJSON.wasProcessed === true) {
                        // Demonstrates dynamically setting the Success Screen Message.
                        FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage("Liveness\nConfirmed");
                        // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
                        // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
                        faceScanResultCallback.proceedToNextStep(scanResultBlob);
                    }
                    else {
                        // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
                        console.log("Unexpected API response, cancelling out.");
                        faceScanResultCallback.cancel();
                    }
                }
                catch (_a) {
                    // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
                    console.log("Exception while handling API response, cancelling out.");
                    faceScanResultCallback.cancel();
                }
            }
        };
        this.latestNetworkRequest.onerror = function () {
            // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
            console.log("XHR error, cancelling.");
            faceScanResultCallback.cancel();
        };
        //
        // Part 7:  Demonstrates updating the Progress Bar based on the progress event.
        //
        this.latestNetworkRequest.upload.onprogress = function (event) {
            var progress = event.loaded / event.total;
            faceScanResultCallback.uploadProgress(progress);
        };
        //
        // Part 8:  Actually send the request.
        //
        var jsonStringToUpload = JSON.stringify(parameters);
        this.latestNetworkRequest.send(jsonStringToUpload);
        //
        // Part 9:  For better UX, update the User if the upload is taking a while.  You are free to customize and enhance this behavior to your liking.
        //
        window.setTimeout(function () {
            if (_this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
                return;
            }
            faceScanResultCallback.uploadMessageOverride("Still Uploading...");
        }, 6000);
    };
    //
    // Part 10:  Handling the Result of a IDScan
    //
    PhotoIDMatchProcessor.prototype.processIDScanResultWhileFaceTecSDKWaits = function (idScanResult, idScanResultCallback) {
        var _this = this;
        this.latestIDScanResult = idScanResult;
        //
        // Part 11:  Handles early exit scenarios where there is no IDScan to handle -- i.e. User Cancellation, Timeouts, etc.
        //
        if (idScanResult.status !== FaceTecSDK.FaceTecIDScanStatus.Success) {
            console.log("ID Scan was not completed successfully, cancelling.");
            this.latestNetworkRequest.abort();
            this.latestNetworkRequest = new XMLHttpRequest();
            idScanResultCallback.cancel();
            return;
        }
        // IMPORTANT:  FaceTecSDK.FaceTecIDScanStatus.Success DOES NOT mean the IDScan was Successful.
        // It simply means the User completed the Session and a 3D IDScan was created.  You still need to perform the ID-Check on your Servers.
        // minMatchLevel allows Developers to specify a Match Level that they would like to target in order for success to be true in the response.
        // minMatchLevel cannot be set to 0.
        // minMatchLevel setting does not affect underlying Algorithm behavior.
        var MinMatchLevel = 3;
        //
        // Part 12:  Get essential data off the FaceTecIDScanResult
        //
        var parameters = {
            idScan: idScanResult.idScan,
            sessionId: idScanResult.sessionId,
            externalDatabaseRefID: this.sampleAppControllerReference.getLatestEnrollmentIdentifier(),
            minMatchLevel: MinMatchLevel
        };
        //
        // Sending up front and back images are non-essential, but are useful for auditing purposes, and are required in order for the FaceTec Server Dashboard to render properly.
        //
        if (idScanResult.frontImages && idScanResult.frontImages[0]) {
            parameters.idScanFrontImage = idScanResult.frontImages[0];
        }
        if (idScanResult.backImages && idScanResult.backImages[0]) {
            parameters.idScanBackImage = idScanResult.backImages[0];
        }
        //
        // Part 13:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
        //
        this.latestNetworkRequest = new XMLHttpRequest();
        this.latestNetworkRequest.open("POST", Config.BaseURL + "/match-3d-2d-idscan");
        this.latestNetworkRequest.setRequestHeader("Content-Type", "application/json");
        this.latestNetworkRequest.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
        this.latestNetworkRequest.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(idScanResult.sessionId));
        this.latestNetworkRequest.onreadystatechange = function () {
            //
            // Part 14:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
            // and handle all other responses by cancelling out.
            // You may have different paradigms in your own API and are free to customize based on these.
            //
            if (_this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
                try {
                    var responseJSON = JSON.parse(_this.latestNetworkRequest.responseText);
                    var scanResultBlob = responseJSON.scanResultBlob;
                    // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
                    // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
                    if (responseJSON.wasProcessed === true) {
                        // In v9.2.0+, configure the messages that will be displayed to the User in each of the possible cases.
                        // Based on the internal processing and decision logic about how the flow gets advanced, the FaceTec SDK will use the appropriate, configured message.
                        // Please note that this programmatic API overrides these same Strings that can also be set via our standard, non-programmatic Text Customization & Localization APIs.
                        FaceTecSDK.FaceTecCustomization.setIDScanResultScreenMessageOverrides("Your 3D Face<br/>Matched Your ID", // Successful scan of ID front-side (ID Types with no back-side).
                        "Your 3D Face<br/>Matched Your ID", // Successful scan of ID front-side (ID Types that do have a back-side).
                        "Back of ID Captured", // Successful scan of the ID back-side.
                        "ID Verification Complete", // Successful upload of final IDScan containing User-Confirmed ID Text.
                        "Face Didn't Match<br/>Highly Enough", // Case where a Retry is needed because the Face on the Photo ID did not Match the User's Face highly enough.
                        "ID Document<br/>Not Fully Visible", // Case where a Retry is needed because a Full ID was not detected with high enough confidence.
                        "ID Text Not Legible" // Case where a Retry is needed because the OCR did not produce good enough results and the User should Retry with a better capture.
                        );
                        // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
                        // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
                        // Cases:
                        //   1.  User must re-scan the same side of the ID that they just tried.
                        //   2.  User succeeded in scanning the Front Side of the ID, there is no Back Side, and the User is now sent to the User OCR Confirmation UI.
                        //   3.  User succeeded in scanning the Front Side of the ID, there is a Back Side, and the User is sent to the Auto-Capture UI for the Back Side of their ID.
                        //   4.  User succeeded in scanning the Back Side of the ID, and the User is now sent to the User OCR Confirmation UI.
                        //   5.  The entire process is complete.  This occurs after sending up the final IDScan that contains the User OCR Data.
                        idScanResultCallback.proceedToNextStep(scanResultBlob);
                    }
                    else {
                        // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
                        console.log("Unexpected API response, cancelling out.");
                        idScanResultCallback.cancel();
                    }
                }
                catch (_a) {
                    // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
                    console.log("Exception while handling API response, cancelling out.");
                    idScanResultCallback.cancel();
                }
            }
        };
        this.latestNetworkRequest.onerror = function () {
            // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
            console.log("XHR error, cancelling.");
            idScanResultCallback.cancel();
        };
        //
        // Part 15:  Demonstrates updating the Progress Bar based on the progress event.
        //
        this.latestNetworkRequest.upload.onprogress = function (event) {
            var progress = event.loaded / event.total;
            idScanResultCallback.uploadProgress(progress);
        };
        //
        // Part 16:  Actually send the request.
        //
        var jsonStringToUpload = JSON.stringify(parameters);
        this.latestNetworkRequest.send(jsonStringToUpload);
    };
    return PhotoIDMatchProcessor;
}());
var PhotoIDMatchProcessor = PhotoIDMatchProcessor;
