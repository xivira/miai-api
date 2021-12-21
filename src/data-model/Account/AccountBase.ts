import { APIResponse } from "..";

// /rest/protected/cuentas/obtener-todas-cuentas-usuario/VALORES?iban=
export class AccountBase {
    name: string // aliasCuenta
    account_type: AccountType // tipoCuentaEnum
    account_id: number // idCuenta
    has_coowner: boolean // tieneCotitular

    constructor(values: APIResponse) {
        this.name = values.aliasCuenta;
        this.account_type = values.tipoCuentaEnum;
        this.account_id = values.idCuenta;
        this.has_coowner = values.tieneCotitular
    }

    static is(value: any): value is AccountBase {
        return typeof value.name === 'string' 
        && Object.values(AccountType).includes(value.account_type)
        && typeof value.account_id === 'number'
        && typeof value.has_coowner === 'boolean'
    }
}

export enum AccountType {
    Cashing = 'EFECTIVO',
    Savings = 'VALORES'
}