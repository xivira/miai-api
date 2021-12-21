import { PrivateAPIMethod } from "../APIMethod";
import { AccountInvestments } from "../../data-model";


export class AccountInvestment extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/inversiones/'
    protected method = 'GET'
    protected body = ''

    async request(account_id: number) { 
        this.path = `${this.path}${account_id}`;
        return await this._request(AccountInvestments); 
    }
}