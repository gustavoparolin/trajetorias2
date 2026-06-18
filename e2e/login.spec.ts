import { test, expect } from '@playwright/test'

// Jornada 1 (Issue #3) — Servidor acessa o sistema.
// Requer a API no ar e CORS liberando a origem do frontend.

test.describe('Login do servidor (Jornada 1)', () => {
  test('entra com usuario.a / demo e chega ao painel', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Usuário TCU').fill('usuario.a')
    await page.getByLabel('Senha').fill('demo')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByRole('button', { name: 'Trocar usuário' })).toBeVisible()
  })

  test('senha errada mostra erro e permanece no login', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Usuário TCU').fill('usuario.a')
    await page.getByLabel('Senha').fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
  })

  test('painel demo lista usuários e o clique preenche o campo', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Usuários de demonstração')).toBeVisible()
    await page.getByRole('button', { name: /usuario\.a/ }).click()
    await expect(page.getByLabel('Usuário TCU')).toHaveValue('usuario.a')
  })

  test('rota protegida sem sessão redireciona ao login', async ({ page }) => {
    await page.goto('/painel')
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
  })
})
