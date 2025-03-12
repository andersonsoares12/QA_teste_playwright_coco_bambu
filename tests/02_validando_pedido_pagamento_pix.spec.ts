import { test, expect } from '@playwright/test';
import { realizarLogin } from './utils/loginHelper'; // Importa a função de login
import { describe } from 'node:test';
test.describe('Validando pagamento via pix', () => {
test('Validando pagamento via pix com falha', async ({ page }) => {
  

  
  //const email = 'andersonsoares.jk@gmail.com';
  const email = 'anderson.teste.qa.01@gmail.com';
  const password = '@As12no23';
  const otpValue = 'A';
  const otpFieldsCount = 6;
  const otpPrefix = 'otp'; // Prefixo do ID dos campos OTP

  // Navegar para a página inicial
  await page.goto('/');
  const currentUrl = page.url();
  console.log(`URL atual: ${currentUrl}`);

  // Realizar o login utilizando a função importada
  await realizarLogin(page, email, password, otpPrefix, otpFieldsCount, otpValue);

  //entrando no carrinho para validar pagamento via pix
  await page.getByText(/.* itensTotal R\$/).click();
  await page.getByRole('button', { name: 'SELECIONE FORMA DE PAGAMENTO' }).click();
  await page.locator('div').filter({ hasText: /^Pix$/ }).first().click();
  await page.getByRole('button', { name: 'CONFIRMAR PEDIDO' }).click();
  await page.getByRole('button', { name: 'CONFIRMAR E FAZER PEDIDO' }).click();
  //mensagem informando que o pagamento via pix está indisponível
  await page.locator('div').filter({ hasText: /^Pagamento via Pix indisponível$/ }).first().isVisible();

});
} );
