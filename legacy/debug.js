const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    await page.goto('http://localhost:4000', { waitUntil: 'networkidle2' });
    
    console.log("Page loaded. Checking window.editNcc...");
    
    const hasEditNcc = await page.evaluate(() => typeof window.editNcc === 'function');
    console.log("window.editNcc is function?", hasEditNcc);
    
    if (hasEditNcc) {
        console.log("Navigating to page-suppliers...");
        await page.evaluate(() => {
            document.getElementById('page-suppliers').style.display = 'block';
        });
        
        console.log("Clicking .edit-ncc button with mouse...");
        try {
            await page.waitForSelector('.edit-ncc', { timeout: 2000, visible: true });
            await page.click('.edit-ncc');
            console.log("Clicked successfully via mouse.");
        } catch (err) {
            console.log("FAILED to click button via mouse:", err.message);
        }
        
        const modalDisplay = await page.evaluate(() => {
            const modal = document.getElementById('modal-ncc');
            if (modal) {
                return getComputedStyle(modal).display;
            }
            return 'MODAL_NOT_FOUND';
        });
        console.log("Modal display style after click:", modalDisplay);
        
        await page.screenshot({ path: 'screenshot.png' });
        console.log("Saved screenshot to screenshot.png");
    } else {
        console.log("WHY IS IT NOT DEFINED?");
        const tbodyExists = await page.evaluate(() => !!document.getElementById('ncc-table-body'));
        console.log("Does ncc-table-body exist?", tbodyExists);
    }

    await browser.close();
})();
