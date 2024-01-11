const campaignController = require('./controllers/CampaignController')

function scheduleUpdate() {
    campaignController.updateExpiredStatus();
  
    setInterval(() => {
        campaignController.updateExpiredStatus();
    }, 10 * 60 * 1000);
  }
  
  scheduleUpdate();