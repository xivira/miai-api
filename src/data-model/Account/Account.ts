import { APIResponse } from ".."
import { AccountBase } from "./AccountBase";

// /rest/protected/cuentas/obtener-todas-cuentas-usuario/EFECTIVO?iban=
export class Account extends AccountBase {
    balance: number // saldoDisponible
    iban: string // iban
    uuid: string // uuidCuenta

    constructor(values: APIResponse) {
        super(values);
        this.balance = values.importeCuenta;
        this.iban = values.iban;
        this.uuid = values.uuidCuenta;
    }

    static is(value: any): value is Account {
        return typeof value.balance === 'number' && 
        typeof value.iban === 'string' && 
        typeof value.uuid === 'string' && 
        AccountBase.is(value)
    }
}
