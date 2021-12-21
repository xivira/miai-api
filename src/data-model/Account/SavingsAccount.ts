import { APIResponse, Investment } from "..";
import { CheckingAccount } from "./CheckingAccount";

// /rest/protected/inversiones?soloActivas=false
export class SavingsAccount extends CheckingAccount {
    // these keys will not be present
    iban: undefined
    recurring_payments_greater_than_balance: undefined 
    // replace associated_account_id  -> idCuentaEfectivo

    investments: Investment[];// inversionesCuentaValores.FONDOS_INDEXADOS.inversionesDtoList
    market_value: number // valorMercado
    invested_amount: number // totalInvertido

    get profit() { return this.market_value - this.invested_amount }
    get roi() { return this.profit / this.invested_amount }


    constructor(values: APIResponse) {
        super(values);

        delete this.iban;
        delete this.recurring_payments_greater_than_balance;
        this.associated_account_id = values.idCuentaEfectivo;

        this.invested_amount = values.totalInvertido;
        this.market_value = values.valorMercado;
        this.investments = [];
        for(const inv of values.inversionesCuentaValores.FONDOS_INDEXADOS.inversionesDtoList)
            this.investments.push(new Investment(inv))
    }
}