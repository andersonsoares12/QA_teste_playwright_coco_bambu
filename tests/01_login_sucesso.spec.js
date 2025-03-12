import { test, expect } from '@playwright/test';
import { preencherOtpCampos } from './utils/otpHelper'; // Importa a função de preenchimento dos campos OTP
import { log } from 'console';

test.use({ browserName: 'firefox' }); 

test.describe('Login com sucesso', () => {

test('01 Login com sucesso', async ({ page }) => {
  

  log('Teste de login iniciado');
  // const email = 'andersonsoares.jk@gmail.com';
  const email = 'anderson.teste.qa.01@gmail.com';
  const password = '@As12no23';
  const otpValue = 'A';
  const otpFieldsCount = 6;
  const otpPrefix = 'otp'; // Prefixo do ID dos campos OTP

  // Navegar para a página inicial
  await page.goto('/');
  const currentUrl = page.url();

  // Clicar no botão "Entrar"
  await page.getByText('Entrar').click();

  // Preencher os campos de login
  await page.getByRole('textbox', { name: 'E-mail' }).fill(email);
  await page.getByRole('textbox', { name: 'Senha' }).fill(password);

  // Submeter o formulário de login
  await page.getByRole('button', { name: 'ENTRAR' }).click();

  //validando mensagem de CÓDIGO ENVIADO
  await expect(page.locator('h1')).toContainText('CÓDIGO ENVIADO');

  // Fechar qualquer pop-up/modal
  await page.getByRole('button', { name: 'FECHAR' }).click();

  // Preencher os campos OTP usando a função importada
  await preencherOtpCampos(page, otpPrefix, otpFieldsCount, otpValue);


  // Submeter o formulário OTP
  await page.getByRole('button', { name: 'ACESSAR' }).click();

  // Aguardar o carregamento da página
  await page.waitForURL('https://app-hom.cocobambu.com/delivery');
  await page.getByText('Promoções').first().isVisible();
 
  await page.close();

});
});