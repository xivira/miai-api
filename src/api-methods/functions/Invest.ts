import { FnOTPReason } from "./ValidateFnOTP";
import { PrivateWithIDAPIMethod } from "../APIMethod";
import { APIResponse, Product } from "../../data-model";

export class Invest extends PrivateWithIDAPIMethod {
    protected path = '/myinvestor-server/rest/protected/operaciones/invertir'
    protected method = 'POST'
    protected body = ''


    /**
     * @param savings_account This param is obtained from {@link AllSavingsAccounts} 
     * @param opt_code This param is obtained from {@link ValidateFnOTP} 
     */
    async request(savings_account_id: number, fund: Product, cash_amount: number, opt_code: string) {
        this.body = JSON.stringify({
            idCuentaValores: savings_account_id,
            origenOperacionEnum: "FONDOS_INDEXADOS",// TODO: this enum
            importe: cash_amount.toFixed(2),
            participaciones: (cash_amount / fund.latest_price_data.price).toFixed(2),
            isinFondoDestino: fund.isin,
            idFondo: fund.product_id,
            validarPosicionesFirmaYOtpDto: {
                datosVerificacionOTPDto: null,
                deviceId: this.device_id,
                origenOTPEnum: FnOTPReason.Invest,
                codigoVerificacionFirma: opt_code,
                codigoInterno: null,
                usuario: null
            },
            divisa: null,
            conPeriodo: false,
            periodicidadEnum: null,
            diaMes: null,
            fechaVigencia: null,
            inversionConEfectivo: true,
            evaluacionConveniencia: null
        });
        return await this._request(InvestResult);
    }
}

export class InvestResult {
    success: boolean
    failure_reason?: string
    order_id?: string

    constructor(values: APIResponse) {
        if (Number(values.codigoRespuesta) === 0) {
            this.success = true;
            this.order_id = values.referenciaOrden;
        } else {
            this.success = false;
            this.failure_reason = values.respuesta;
        }

    }
}