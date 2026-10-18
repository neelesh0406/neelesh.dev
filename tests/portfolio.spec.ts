import { test, expect } from '@playwright/test';
test('reference phone loads and unfolds with the portfolio scroll container',async({page})=>{
 await page.goto('/');
 const device=page.locator('.duo-device');
 await expect(device).toHaveAttribute('data-ready','true',{timeout:30000});
 await expect(device).toHaveAttribute('data-progress','0.000');
 await page.evaluate(()=>{const root=document.getElementById('portfolio-scroll')!;const hero=document.getElementById('hero')!;root.scrollTop+=hero.getBoundingClientRect().top-root.getBoundingClientRect().top+hero.offsetHeight-root.clientHeight;});
 await expect(device).toHaveAttribute('data-progress','1.000');
 for(const section of ['about','experience','skills','projects','contact'])await expect(page.locator(`#${section}`)).toBeAttached();
});
