import { PrivateAPIMethod } from "../APIMethod";

type Result = { result: number }

function parse(values: any) {
    return { result: values.saldo };
}

export class StartInvestment extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/operaciones/iniciarInvertir/'
    protected method = 'GET'
    protected body = ''

    async request(savings_account_id: number) {
        this.path += encodeURIComponent(savings_account_id);
        return (await this._request(parse as any) as Result).result;
    }
}