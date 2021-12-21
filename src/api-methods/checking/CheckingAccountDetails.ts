import { PrivateAPIMethod } from "../APIMethod";
import { CheckingAccount, CheckingAccountDetailed } from "../../data-model";


export class CheckingAccountDetails extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/cuentas/efectivo/'
    protected method = 'GET'
    protected body = ''

    async request(checking_account_id: number) { 
        this.path = `${this.path}${checking_account_id}`;
        return await this._request(CheckingAccountDetailed); 
    }
}