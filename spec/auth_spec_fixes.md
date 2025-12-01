# Fixes in auth flow

## First of all why I always have to reiterate 4-5 times to complete flow? Why u do not test e2e flow?

1. When signup it always go to login page so what I need let me clarify again

   - Suppose I am in xyz route so if that route is protected then it should go to login page with params redirectTo then if I click signup then that redirect to should be carie forward to signup page so that if I create account that route can be visible.

     - I went to profile page it is auth protected and I do not have account so that profile page redirect me to login with redirect to as login page then I click on register then that redirectTo as profile should be navigated like I should land on profile page if that exists on redirectTo

2. Auth protection not working I just created an account and went to profile page which shown as account/settings in header it is redirecting me to login page. which is not good. even if I redirect to /profile by route it is redirecting me to login page

3. I told u to manage auth state (token) on both client and server side but u kept frontend only which is worse for me

## UI changes I need

1. Need more elegance UI why headings and all are simple why u not follow design guideline. see my homepage sections or menu page header
2. do not need any line of or continue with in login page
3. Register page layout changes are same as login except or continue with
4. Need eyecatchy UI

**PLEASE NEED PRODUCTION LEVEL OF E2E TESTING IF NOT PASSED PLEASE FIX IT TILL, I AM SICK AND TIRED OF RE-PROMPTING**
