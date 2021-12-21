import { APIResponse } from "../../data-model";
import { PublicAPIMethod } from "../APIMethod";

export class ValidateAuthOTP extends PublicAPIMethod {
    protected path = '/myinvestor-server/rest/public/usuarios/validar-otp'
    protected method = 'POST'
    protected body = ''

    async request(user: string, password: string, device_id: string, request_id: string, opt_code: string) { 
        this.body = JSON.stringify({
            usuario: user,
            deviceId: device_id,
            tipoLogin: "USUARIO",
            contrasena: password,
            plataforma: null,
            codigoPeticionOTP: request_id,
            codigoOTPRecibido: opt_code,
            cotitular: false
        });
        return await this._request(OTPResult); 
    }
}

export class OTPResult {
    success: boolean
    access_token?: string
    failure_reason?: string

    constructor(values: APIResponse) {
        if (values.token) {
            this.success = true;
            this.access_token = values.token;
        } else {
            this.success = false;
            this.failure_reason = values.descripcion;
        }

    }
}