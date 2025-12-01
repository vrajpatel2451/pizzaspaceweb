## Auth API

    ```code
    [POST] /user/login
        Request body: LoginUserPayload
        Response: APIResponse<UserResponseWithToken>
    ```
    ```code
    [POST] /user/register
        Request body: RegisterUserPayload
        Response: APIResponse<UserResponseWithToken>
    ```
    ```code
    [GET] /user/profile
        Response: APIResponse<UserResponse>
    ```

See @types/user.ts for types
