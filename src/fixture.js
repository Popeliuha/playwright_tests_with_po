import { test as base } from '@playwright/test';
const { LoginPage } = require('./pages/Login.page');
const { InventoryPage } = require('./pages/Inventory.page');
const { ShopingCartPage } = require('./pages/ShopingCart.page');
const { YourInformationPage } = require('./pages/YourInformation.page');
const { OverviewPage } = require('./pages/Overview.page');

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    shopingCartPage: async ({ page }, use) => {
        await use(new ShopingCartPage(page));
    },
    yourInformationPage: async ({ page }, use) => {
        await use(new YourInformationPage(page));
    },
    overviewPage: async ({ page }, use) => {
        await use(new OverviewPage(page));
    },
});
