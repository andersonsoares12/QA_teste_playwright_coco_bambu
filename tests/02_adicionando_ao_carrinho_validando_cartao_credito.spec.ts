import { test, expect } from '@playwright/test';
import { realizarLogin } from './utils/loginHelper'; 
import { log } from 'console';
test.use({ browserName: 'firefox' }); 


test.describe('Adicionar item ao carrinho e validar cartão de crédito', () => {

  test('02 validar cartão de crédito', async ({ page }) => {
    
    log('Teste validar cartão de crédito iniciado');
    
    const email = 'mogoosesoares.jk@gmail.com';
    
    const password = '@As12no23';
    const otpValue = 'A';
    const otpFieldsCount = 6;
    const otpPrefix = 'otp';

    // Dados do cartão de crédito
    const cardData = {
      numero: '5142 5073 3942 4147',
      validade: '11/25',
      codigoSeguranca: '889',
      nomeTitular: 'A Soares',
      cpfCnpj: '847.652.510-98',
      alias: 'A Soares'
    };

    await page.goto('/');
    await realizarLogin(page, email, password, otpPrefix, otpFieldsCount, otpValue);
    
    await page.getByText('Os campeões de venda!').first().click();
    await page.getByText('Carne de sol do sertão (Meia ou Inteira)Arroz de leite coberto com carne de sol').click();

    await page.getByRole('textbox', { name: 'Ex: sem cebola, molho à parte' }).fill('Observação sem cebola');
    await page.getByRole('button', { name: 'ADICIONAR R$' }).click();
    await page.getByRole('button', { name: 'SELECIONE FORMA DE PAGAMENTO' }).click();
    await page.getByRole('button', { name: 'Add Adicionar novo cartão' }).click();

    // Preenchimento do cartão
    const preencherCartaoCredito = async (page, cardData) => {
      await page.locator('div').filter({ hasText: /^Crédito$/ }).first().click();
      await page.getByRole('textbox', { name: 'Número do Cartão' }).fill(cardData.numero);
      await page.getByRole('textbox', { name: 'Validade' }).fill(cardData.validade);
      await page.getByRole('textbox', { name: 'Código de Segurança' }).fill(cardData.codigoSeguranca);
      await page.locator('#holderName div').nth(1).fill(cardData.nomeTitular);
      await page.getByRole('textbox', { name: 'CPF/CNPJ' }).fill(cardData.cpfCnpj);
      await page.locator('#cardAlias div').nth(1).fill(cardData.alias);
    };

    await preencherCartaoCredito(page, cardData);
    await page.getByRole('button', { name: 'SALVAR' }).click();

    // Verifica o cartão de crédito
    await page.getByRole('button', { name: 'Verificar' }).click();
    await expect(page.locator('payment-authorizartion')).toContainText('Para aumentar a sua segurança vamos verificar seu cartão');
    await page.getByRole('button', { name: 'FAZER VERIFICAÇÃO' }).click();
    await page.getByText('Confirme o valor cobrado em');
    await page.getByRole('textbox', { name: '0.00' }).fill('0.57');
    await page.getByRole('button', { name: 'CONFIRMAR' }).click();
    await expect(page.locator('form')).toContainText('Valor Incorreto, tente novamente');
    
  });

  test('02 Removendo o cartao de credito', async ({page}) => {
    log('Teste removendo o cartão de crédito iniciado');
    //dados login usuario
    const email = 'mogoosesoares.jk@gmail.com';
    const password = '@As12no23';
    const otpValue = 'A';
    const otpFieldsCount = 6;
    const otpPrefix = 'otp';

    //faz o login na pagina 
    await page.goto('/');
    await realizarLogin(page, email, password, otpPrefix, otpFieldsCount, otpValue);

    await page.getByText(/.* itensTotal R\$/).click();
    await page.getByRole('button', { name: 'SELECIONE FORMA DE PAGAMENTO' }).click();
    await page.getByRole('button').filter({ hasText: /^$/ }).click();
    await page.locator('div').filter({ hasText: 'Apagar' }).click();
    await page.getByRole('button', { name: 'QUERO EXCLUIR' }).click();

  });
});