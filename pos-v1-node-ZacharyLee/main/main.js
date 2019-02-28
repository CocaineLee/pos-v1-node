var {loadAllItems,loadPromotions}=require('../main/datbase');

function printInventory(inputs) {
    let dataInfs=dataFormat(inputs);
    let shoppingInfs=addDBInf(dataInfs);
    return infShow(shoppingInfs);
};

function dataFormat(inputs){
    let dataInfs={};
    inputs.forEach(element => {
        let temp=element.split('-');
        if(temp.length===1){
            dataInfs[temp[0]] = isNaN(dataInfs[temp[0]])?1:dataInfs[temp[0]]+1;;
        }
        else {
            dataInfs[temp[0]]=temp[1]-0;
        }        
    });
    return dataInfs;
}

function addDBInf(dataInfs)
{
    let allItemInfs=loadAllItems();
    let promInfs=loadPromotions();
    let shoppingInfs=[];
    allItemInfs.forEach(element =>{
        if(dataInfs[element.barcode]){
            element.num=dataInfs[element.barcode];
            element.total=element.num*element.price;
            promInfs[0].barcodes.forEach( promCode =>{
                if(element.barcode===promCode)
                    element.total-=parseInt(element.num/3)*element.price;
            });
            shoppingInfs.push(element);
        }
    })
    return shoppingInfs;
}

function infShow(shoppingInfs){
    let totalMoney=0;
    let saveMoney=0;
    let freeInfs=[];
    let infShowStr='***<没钱赚商店>购物清单***\n';
    shoppingInfs.forEach(element =>{
        totalBefore=element.price*element.num;
        if(totalBefore>element.total){
            freeInfs.push({name:element.name,num:(totalBefore-element.total)/element.price,unit:element.unit})
            saveMoney+=totalBefore-element.total;
        }
        infShowStr+='名称：'+element.name+'，数量：'+element.num+element.unit+'，单价：'+element.price.toFixed(2)+'(元)，小计：'+element.total.toFixed(2)+'(元)\n';
        totalMoney+=element.total;
    })
    infShowStr+='----------------------\n\
挥泪赠送商品：\n';
    freeInfs.forEach(element=>{
        infShowStr+='名称：'+element.name+'，数量：'+element.num+element.unit+'\n';
    })
    infShowStr+='----------------------\n\
总计：'+totalMoney.toFixed(2)+'(元)\n'+
    '节省：'+saveMoney.toFixed(2)+'(元)\n'+
    '**********************'
    return infShowStr;
}
module.exports={
    printInventory:printInventory,
    dataFormat:dataFormat,
    addDBInf:addDBInf
}