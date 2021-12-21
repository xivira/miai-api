import { PrivateAPIMethod } from "../APIMethod";
import { SavingsAccount } from "../../data-model";

type Result = { result: SavingsAccount[] }

function parse(values: any) {
    let object: Result = { result: [] }
    for (const value of values) object.result.push(new SavingsAccount(value));
    return object;
}

export class AllSavingsAccounts extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/inversiones?soloActivas=false'
    protected method = 'GET'
    protected body = ''

    async request() { return (await this._request(parse as any) as Result).result; }
}