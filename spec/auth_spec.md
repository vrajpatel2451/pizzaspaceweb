# Need to provide authentication for the user

1. Added types for the user response and payload
2. There will be 3 apis for login, register and profile APIs mentioned in the artifects
3. User will be stored as global store in client and server as well
4. Flow of APIs will be something like that on application inital load if token is available then fetch profile and if not success response the frontend store will be empty state and if page is protected then should be redirected to login screen if public no need of redirecting
5. any page is login protected and redirected to auth screen should be state as router history so once login successfull should redirect to that pirticular screen
6. Login is based on email password
7. please refer other api files to get how we handle APIs
8. Also apiClient needs to be handled right for tokens
9. API spec: @spec/auth_api.md
10. Use MCPs of shadcdn or 21st dev for the good UI examples as it should be eyecatchy
11. Make profile screen where we can see protected screen example
