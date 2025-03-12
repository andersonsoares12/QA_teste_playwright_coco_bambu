import { test, expect } from '@playwright/test';
import { realizarLogin } from './utils/loginHelper'; // Importa a função de login

test.describe('Adicionar item ao carrinho e validar cartão de crédito', async () => {

  test('validar cartão de crédito', async ({ page }) => {
    /* 
    const email = 'andersonsoares.jk@gmail.com';  esse usuario aqui tem um bug 
    que nao consegue nem retirar o item do carrinho e nem adicionar outro item, pos esta
    com um erro de que o processamento do pagamento 
    ainda nao foi realizado bloqueando todo o fluxo de compra 
     */

    //Dados do usuário
    const email = 'anderson.teste.qa.01@gmail.com';
    const password = '@As12no23';
    const otpValue = 'A';
    const otpFieldsCount = 6;
    const otpPrefix = 'otp'; // Prefixo do ID dos campos OTP

    // Dados do cartão de crédito
    const cardData = {
      numero: '5142 5073 3942 4147',
      validade: '11/25',
      codigoSeguranca: '889',
      nomeTitular: 'A Soares',
      cpfCnpj: '847.652.510-98',
      alias: 'A Soares'
    };


    // Intercepta e aceita qualquer pop-up do navegador
    page.on('dialog', async (dialog) => {
      console.log(`Tipo de diálogo: ${dialog.type()}`);
      await dialog.accept(); // Aceita automaticamente qualquer diálogo
    });

    // Navegar para a página inicial
    await page.goto('/');
    const currentUrl = page.url();
    console.log(`URL atual: ${currentUrl}`);

    // Realizar o login utilizando a função importada
    await realizarLogin(page, email, password, otpPrefix, otpFieldsCount, otpValue);

    // Aguarda a página carregar
    await page.getByText('Entradas').first().isVisible();
    await page.getByText('Entradas').first().click();
    await page.getByText('Carne de Sol', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Ex: sem cebola, molho à parte' }).click();
    await page.getByRole('textbox', { name: 'Ex: sem cebola, molho à parte' }).fill('Observação sem cebola');
    await page.getByRole('button', { name: 'ADICIONAR R$' }).click();
    await page.waitForURL('https://app-hom.cocobambu.com/delivery/sacola');

    // Instabilidade na página de sacola
    await page.getByRole('button', { name: 'Selecionar' }).click();

    // Adiciona cartão de crédito
    await page.getByRole('button', { name: 'Add Adicionar novo cartão' }).click();

    // Função para preencher os campos do cartão de crédito
    const preencherCartaoCredito = async (page, cardData) => {
      await page.locator('div').filter({ hasText: /^Crédito$/ }).first().click();
      await page.getByRole('textbox', { name: 'Número do Cartão' }).fill(cardData.numero);
      await page.getByRole('textbox', { name: 'Validade' }).fill(cardData.validade);
      await page.getByRole('textbox', { name: 'Código de Segurança' }).fill(cardData.codigoSeguranca);
      await page.locator('#holderName div').nth(1).fill(cardData.nomeTitular);
      await page.getByRole('textbox', { name: 'CPF/CNPJ' }).fill(cardData.cpfCnpj);
      await page.locator('#cardAlias div').nth(1).fill(cardData.alias);
    };

    // Preencher os campos do cartão de crédito
    await preencherCartaoCredito(page, cardData);

    await page.getByRole('button', { name: 'SALVAR' }).click();
    await page.getByRole('button', { name: 'Verificar' }).click();
    await expect(page.locator('payment-authorizartion')).toContainText('Para aumentar a sua segurança vamos verificar seu cartão');

    await page.getByRole('button', { name: 'FAZER VERIFICAÇÃO' }).click();
    await page.getByText('Confirme o valor cobrado em');
    await page.getByRole('textbox', { name: '0.00' }).click();
    await page.getByRole('textbox', { name: '0.00' }).fill('0.57');
    await page.getByRole('button', { name: 'CONFIRMAR' }).click();
    await expect(page.locator('form')).toContainText('Valor Incorreto, tente novamente');
  });
});