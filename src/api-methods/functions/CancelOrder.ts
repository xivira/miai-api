import { FnOTPReason } from "./ValidateFnOTP";
import { PrivateWithIDAPIMethod } from "../APIMethod";
import { APIResponse, Order } from "../../data-model";

export class CancelOrder extends PrivateWithIDAPIMethod {
    protected path = '/myinvestor-server/rest/protected/operaciones/cancelarOrden'
    protected method = 'POST'
    protected body = ''


    /**
     * @param savings_account This param is obtained from {@link AllSavingsAccounts} 
     * @param opt_code This param is obtained from {@link ValidateFnOTP} 
     */
    async request(savings_account_id: number, order: Order, opt_code: string) {
        this.body = JSON.stringify({
            idCuentaValores: savings_account_id,
            idCuentaPensiones: null,
            codigoIsin: order.isin,
            referenciaOperacion: order.order_id,
            referenciaTraspaso: "",
            importe: order.cash_amount.toString(),
            tipoOperacion: "20",
            codigoCuenta: order.account_code,
            validarPosicionesFirmaYOtpDto: {
                datosVerificacionOTPDto: null,
                deviceId: this.device_id,
                origenOTPEnum: FnOTPReason.CancelOrder,
                codigoVerificacionFirma: opt_code,
                codigoInterno: null,
                usuario: null
            },
            cancelarTraspaso: false
        });
        return await this._request(CancelResult);
    }
}

export class CancelResult {
    success: boolean
    failure_reason?: string

    constructor(values: APIResponse) {
        if (Number(values.codigoRespuesta) === 0) {
            this.success = true;
        } else {
            this.success = false;
            this.failure_reason = values.respuesta;
        }

    }
}