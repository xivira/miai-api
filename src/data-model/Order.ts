import { APIResponse } from ".";

export class Order {
    order_date: Date // fechaOrden // * new Date("13/12/2021".split('/').reverse().join('/'))
    order_id: string // referencia // * 
    isin: string // codIsin // * 
    order_type: string // nombreTipoOperacion // * tipoOperacion
    cash_amount: number // efectivo // * 
    state_code: string // codigoEstado // * estado
    titles: number // titulos // * ???
    account_code: string // codigoCuenta // * used for cancelling order
    fund_name: string // nombreFondo // *
    currency: string // divisa // *
    shares?: number // participaciones // * assumed to be shared, may be undefined
    cancellable?: boolean // ordenAnulable // * not shared but default unknown

    constructor(values: APIResponse) {
        const date_data: [number, number, number] = values?.fechaOrden?.split('/').reverse().map(Number) || []
        const hour_data: [number?, number?, number?] = values?.horaOrden?.split(':').map(Number) || []
        let date: [number, number, number, number?, number?, number?]  = [...date_data, ...hour_data]
        this.order_date = new Date(...date)
        this.order_id = values.referencia
        this.isin = values.codIsin
        this.order_type = values.nombreTipoOperacion || values.tipoOperacion
        this.cash_amount = values.efectivo
        this.state_code = values.codigoEstado || values.estado // TO ENUM
        this.titles = values.titulos
        this.account_code = values.codigoCuenta
        this.fund_name = values.nombreFondo
        this.currency = values.divisa
        this.shares = values.participaciones
        this.cancellable = values.ordenAnulable
    }
}