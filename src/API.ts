import { Auth } from "./Authenticator";
import { Order, Product } from "./data-model";
import { URLCheck } from "./api-methods/other/URLCheck";
import { Transfer } from "./api-methods/other/Transfer";
import { FnOTPReason } from "./api-methods/functions/ValidateFnOTP";
import { StartInvestment } from "./api-methods/other/StartInvestment";
import {
    SavingsHistory, CheckingAccountDetails, AllCheckingAccounts,
    AllSavingsAccounts, AccountInvestment, OrdersQuery, OrderDetails, OrderQuery, RequestFnToken,
    RequestToken, ValidateAuthOTP, ValidateFnOTP, CancelOrder, Invest, ProductsQuery, ProductDetails
} from "./api-methods";

export class MyInvestorAPI {
    private token: string

    constructor(auth: Auth) { this.token = auth.token; }

    /* AUTHENTICATION */
    static async requestToken(user: string, password: string, device_id: string) { return await new RequestToken().request(user, password, device_id) }
    static async validateAuthOTP(user: string, password: string, device_id: string, request_id: string, opt_code: string) { return await new ValidateAuthOTP().request(user, password, device_id, request_id, opt_code) }

    /* CHECKING */
    async allCheckingAccounts() { return await new AllCheckingAccounts(this.token).request() }
    async checkingAccountDetails(checking_account_id: number) { return new CheckingAccountDetails(this.token).request(checking_account_id) }

    /* SAVINGS */
    async savingsHistory() { return await new SavingsHistory(this.token).request(); }
    async allSavingsAccounts() { return await new AllSavingsAccounts(this.token).request() }
    async accountInvestment(savings_account_id: number) { return await new AccountInvestment(this.token).request(savings_account_id) }

    /* ORDERS */
    async orderDetails(order_id: string) { return await new OrderDetails(this.token).request(order_id) }
    async ordersQuery(savings_account_id: number, query?: OrderQuery) { return await new OrdersQuery(this.token).request(savings_account_id, query) }

    /* PRODUCTS */
    async productsQuery(search_terms?: string) { return await new ProductsQuery(this.token).request(search_terms) }
    async productDetails(savings_account_id: number, isin: string) { return await new ProductDetails(this.token).request(savings_account_id, isin) }

    /* PRE-FUNCTION TOKEN REQUEST */
    async requestFnToken() { return await new RequestFnToken(this.token).request() }
    async validateFnToken(reason: FnOTPReason, fn_otp_id: string, pos0: string, pos1: string, device_id: string) { return await new ValidateFnOTP(this.token, device_id).request(reason, fn_otp_id, pos0, pos1) }

    /* OTHER */
    async startInvestment(savings_account_id: number) { return await new StartInvestment(this.token).request(savings_account_id); }
    async transfer(savings_account_id: number, isin: string) { return await new Transfer(this.token).request(savings_account_id, isin); }
    async urlCheck(url: URL) { return await new URLCheck(this.token).request(url); }

    /* FUNCTIONS */
    async cancelOrder(savings_account_id: number, order: Order, opt_code: string, device_id: string) { return await new CancelOrder(this.token, device_id).request(savings_account_id, order, opt_code); }
    async signAndCancelOrder(savings_account_id: number, order: Order, fn_otp_id: string, digit_0: string, digit_1: string, device_id: string) {
        let result = await new ValidateFnOTP(this.token, device_id).request(FnOTPReason.CancelOrder, fn_otp_id, digit_0, digit_1);
        if (!result.success) throw result.failure_reason;
        return await new CancelOrder(this.token, device_id).request(savings_account_id, order, result.opt_code);
    }

    async invest(savings_account_id: number, fund: Product, cash_amout: number, opt_code: string, device_id: string) { return await new Invest(this.token, device_id).request(savings_account_id, fund, cash_amout, opt_code); }
    async signAndInvest(savings_account_id: number, fund: Product, cash_amout: number, fn_otp_id: string, digit_0: string, digit_1: string, device_id: string) {
        let result = await new ValidateFnOTP(this.token, device_id).request(FnOTPReason.Invest, fn_otp_id, digit_0, digit_1);
        if (!result.success) throw result.failure_reason;
        return await new Invest(this.token, device_id).request(savings_account_id, fund, cash_amout, result.opt_code);
    }


    /* COMPOSITE FUNCTIONS */
    // Full, automatic fund purchase
    async fullInvest(savings_account_id: number, isin: string, cash_amout: number, device_id: string, signature: string) {
        // Start new investment
        try { await this.startInvestment(savings_account_id); }
        catch { throw `could not obtain available funds for account ${savings_account_id} - make shure the id corresponds to a savings account.` }
        
        // Get product details
        let prod;
        try { prod = await this.productDetails(savings_account_id, isin); }
        catch { throw `could not obtain product information for isin - invalid or unavailable product.` }

        // Transfer (whatever that means)
        await this.transfer(savings_account_id, isin);

        // Check URLs are read
        for (const url_key in prod.urls) { await this.urlCheck(prod.urls[url_key]); }

        // Request fn token
        const fn_token_req = await this.requestFnToken();

        // Validate signature
        const s0 = signature.charAt(fn_token_req.requested_digit_0_postition);
        const s1 = signature.charAt(fn_token_req.requested_digit_1_postition);
        let otp_result = await this.validateFnToken(FnOTPReason.Invest, fn_token_req.fn_otp_id, s0, s1, device_id);
        if (!otp_result.success) throw `Signature operation failed: ${otp_result.failure_reason || 'unknown reason'}`;

        // Invest
        return await this.invest(savings_account_id, prod, cash_amout, otp_result.opt_code, device_id);
    }

    // Full, automatic fund purchase cancellation
    async fullCancel(savings_account_id: number, order_id: string, device_id: string, signature: string) {

        // Check account is savings
        try { await this.startInvestment(savings_account_id); }
        catch { throw `${savings_account_id} does not correspond to an available savings account.` }

        // Get order
        let order = (await this.ordersQuery(savings_account_id)).find(order => order.order_id === order_id);
        if (!order) { throw `savings account ${savings_account_id} does not have an associated order with id ${order_id}` }

        // Get date details
        order.order_date = await (await this.orderDetails(order.order_id)).order_date;

        if (!order.cancellable) throw `order ${order_id} is not cancellable.`

        // Request fn token
        const fn_token_req = await this.requestFnToken();

        // Validate signature
        const s0 = signature.charAt(fn_token_req.requested_digit_0_postition);
        const s1 = signature.charAt(fn_token_req.requested_digit_1_postition);
        let otp_result = await this.validateFnToken(FnOTPReason.CancelOrder, fn_token_req.fn_otp_id, s0, s1, device_id);
        if (!otp_result.success) throw `Signature operation failed: ${otp_result.failure_reason || 'unknown reason'}`;
        else console.log(`Signature verified successfully.\n`)

        // Cancel
        return await this.cancelOrder(savings_account_id, order, otp_result.opt_code, device_id);
    }
}