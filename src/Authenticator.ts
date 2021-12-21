import { MyInvestorAPI } from "./API";
import { MyInvestorUserData } from "./UserDataHandler";

export class MyInvestorAuthenticator {
    private data: MyInvestorUserData
    private opt_request_id: string

    constructor(data: MyInvestorUserData) { this.data = data }

    async getToken(): Promise<Auth | void> {
        let response = await MyInvestorAPI.requestToken(this.data.user, this.data.password, this.data.device_id);

        if (response.success) {
            if (response.access_token) return new Auth(response.access_token);
            if (response.opt_request_code) { this.opt_request_id = response.opt_request_code; return; }
        }
        throw response.failure_reason || 'unknown reason'
    }

    async validateOTP(code: string): Promise<Auth> {
        if (!this.opt_request_id) throw 'No OTP validation in process'
        let response = await MyInvestorAPI.validateAuthOTP(this.data.user, this.data.password, this.data.device_id, this.opt_request_id, code);
        if (response.success && response.access_token) return new Auth(response.access_token);
        throw response.failure_reason || 'unknown reason'
    }
}

/** The Auth class is a Wrapper over a simple string to indicate API users must get the token from `MyInvestorAuthenticator` */
export class Auth { constructor(public readonly token: string) { } }