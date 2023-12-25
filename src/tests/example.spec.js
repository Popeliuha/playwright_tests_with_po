// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const { getRandomProductId } = require('../utilities/getRandomProductId');

test.describe('', () => {
    test('Perform login', async ({ loginPage, inventoryPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');

        await expect(inventoryPage.headerTitle).toBeVisible();

        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({ loginPage, inventoryPage, shopingCartPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.cartItems).not.toBeAttached();
    });

    test('Verify az-za sorting', async ({ loginPage, inventoryPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        await expect(inventoryPage.headerTitle).toBeVisible();

        await inventoryPage.sortByValue('az');
        const inventoryItemsAZ = await inventoryPage.inventoryItems.allTextContents();
        await inventoryPage.sortByValue('za');
        const inventoryItemsZA = await inventoryPage.inventoryItems.allTextContents();
        expect(inventoryItemsAZ).not.toEqual(inventoryItemsZA);
    });

    test('Verify lohi-hilo sorting', async ({ loginPage, inventoryPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        await expect(inventoryPage.headerTitle).toBeVisible();

        await inventoryPage.sortByValue('lohi');
        const inventoryItemsLoHi = await inventoryPage.inventoryItems.allTextContents();
        await inventoryPage.sortByValue('hilo');
        const inventoryItemsHiLo = await inventoryPage.inventoryItems.allTextContents();
        expect(inventoryItemsLoHi).not.toEqual(inventoryItemsHiLo);
    });

    test('Add several random products', async ({ loginPage, inventoryPage, shopingCartPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        await expect(inventoryPage.headerTitle).toBeVisible();

        const itemsCount = await inventoryPage.inventoryItems.count();
        const id1 = getRandomProductId(itemsCount);
        const id2 = getRandomProductId(itemsCount);

        const id1Info = await inventoryPage.getProductInfoById(id1);
        const id2Info = await inventoryPage.getProductInfoById(id2);

        await inventoryPage.addItemToCartById(id1);
        await inventoryPage.addItemToCartById(id2);

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toEqual(2);

        const prod1Desc = await shopingCartPage.getProductDescByName(id1Info.productName);
        const prod2Desc = await shopingCartPage.getProductDescByName(id2Info.productName);

        const prod1Price = await shopingCartPage.getProductPriceByName(id1Info.productName);
        const prod2Price = await shopingCartPage.getProductPriceByName(id2Info.productName);

        expect(prod1Desc).toEqual(id1Info.productDesc);
        expect(prod2Desc).toEqual(id2Info.productDesc);

        expect(prod1Price).toEqual(id1Info.productPrice);
        expect(prod2Price).toEqual(id2Info.productPrice);
    });

    test('Verify checkout', async ({
        loginPage, inventoryPage, shopingCartPage, yourInformationPage, overviewPage,
    }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        await expect(inventoryPage.headerTitle).toBeVisible();

        const itemsCount = await inventoryPage.inventoryItems.count();
        const id1 = getRandomProductId(itemsCount);
        const id2 = getRandomProductId(itemsCount);

        const id1Info = await inventoryPage.getProductInfoById(id1);
        const id2Info = await inventoryPage.getProductInfoById(id2);

        await inventoryPage.addItemToCartById(id1);
        await inventoryPage.addItemToCartById(id2);

        await inventoryPage.shopingCart.click();
        await shopingCartPage.clickCheckout();

        await yourInformationPage.fillFirstName('Notashenka');
        await yourInformationPage.fillLastName('Popeliushenka');
        await yourInformationPage.fillPostalCode('58000');
        await yourInformationPage.clickContinue();

        const prod1Desc = await overviewPage.getProductDescByName(id1Info.productName);
        const prod2Desc = await overviewPage.getProductDescByName(id2Info.productName);

        const prod1Price = await overviewPage.getProductPriceByName(id1Info.productName);
        const prod2Price = await overviewPage.getProductPriceByName(id2Info.productName);

        expect(prod1Desc).toEqual(id1Info.productDesc);
        expect(prod2Desc).toEqual(id2Info.productDesc);

        expect(prod1Price).toEqual(id1Info.productPrice);
        expect(prod2Price).toEqual(id2Info.productPrice);

        const totalPrice = await overviewPage.getSummaryTotalLabelText();
        const prodPrice1WithoutCurr = prod1Price.split('$')[1];
        const prodPrice2WithoutCurr = prod2Price.split('$')[1];
        const taxFromUI = await overviewPage.getSummaryTaxLabelText();
        const taxWithoutCurr = taxFromUI.split('$')[1];
        const productPriceTotal = Number(prodPrice1WithoutCurr) + Number(prodPrice2WithoutCurr) + Number(taxWithoutCurr);
        expect(totalPrice).toContain(productPriceTotal.toFixed(2).toString());
    });
});
