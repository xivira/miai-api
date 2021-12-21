import { APIResponse, Investment } from "..";

export class AccountInvestments {
    investments: Investment[]; // mapaInversiones.FONDOS_INDEXADOS.inversiones
    market_value: number // valorMercado
    invested_amount: number // totalInvertido

    get profit() { return this.market_value - this.invested_amount }
    get roi() { return this.profit / this.invested_amount }


    constructor(values: APIResponse) {
        this.invested_amount = values.totalInvertido;
        this.market_value = values.valorMercado;
        this.investments = [];
        for(const inv of values.mapaInversiones.FONDOS_INDEXADOS.inversiones)
            this.investments.push(new Investment(inv))
    }
}