import { PrivateAPIMethod } from "../APIMethod";
import { Order } from "../../data-model";


export class OrderDetails extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/fondos/ordenes/'
    protected method = 'GET'
    protected body = ''

    async request(order_id: string) { 
        this.path = `${this.path}${order_id}`;
        return await this._request(Order); 
    }
}