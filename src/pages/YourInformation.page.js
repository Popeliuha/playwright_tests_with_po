const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class YourInformationPage extends BaseSwagLabPage {
    url = '/checkout-step-one.html';

    get firstNameTxt() { return this.page.locator('#first-name'); }

    get lastNameTxt() { return this.page.locator('#last-name'); }

    get postalCodeTxt() { return this.page.locator('#postal-code'); }

    get continueBtn() { return this.page.locator('#continue'); }

    async fillFirstName(name) { 
        await this.firstNameTxt.fill(name);
    }

    async fillLastName(name) { 
        await this.lastNameTxt.fill(name);
    }

    async fillPostalCode(code) { 
        await this.postalCodeTxt.fill(code);
    }

    async clickContinue() { 
        await this.continueBtn.click();
    }
}
