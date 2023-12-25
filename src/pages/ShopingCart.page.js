const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class ShopingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item';

    removeItemSelector = '[id^="remove"]';

    get headerTitle() { return this.page.locator('.title'); }

    get cartItems() { return this.page.locator(this.cartItemSelector); }

    get checkoutBtn() { return this.page.locator('#checkout'); }

    async clickCheckout() { 
        await this.checkoutBtn.click();
    }
    
    // async below added to show the function returns a promise
    async getCartItemByName(name) { return this.page.locator(this.cartItemSelector, { hasText: name }); }

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

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }
}
