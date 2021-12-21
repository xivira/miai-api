import { PublicAPIMethod } from "../APIMethod";
import { APIResponse } from "../../data-model";

export class RequestToken extends PublicAPIMethod {
    protected path = '/myinvestor-server/rest/public/usuarios/login-psd2'
    protected method = 'POST'
    protected body = ''

    async request(user: string, password: string, device_id: string) {
        this.body = JSON.stringify({
            usuario: user,
            contrasena: password,
            deviceId: device_id,
            tipoLogin: "USUARIO"
        });
        return await this._request(TokenResult);
    }
}

export class TokenResult {
    success: boolean
    access_token?: string
    opt_request_code?: string
    failure_reason?: string

    constructor(values: APIResponse) {
        if (values.loginFinalizadoDto) {
            this.success = true;
            this.access_token = values.loginFinalizadoDto.token;
        } else if (values.generarOTPPSD2ResponseDto) {
            this.success = true;
            this.opt_request_code = values.generarOTPPSD2ResponseDto.codigoPeticionOtp;
        } else {
            this.success = false;
            this.failure_reason = values.descripcion;
        }

    }
}