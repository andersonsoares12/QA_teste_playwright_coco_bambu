import { test, expect } from '@playwright/test';
import { realizarLogin } from './utils/loginHelper'; 
import { log } from 'console';
test.use({ browserName: 'firefox' }); 


test.describe('Removendo itens da sacola', async () => {

  test('01 Removendo itens da sacola', async ({ page }) => {
    
    log('Teste Removendo itens da sacola iniciado');
    
    const email = 'mogoosesoares.jk@gmail.com';
    
    const password = '@As12no23';
    const otpValue = 'A';
    const otpFieldsCount = 6;
    const otpPrefix = 'otp';

    await page.goto('/');
    await realizarLogin(page, email, password, otpPrefix, otpFieldsCount, otpValue);
    // seleciona a sacola com itens
    await page.getByText(/.* itensTotal R\$/).click();
    await page.getByRole('img', { name: 'icon' }).click();
    await page.getByText('Remover').click();
    await page.getByRole('button', { name: 'Sim' }).click();
    // não deve mais aparecer a sacola de itens 
    await page.close();
  });
});