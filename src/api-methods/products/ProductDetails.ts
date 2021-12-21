import { PrivateAPIMethod } from "../APIMethod";
import { Product, ProductBase } from "../../data-model";


export class ProductDetails extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/fondos/obtenerFondoByIsin'
    protected method = 'POST'
    protected body = ''

    async request(savings_account_id: number, isin: string) {
        this.body = JSON.stringify({
            "idCuentaValores": savings_account_id,
            "idFondo": null,
            "codigoIsinFondo": isin,
            "tipoProductoEnum": "TODOS",
            "fondoDisponible": false,
            "nombre": null
        });
        return await this._request(Product);
    }
}