//
// Welcome to the annotated FaceTec Device SDK core code for performing secure Authentication against a previously enrolled user.
//
//
// This is an example self-contained class to perform Authentication with the FaceTec SDK.
// You may choose to further componentize parts of this in your own Apps based on your specific requirements.
//
var AuthenticateProcessor = /** @class */ (function () {
    function AuthenticateProcessor(sessionToken, sampleAppControllerReference) {
        this.latestNetworkRequest = new XMLHttpRequest();
        //
        // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
        // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
        //
        this.success = false;
        this.sampleAppControllerReference = sampleAppControllerReference;
        this.latestSessionResult = null;
        //
        // Part 1:  Starting the FaceTec Session
        //
        // Required parameters:
        // - FaceTecFaceScanProcessor:  A class that implements FaceTecFaceScanProcessor, which handles the FaceScan when the User completes a Session.  In this example, "this" implements the class.
        // - sessionToken:  A valid Session Token you just created by calling your API to get a Session Token from the Server SDK.
        //
        new FaceTecSDK.FaceTecSession(this, sessionToken);
    }
    //
    // Part 2:  Handling the Result of a FaceScan
    //
    AuthenticateProcessor.prototype.processSessionResultWhileFaceTecSDKWaits = function (sessionResult, faceScanResultCallback) {
        var _this_1 = this;
        var _this = this;
        _this.latestSessionResult = sessionResult;
        //
        // Part 3:  Handles early exit scenarios where there is no FaceScan to handle -- i.e. User Cancellation, Timeouts, etc.
        //
        if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
            console.log("Session was not completed successfully, cancelling.  Session Status: " + FaceTecSDK.FaceTecSessionStatus[sessionResult.status]);
            this.latestNetworkRequest.abort();
            faceScanResultCallback.cancel();
            return;
        }
        // IMPORTANT:  FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully DOES NOT mean the Authenticate was Successful.
        // It simply means the User completed the Session and a 3D FaceScan was created.  You still need to perform the Authentication on your Servers.
        //
        // Part 4:  Get essential data off the FaceTecSessionResult
        //
        var parameters = {
            sessionId: sessionResult.sessionId,
            faceScan: sessionResult.faceScan,
            externalDatabaseRefID: this.sampleAppControllerReference.getLatestEnrollmentIdentifier(),
            lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
            auditTrailImage: sessionResult.auditTrail[0]
        };
        //
        // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
        //
        this.latestNetworkRequest = new XMLHttpRequest();
        this.latestNetworkRequest.open("POST", Config.BaseURL + "/match-3d-3d");
        this.latestNetworkRequest.setRequestHeader("Content-Type", "application/json");
        this.latestNetworkRequest.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
        this.latestNetworkRequest.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(sessionResult.sessionId));
        this.latestNetworkRequest.onreadystatechange = function () {
            //
            // Part 6:  In our Sample, we evaluate a boolean response and treat true as success, false as "User Needs to Retry",
            // and handle all other non-nominal responses by cancelling out.  You may have different paradigms in your own API and are free to customize based on these.
            //
            if (_this_1.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
                try {
                    var responseJSON = JSON.parse(_this_1.latestNetworkRequest.responseText);
                    if (responseJSON.success === true) {
                        // CASE:  Success!  The Authentication was performed and the user matched the previously enrolled user.
                        //
                        // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
                        // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
                        //
                        _this_1.success = true;
                        // Demonstrates dynamically setting the Success Screen Message.
                        FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage("Authenticated");
                        faceScanResultCallback.succeed();
                    }
                    else if (responseJSON.success === false) {
                        // CASE:  In our Sample code, "success" being present and false means that the User Needs to Retry.
                        // Real Users will likely succeed on subsequent attempts after following on-screen guidance.
                        // Attackers/Fraudsters will continue to get rejected.
                        console.log("User needs to retry, invoking retry.");
                        var retryScreenType = responseJSON.retryScreenEnumInt === 1 ? FaceTecSDK.FaceTecRetryScreen.ShowCameraFeedIssueScreenIfRejected : FaceTecSDK.FaceTecRetryScreen.ShowStandardRetryScreenIfRejected;
                        faceScanResultCallback.retry(retryScreenType);
                    }
                    else {
                        // CASE:  UNEXPECTED response from API.  Our Sample Code keys of a success boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
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
        this.latestNetworkRequest.upload.onprogress = function name(event) {
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
            if (_this_1.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
                return;
            }
            faceScanResultCallback.uploadMessageOverride("Still Uploading...");
        }, 6000);
    };
    //
    // Part 10:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
    //
    AuthenticateProcessor.prototype.onFaceTecSDKCompletelyDone = function () {
        var _this = this;
        //
        // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after you signal the FaceTec SDK with success() or cancel().
        // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
        //
        this.sampleAppControllerReference.onComplete(_this.latestSessionResult, null);
    };
    //
    // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
    // In your code, you may not even want or need to do this.
    //
    AuthenticateProcessor.prototype.isSuccess = function () {
        return this.success;
    };
    return AuthenticateProcessor;
}());
var AuthenticateProcessor = AuthenticateProcessor;
