const {Builder, By, Key} = require('selenium-webdriver');
require("chromedriver");
const fs = require('fs')
const axios = require('axios');

const url = ''
const user = '';
const pass = '';
const last_pic = 'IMG_5089.JPG'

async function scrapper() {

  //To wait for browser to build and launch properly
  let driver = await new Builder().forBrowser("chrome").build();
 
  try {
    //To go to the website from the browser with our code.
    await driver.get(url);

    //To enter to logged area
    await driver
      .findElement(By.id("login-selecao"))
      .sendKeys(user, Key.TAB, pass, Key.ENTER);
    
    //To click to first picture
    const list = await driver.findElements(By.className("grid-item"))
    list[0].click()
    await driver.sleep(2000);

    do{
      //To download the picture
      await download_image(
          await driver.findElement(By.className("fancybox-image")).getAttribute("src"), 
          await driver.findElement(By.className("zoom-filename")).getText());
      
      //To go to the next picture    
      try{
        await driver.findElement(By.className("fancybox-next")).sendKeys(Key.ARROW_RIGHT);
      }catch(err){
        await driver.findElement(By.className("fancybox-next")).click();
        console.log(err);
      }
        
      await driver.sleep(1000);

    }while(await driver.findElement(By.className("zoom-filename")).getText() !== last_pic)

  } catch (e) {
    console.log("Error Occured:", e);
  }

  //It is always a safe practice to quit the browser after execution
  await driver.quit();
}

//Function to download the image
const download_image = (url, fileName) => {
  return axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream('fotos/'+fileName))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
}

scrapper();