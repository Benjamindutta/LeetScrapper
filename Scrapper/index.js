
const chromium = require('chrome-aws-lambda');

const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://fijii360:D34LVrHPUYM1mDLH@cluster0.mlnprpp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);


let result = null;
exports.handler = async (event, context, callback) => {

    let browser = null;

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });


        const page = await browser.newPage();
        await page.goto("https://leetcode.com/problemset/all/");

        await page.waitForSelector('#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.z-base.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(6) > div.-mx-4.transition-opacity.md\\:mx-0 > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > div > div > div > a');
        const grabPOT = await page.evaluate(() => {
            const link_POT = document.querySelector('#__next > div > div.mx-auto.w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.mt-\\[50px\\].dark\\:bg-dark-layer-bg.bg-white > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.z-base.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(6) > div.-mx-4.transition-opacity.md\\:mx-0 > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > div > div > div > a').getAttribute('href');
            return link_POT;
        })

        result = "https://leetcode.com" + grabPOT;

        await client.connect();
        const database = client.db('questionoftheday');
        const collection = database.collection('qod');

        const resultdelete = await collection.deleteMany({});

        // console.log(resultdelete.deletedCount);
        const documentToInsert = { "_id": "qod", "question": result };
        const resultinsterted = await collection.insertOne(documentToInsert);
        // console.log(resultinsterted.acknowledged);


    } catch (error) {
        return callback(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }

        await client.close();

    }

    return callback(null, result);
};