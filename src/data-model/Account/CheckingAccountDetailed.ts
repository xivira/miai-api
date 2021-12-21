import { APIResponse } from ".."
import { CheckingAccount } from "./CheckingAccount";

// /rest/protected/cuentas/efectivo/{{account_id}}

export class CheckingAccountDetailed extends CheckingAccount {
    holders: Holder[]

    constructor(values: APIResponse) {
        super(values);
        this.holders = [];
        for(const holder in values.titulares) 
            this.holders.push(new Holder(values.titulares[holder]))
    }
}

class Holder {
    id: number // id
    name: string // nombre
    surname0: string // apellido1
    surname1: string // apellido2
    full_name: string // nombreCompleto
    username: string // usuario
    nif: string // nif


    constructor(values: APIResponse) {
        this.id = values.id
        this.name = values.nombre
        this.surname0 = values.apellido1
        this.surname1 = values.apellido2
        this.full_name = values.nombreCompleto
        this.username = values.usuario
        this.nif = values.nif
    }
}

enum Holders {
    Owner = 'TITULAR'
}