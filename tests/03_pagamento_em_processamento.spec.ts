import { test, expect } from '@playwright/test';
import { realizarLogin } from './utils/loginHelper'; // Importa a função de login
import { describe } from 'node:test';
test.describe('Pagamento em processamento', () => {
test('Pagamento em processamento impede de colocar novos itens ao carrinho', async ({ page }) => {
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

  //Pagamento em processamento impede de adicionar novos itens ao carrinho
  await page.getByText('Carne de sol do sertão (Meia ou Inteira)Arroz de leite coberto com carne de sol').click();
  await page.getByRole('button', { name: 'ADICIONAR R$' }).click();
  //mesagem Você tem um pagamento em processamento
  await expect(page.getByRole('status')).toContainText('Você tem um pagamento em processamento. Não é possivel adicionar um item');
  // Botao fica desabilitado
  await expect(page.locator('div').filter({ hasText: 'Não é possivel alterar itens' })).toBeVisible();


});

} );
