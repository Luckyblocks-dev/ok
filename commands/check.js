let Discord = require('discord.js')
let wait = require('util').promisify(setTimeout)
let puppeteer = require('puppeteer')


module.exports = {
    name: 'check',
    description: 'Checks',
    execute(message,args,client){
        go(message,args,client)
    }
}

async function go(message,args,client){
    if(args[1]){
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://ravenpool.ninja/dashboard.html#ravencoin/stats?address='+args[1]);

        if(page.$('#minerShares') !== null) {
            console.log('found')

            await wait(1000)
            const heading1 = await page.$eval("#minerShares", el => el.textContent);
            const heading2 = await page.$eval("#lifetimeBalance", el => el.textContent);
            console.log(heading1)
            if(heading1 === ''){
                const error = new Discord.MessageEmbed()
                error.setColor('C10000')
                error.setTitle('Error | Not Hashing')
                error.addField('Lifetime Balance',heading2)
                message.channel.send(error)
                browser.close();return;
            }else{
                console.log('pog')

                const shares = await page.$eval("#minerShares", el => el.textContent);
                const life = await page.$eval("#lifetimeBalance", el => el.textContent);
                const round = await page.$eval("#minerSharesDominance", el => el.textContent);
                const avg = await page.$eval("#avgHash", el => el.textContent)
                const est = await page.$eval("#avgPayout", el => el.textContent)

                const em = new Discord.MessageEmbed()
                em.setColor('2F5AFA')
                em.setTitle('Info - '+args[1])
                em.addField('Round Shares', shares)
                em.addField('Round Shares Dominance',round)
                em.addField('Average Hashrate / 12H',avg)
                em.addField('Estimated Payout', est)
                em.addField('Lifetime Balance',life)
                message.channel.send(em)
		browser.close()
                

            }
        } else {
            console.log('not')
        }
    }else{
        message.channel.send('Invalid Wallet - .check wallet')
    }
}