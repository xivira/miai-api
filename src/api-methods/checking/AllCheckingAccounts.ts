import { PrivateAPIMethod } from "../APIMethod";
import { CheckingAccount } from "../../data-model";

type Result = { result: CheckingAccount[] }

function parse(values: any) {
    let object: Result = { result: [] }
    for (const value of values) object.result.push(new CheckingAccount(value));
    return object;
}

export class AllCheckingAccounts extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/cuentas/efectivo?soloActivas=false'
    protected method = 'GET'
    protected body = ''

    async request() { return (await this._request(parse as any) as Result).result; }
}