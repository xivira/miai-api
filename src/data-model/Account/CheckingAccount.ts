import { APIResponse } from "..";
import { Account } from "./Account";

// /rest/protected/cuentas/efectivo?soloActivas=false

export class CheckingAccount extends Account {
    witholdings: number // retencionesSaldoCuenta
    associated_account_id: number // idCuentaValores
    recurring_payments_greater_than_balance: boolean // importeTotalTransferenciasPeriodicasMayorSaldoCuenta
    // replace iban     -> ibanCuenta
    // replace balance  -> importeCuenta

    constructor(values: APIResponse) {
        super(values);
        this.iban = values.ibanCuenta;
        this.balance = values.importeCuenta;
        this.witholdings = values.retencionesSaldoCuenta;
        this.associated_account_id = values.idCuentaValores;
        this.recurring_payments_greater_than_balance = values.importeTotalTransferenciasPeriodicasMayorSaldoCuenta;
    }

    static is(value: any): value is CheckingAccount {
        return typeof value.witholdings === 'number' &&
            typeof value.savings_account_id === 'number' &&
            typeof value.recurring_payments_greater_than_balance === 'boolean'
    }
}