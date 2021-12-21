import { APIResponse } from "."

export class Investment {
    associated_account_id: number // idCuenta
    type: InvestmentType // tipoProductoEnumInversion,
    isin: string // isin
    name: string // nombreInversion
    invested_amount: number // importeInicial
    market_value: number // valorMercado
    shares: number // participaciones
    currency_sign: string // divisaValorLiquidativo
    profitYTD: number // rentabilidadYTDFondo
    profitY1: number // rentabilidadYearUnoFondo
    profitY3: number // rentabilidadYearTresFondo
    profitY5: number // rentabilidadYearCincoFondo 
    category: string // categoriaMyInvestor
    url: URL // urlFichaFondo
    last_update: Date // fechaActualizacionRentabilidad

    get profit() { return this.market_value - this.invested_amount }
    get roi() { return this.profit / this.invested_amount }
    get average_buy_price() { return this.invested_amount / this.shares }
    get average_sell_price() { return this.market_value / this.shares }

    constructor(values: APIResponse) {
        this.associated_account_id = values.idCuenta;
        this.type = values.tipoProductoEnumInversion;
        this.isin = values.isin;
        this.name = values.nombreInversion;
        this.invested_amount = values.importeInicial;
        this.market_value = values.valorMercado;
        this.shares = values.participaciones;
        this.currency_sign = values.divisaValorLiquidativo;
        this.profitYTD = values.rentabilidadYTDFondo;
        this.profitY1 = values.rentabilidadYearUnoFondo;
        this.profitY3 = values.rentabilidadYearTresFondo;
        this.profitY5 = values.rentabilidadYearCincoFondo;
        this.category = values.categoriaMyInvestor;
        this.url = new URL(values.urlFichaFondo);
        this.last_update = new Date(values.fechaActualizacionRentabilidad.split('/').reverse().join('/'));
    }

    static is(value: any): value is Investment {
        return typeof value.associated_account_id === 'number' &&
            Object.values(InvestmentType).includes(value.type) &&
            typeof value.isin === 'string' &&
            typeof value.name === 'string' &&
            typeof value.invested_amount === 'number' &&
            typeof value.market_value === 'number' &&
            typeof value.shares === 'number' &&
            typeof value.currency_sign === 'string' &&
            typeof value.profitYTD === 'number' &&
            typeof value.profitY1 === 'number' &&
            typeof value.profitY3 === 'number' &&
            typeof value.profitY5 === 'number' &&
            typeof value.category === 'string' &&
            value.url instanceof URL &&
            typeof value.last_update === 'string'

    }
}

export enum InvestmentType {
    IndexFund = 'FONDOS_INDEXADOS'
}