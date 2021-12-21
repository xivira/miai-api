import { APIResponse } from "../../data-model";
import { PrivateWithIDAPIMethod } from "../APIMethod";

export class ValidateFnOTP extends PrivateWithIDAPIMethod {
    protected path = '/myinvestor-server/rest/protected/psd2/firmaOTP'
    protected method = 'POST'
    protected body = ''


    /** @param fn_otp_id This param must gan be obtained from {@link RequestFnToken} */
    async request(reason: FnOTPReason, fn_otp_id: string, digit_0: string, digit_1: string) {
        this.body = JSON.stringify({
            validarPosicionesFirmaDto: {
                numeroDniNif: null,
                paisFiscal: null,
                tokenSeguridad: fn_otp_id,
                valorPosicionFirma1: digit_0,
                valorPosicionFirma2: digit_1,
                codigoInterno: null,
                usuario: null
            },
            deviceId: this.device_id,
            origenOTPEnum: reason,
            plataforma: "browser",
            codigoInterno: null,
            usuario: null
        });
        return await this._request(Result);
    }
}

export class Result {
    success: boolean
    opt_code?: string
    failure_reason?: string

    constructor(values: APIResponse) {
        if (values.codVerificacionFirma) {
            this.success = true;
            this.opt_code = values.codVerificacionFirma
        } else {
            this.success = false;
            this.failure_reason = values.respuesta
        }
    }
}

export enum FnOTPReason {
    Invest = "INVERTIR",
    CancelOrder = "CANCELAR_ORDEN"
}