const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } //

    get inventoryItems() { return this.page.locator('.inventory_item'); }

    get productSortContainer() { return this.page.locator('.product_sort_container'); }

    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }

    async getProductNameById(id) {
        return this.inventoryItems.nth(id).locator('.inventory_item_name').allTextContents();
    }

    async getProductDescById(id) {
        return this.inventoryItems.nth(id).locator('.inventory_item_desc').allTextContents();
    }

    async getProductPriceById(id) {
        return this.inventoryItems.nth(id).locator('.inventory_item_price').allTextContents();
    }

    async getProductInfoById(id) {
        const productName = await this.getProductNameById(id);
        const productDesc = await this.getProductDescById(id);
        const productPrice = await this.getProductPriceById(id);
        return { productName: productName[0], productDesc: productDesc[0], productPrice: productPrice[0] };
    }

    async sortByValue(valueToSort) {
        await this.productSortContainer.selectOption({ value: valueToSort });
    }
}
