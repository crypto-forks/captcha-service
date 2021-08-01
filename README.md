# Captcha Service for GSN Paymaster

This project demonstrate how a paymaster (the on-chain contract that pays for the gasless transactions) 
can require an external service (in this case, CAPTCHA)
to approve a transaction.
This way, we can avoid spam from anonymous calling users.

https://www.google.com/recaptcha/admin/site/465756249/settings


The paymaster we use is a VerifyingPaymaster: it accepts any transaction, but only if it gets a signed approval
by the external service that the transaction is legit.

It is deployed as https://captcha-service.netlify.app/validate-captcha

For a sample project using it, please see https://github.com/opengsn/ctf-react/tree/captcha-paymaster

        
### Technical Application flow

This is what happens under the hood:

1. The user has to click the "I'm not a robot" button. In the background, 
    a new captcha response is created.
2. When clicking the "Action" button, the RelayProvider finds a relayer, and prompt the user to sign the request.
3. The provider calls asyncApprovalData callback, to get the request signed.
4. Then the callback calls the captcha validation service with the relay request.
5. The validation service uses Google API to validate the captcha, and signs the user's data.
6. The RelayProvider can now use the returned "approvalData", and pass it with the request to the relayer.
7. When processing this request, the paymaster validates the signature is valid.
8. The paymaster approves the request, and the transaction can be processed.

