const {model}=require('mongoose');
const {HoldingSchema}=require('../schemas/HoldingsSchema');
const HoldingsModel=model('holdings',HoldingSchema);
module.exports={HoldingsModel};