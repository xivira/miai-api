import { PrivateAPIMethod } from "../APIMethod";
import { APIResponse } from "../../data-model";

export class RequestFnToken extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/cuentas/solicitarPosiciones'
    protected method = 'GET'
    protected body = ''

    async request() {
        return await this._request(FnResult);
    }
}

export class FnResult {
    fn_otp_id: string
    requested_digit_0_postition: number
    requested_digit_1_postition: number 

    constructor(values: APIResponse) {
        this.fn_otp_id = values.claveAcceso
        this.requested_digit_0_postition = Number(values.posicionFirma1)
        this.requested_digit_1_postition = Number(values.posicionFirma2) 
    }
}