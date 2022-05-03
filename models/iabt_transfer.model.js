const mongoose = require('mongoose');
const Schema = mongoose.Schema;
iabtmodelname = 'IABT_Transfer';
const IACustomer = require('../models/iacustomer.model');

const IABT_TransferSchema = mongoose.Schema(
    {
        FromCustomerId: {type: Schema.Types.ObjectId, ref: 'IACustomer', index: true},
        ToCustomerId: {type: Schema.Types.ObjectId, ref: 'IACustomer', index: true},
        Amount: Number, //number of IABTs
        CaseType: Number,
        CaseComment: String,
        VoucherId: {type: Schema.Types.ObjectId, ref: iabtmodelname, index: true, unique: true, sparse: true},
        FromEmail: String,//sender email
        ToEmail: String,//receiver email
        ResolutionId: {type: Schema.Types.ObjectId, ref: 'BKCResolutionBonus', index: true},
        //in mongo shell run: db.iabt_transfers.ensureIndex({VoucherId: 1}, {unique: true, sparse: true});
    },
    {
        timestamps: true
    }
);



/**
 * This method require to be blockchain enabled
 * @param fromId
 * @param toId
 * @param amount
 * @param caseType
 * @param caseComment
 */
IABT_TransferSchema.statics.transfer = function (fromId, toId, amount, caseType, caseComment, voucherid, resolutionid) {

    let newTransfer = {
        FromCustomerId: fromId,
        ToCustomerId: toId,
        Amount: amount,
        CaseType: caseType,
        CaseComment: caseComment,
        ResolutionId: resolutionid
    };

    let TransferResult = {
        IABT_Transfer_Id: null,
        TransferOK: false,
        TransferString: null,
        FromCustomerId: fromId,
        ToCustomerId: toId,
        Amount: amount,
        CaseType: caseType,
        CaseComment: caseComment
    };

    // if(fromId.equals(toId)) {
    if(fromId ===toId) {
        console.error('could not transfer from a wallet to itself')
        return  TransferResult;
    }

    return new Promise(function(resolve, reject) {
        if(caseType===IABT_TransferSchema.statics.TransferCases().VOUCHER_IMPORT && voucherid){
            IABT_Model.findById(voucherid).then((voucher)=>{
                if(!voucher){
                    TransferResult.TransferOK = false;
                    TransferResult.TransferString = 'There is not any active voucher with code '+voucherid;
                    console.error('BKC Transfer error no true voucher id');
                    reject(TransferResult);
                    return;
                }
                newTransfer.Amount = voucher.Amount;
                newTransfer.VoucherId = voucherid;
                IABT_Model.create(newTransfer).then(addedtransfer => {
                    TransferResult.IABT_Transfer_Id = addedtransfer._id;
                    TransferResult.TransferOK = true;
                    TransferResult.TransferString = 'OK';
                    console.trace('BKC Transfer successful', addedtransfer);
                    resolve(TransferResult);
                    // addedtransfer.sendpasstodevice
                }).catch(err => {
                    TransferResult.TransferOK = false;
                    if(err.code === 11000){
                        TransferResult.TransferString = 'This voucher code is used before!';
                    } else {
                        TransferResult.TransferString = err.message;
                    }
                    console.error('BKC Transfer error', err);
                    reject(TransferResult);
                });
            }).catch((err)=>{
                TransferResult.TransferOK = false;
                TransferResult.TransferString = err.message;
                if(err.kind === 'ObjectId'){
                    TransferResult.TransferString = 'Voucher code "'+voucherid+'" is not valid!';
                }
                console.error('BKC Transfer error', err);
                reject(TransferResult);
            })

        } else {
            IABT_TransferSchema.statics.getBalance(fromId, amount, 0).then((balance) => {
                if (balance >= amount) {
                    //transfer can be done

                    if(caseType===IABT_TransferSchema.statics.TransferCases().TRANSFER_TO_EMAIL){
                        //transfer to email
                        IACustomer.findOne({Username: toId} , { _id: 1}).then((resultid)=>{
                            if(resultid){
                                newTransfer.ToCustomerId = resultid._id;
                                newTransfer.ToEmail = toId;
                                IABT_Model.create(newTransfer).then(addedtransfer => {
                                    TransferResult.IABT_Transfer_Id = addedtransfer._id;
                                    TransferResult.TransferOK = true;
                                    TransferResult.TransferString = 'OK';
                                    console.trace('BKC Transfer successful', addedtransfer);
                                    resolve(TransferResult);
                                    // addedtransfer.sendpasstodevice
                                }).catch(err => {
                                    TransferResult.TransferOK = false;
                                    TransferResult.TransferString = err.message;
                                    console.error('BKC Transfer error', err);
                                    reject(TransferResult);
                                });
                            } else {
                                TransferResult.TransferOK = false;
                                TransferResult.TransferString = 'There is no BKC wallet for this email address';
                                console.error('There is no BKC wallet for this email address');
                                reject(TransferResult);
                            }

                        }).catch((err)=>{
                            reject(err);
                        })
                    } else {
                        //other type of transfer
                        IABT_Model.create(newTransfer).then(addedtransfer => {
                            TransferResult.IABT_Transfer_Id = addedtransfer._id;
                            TransferResult.TransferOK = true;
                            TransferResult.TransferString = 'OK';
                            console.debug('BKC Transfer successful', addedtransfer);
                            resolve(TransferResult);
                            // addedtransfer.sendpasstodevice
                        }).catch(err => {
                            TransferResult.TransferOK = false;
                            TransferResult.TransferString = err.message;
                            console.error('BKC Transfer error', err);
                            reject(TransferResult);
                        });
                    }


                } else {
                    console.error('The BKC token balance is lower than ' + amount, 'balance is ',balance);
                    // TransferResult.TransferOK = false;
                    // TransferResult.TransferString = 'Lack of token';
                    throw new Error('The BKC token balance is lower than ' + amount);
                }
            }).catch(err => {
                TransferResult.TransferOK = false;
                TransferResult.TransferString = err.message;
                TransferResult.message = err.message;
                console.error('BKC Transfer error', err);
                reject(TransferResult);
            });
        }
    });
};

