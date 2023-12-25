const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class OverviewPage extends BaseSwagLabPage {
    url = '/checkout-step-two.html';

    get summaryTotalLabel() { return this.page.locator('.summary_total_label'); }

    get summaryTaxLabel() { return this.page.locator('.summary_tax_label'); }

    async getSummaryTotalLabelText() {
        const total = await this.summaryTotalLabel.allTextContents();
        return total[0];
    }

    async getSummaryTaxLabelText() {
        const tax = await this.summaryTaxLabel.allTextContents();
        return tax[0];
    }

    async getCartItemByName(name) { return this.page.locator('.cart_item', { hasText: name }); }

    async getProductDescByName(name) {
        const cartItem = await this.getCartItemByName(name);
        const desc = await cartItem.locator('.inventory_item_desc').allTextContents();
        return desc[0];
    }

    async getProductPriceByName(name) {
        const cartItem = await this.getCartItemByName(name);
        const price = await cartItem.locator('.inventory_item_price').allTextContents();
        return price[0];
    }
}
