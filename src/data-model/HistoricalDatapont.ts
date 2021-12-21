export class HistoricalDatapoint {
    date: Date
    invested_amount: number
    market_value: number

    get profit() { return this.market_value - this.invested_amount }
    get roi() { return this.profit / this.invested_amount }

    constructor(values: any) {
        this.date = new Date(values.fechaPosicionString),
        this.invested_amount = values.inversionPlusvalias,
        this.market_value = values.valorMercado
    }
}