/**
 *
 * @param ownerId is wallet owner
 * @param amount the amount required for next transaction
 * @param records max return transfers
 */
IABT_TransferSchema.statics.getBalance = async function (ownerId, amount, records) {
    /*IABT_Model.aggregate([
        { $match: {
            FromCustomerId: ownerId
        }},

        { $project: {
            _id: 1,
            sum: { $sum: "$Amount" }
        }}
        ],

        function( err, data ) {

            if ( err )
                throw err;

            console.log( JSON.stringify( data, undefined, 2 ) );

        }
    )*/
    let payments = await IABT_Model.find({FromCustomerId: ownerId});
    let sumPayments = payments.reduce((sum,transfer)=>sum+transfer.Amount ,0);
    let receipts = await IABT_Model.find({ToCustomerId: ownerId});
    let sumReceipts = receipts.reduce((sum,transfer)=>sum+transfer.Amount ,0);
    let developer_ern = receipts.reduce((sum,transfer)=>{if([IABT_TransferSchema.statics.TransferCases().SERVICE_INSTALL, IABT_TransferSchema.statics.TransferCases().SERVICE_RUN].includes(transfer.CaseType)) return sum+transfer.Amount; else return 0} ,0);

    let limit = 10000;//max return records
    if(typeof records === 'number') {
        limit = records;
    }

    let transfers = await IABT_Model.find({$or: [ {ToCustomerId: ownerId} , {FromCustomerId: ownerId} ]})
        .sort({'createdAt': -1})
        .limit(limit);
    // let sumReceipts = receipts.reduce((sum,transfer)=>sum+transfer.Amount ,0);
    for(let t of transfers){
        if(t.FromCustomerId && ownerId===t.FromCustomerId.toString()){
            t._doc.caseMode = '-';
            if(t._doc.CaseType===IABT_TransferSchema.statics.TransferCases().TRANSFER_TO_EMAIL){
                t._doc.CaseComment = 'Transfer token to '+t._doc.ToEmail;
            }
        } else if(t.ToCustomerId && ownerId === t.ToCustomerId.toString()){
            t._doc.caseMode = '+';
            /*if(caseType===IABT_TransferSchema.statics.TransferCases().TRANSFER_TO_EMAIL){
                t._doc.CaseComment = 'Receive token from ';
            }*/
        }
    }

    console.error('==========================================',{
        ownerId: ownerId,
        sumPayments: sumPayments,
        sumReceipts: sumReceipts
    })

    if(!records)
        return sumReceipts - sumPayments;
    else
        return {
            balance: sumReceipts - sumPayments,
            developer_ern: developer_ern,
            records: transfers
        };
};


/*IABT_TransferSchema.statics.importVoucher = function (receiverid, voucherid){
    return new Promise(async function(resolve, reject) {
        let voucher = await IABT_Model.findById(voucherid);
        if(voucher){
            IABT_TransferSchema.statics.transfer(null,receiverid,voucher.Amount, IABT_TransferSchema.statics.TransferCases().VOUCHER_IMPORT,
                `Import voucher ${voucherid}`).then(addedtransfer => {
                console.trace('voucher import successful', voucherid);
                resolve(true);
            }).catch(err=>{
                console.error(err);
                reject(false);
            })
        }
    });
}*/

IABT_TransferSchema.statics.TransferCases = function () {
    return {
        SERVICE_INSTALL : 100,
        SERVICE_RUN : 101,
        SERVICE_TRANSFER : 102,
        VOUCHER_EXTRACT: 300,
        VOUCHER_IMPORT: 301,
        TRANSFER_TO_EMAIL:201,
        BONUS_FOR_PAYLOAD: 501,
        BURN_TOKEN: 900
    }
};

//test
// IABT_TransferSchema.statics.transfer(null,null,100,1,'dafaf');


const IABT_Model = mongoose.model(iabtmodelname, IABT_TransferSchema);

// IABT_TransferSchema.statics.getBalance('5d075259db10492f48d8bf28',100);

module.exports = IABT_Model;
