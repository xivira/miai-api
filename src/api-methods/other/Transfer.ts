import { PrivateAPIMethod } from "../APIMethod";

function parse(values: any) {
    return { result: values };
}


export class Transfer extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/inversiones/traspasos'
    protected method = 'POST'
    protected body = ''

    async request(savings_account_id: number, isin: string) {
        this.body = JSON.stringify({
            "idCuentaValores": savings_account_id,
            "idCuentaPensiones": null,
            "isinFondoOrigen": isin,
            "isinFondoDestino": null,
            "fechaDesde": null,
            "fechaHasta": null,
            "importeDesde": null,
            "importeHasta": null
        })
        await this._request(parse as any);
        return;
    }
}