import { Order } from "../../data-model";
import { PrivateAPIMethod } from "../APIMethod";

type Result = { result: Order[] }

function parse(values: any) {
    let object: Result = { result: [] }
    for (const value of values.listadoOperaciones) object.result.push(new Order(value));
    return object;
}

export class OrdersQuery extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/fondos/consulta-ordenes'
    protected method = 'POST'
    protected body = ''

    async request(investment_account_id: number, opts?: OrderQuery) { 
        this.body = JSON.stringify({
            idCuentaValores: investment_account_id,
            fecha_desde: opts?.from_date ? `${opts.from_date.getFullYear()}-${opts.from_date.getMonth()}-${opts.from_date.getDay()}` : "",
            fecha_hasta: opts?.untill_date ? `${opts.untill_date.getFullYear()}-${opts.untill_date.getMonth()}-${opts.untill_date.getDay()}` : "",
            importeDesde: opts?.from_amount || null,
            importeHasta: opts?.upto_amount || null,
            tipoOrdenesEnum: opts?.order_type || OrderTypeQuery.All,
            estadoOrdenesEnum: opts?.order_status || OrderStatusQuery.All,
            descendiente: !opts?.ascending
        });
        return (await this._request(parse as any) as Result).result;
    }
}

export type OrderQuery = Partial<OrderQueryOptions>

export interface OrderQueryOptions {
    from_date: Date
    untill_date: Date
    from_amount: number
    upto_amount: number
    order_type: OrderTypeQuery
    order_status: OrderStatusQuery
    ascending: boolean
}



export enum OrderTypeQuery {
    All = 'TODAS',
    Normal = 'ORDINARIA',
    Recurring = 'PERIODICA'
}

export enum OrderStatusQuery {
    All = 'TODAS',
    Fulfilled = 'COMPLETADAS',
    Pending = 'PENDIENTES',
    Cancelled = 'CANCELADAS',
    Started = 'INICIAL'
}