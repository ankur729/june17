var mongojs = require('mongojs');

var db = mongojs('mongodb://admin:root@ds127399.mlab.com:27399/eatoeat');

var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var dns = require('dns');
var os = require('os');
var randomstring = require("randomstring");
// var jwt=require('jsonwebtoken');
var nodemailer = require('nodemailer');
const moment = require('moment');
var Jimp = require("jimp");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ankuridigitie@gmail.com',
        pass: 'idigitieankur'
    }
});

module.exports.add_cook_info = function (req, res, next) {

    // res.send('Task API');
    console.log('reached');

    console.log(req.body);

    // // res.send(req.body);
    // db.cook_infos.find({ cook_email: req.body.profile_detail.cook_email }, function (err, cook_details) {

    //     if (cook_details != "") {
    //         console.log('2 ND ONE');

    //         res.status(409);
    //         console.log('email already registered');
    //         res.send({
    //             'status': 'Email Already Registered'
    //         });

    //     } else
    //         if (cook_details == "") {


    //             db.cook_infos.find({ cook_contact: parseInt(req.body.profile_detail.cook_contact) }, function (err, cook_details_contact) {

    //                 if (cook_details_contact != "") {


    //                     console.log('Contact already registered');
    //                     res.status(409);

    //                     res.send({
    //                         'status': 'Contact_No Already Registered',
    //                         'code': 409
    //                     });

    //                 }
    //                 else {


    db.cook_infos.save(
        {
            cook_name: req.body.basic_detail.cook_name,
            cook_email: req.body.profile_detail.cook_email,
            cook_contact: parseInt(req.body.profile_detail.cook_contact),
            cook_password: bcrypt.hashSync(req.body.basic_detail.cook_password, bcrypt.genSaltSync(10)),
            building_no: req.body.profile_detail.building_no,
            street_address: req.body.profile_detail.street_address,
            gender: req.body.profile_detail.gender,
            landmark: req.body.profile_detail.landmark,
            city: req.body.profile_detail.city,
            pincode: req.body.profile_detail.pincode,
            state: req.body.profile_detail.state,
            delivery_range: '',
            cook_longitude: req.body.profile_detail.longitude,
            cook_latitude: req.body.profile_detail.latitude,
            cook_company_name: req.body.profile_detail.cook_company_name,
            cook_name_on_bank_acc: req.body.profile_detail.cook_name_on_bank_acc,
            bank_name: req.body.profile_detail.bank_name,
            branch_name: req.body.profile_detail.branch_name,
            bank_type: req.body.profile_detail.bank_type,
            bank_account_no: req.body.profile_detail.bank_account_no,
            bank_ifsc: req.body.profile_detail.bank_ifsc,
            delivery_boy_id: '',
            last_updated_at: '',
            cook_commission: '0',
            food_details: [],
            status: "Inactive",
            isApproved: "new",
            "isEmailVerified": "false",
            updated_fields: [],
            joined_on: moment(new Date()).format("DD/MM/YYYY"),



        }
        , function (err, cook_details) {

            if (err) throw err;


            // var mailOptions = {
            //     from: '"EatoEato 👻" <ankuridigitie@gmail.com>', // sender address
            //     to: req.body.basic_detail.cook_email, // list of receivers
            //     subject: 'Welcome To EatoEato ', // Subject line
            //     text: 'Please Activate Your EatoEato Account', // plain text body
            //     html: '<b>Your Account Has Been Created by, Please Click on Below Link to Verify your Account</b> <br> <a href="http://192.168.1.157:3000/#/verify-user-params/">' + randomstring.generate({ length: 100, charset: 'alphabetic' }) + '</a>' // html body
            // };

            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //         res.json({
            //             yo: 'error'
            //         });
            //     } else {
            //         console.log('Message sent: ' + info.response);

            //     };
            // });

            res.json({ 'status': 'Cook Successfully Added' });
            console.log('COOK DETAILS saved');

        });



    //                 }
    //             });



    //         }
    // });
};

module.exports.check_cook_complete_profile_info = function (req, res, next) {

    db.cook_infos.find({ cook_email: req.body.profile_detail.cook_email }, function (err, cook_details) {

        if (cook_details != "") {
            console.log('2 ND ONE');

            res.status(409);
            console.log('email already registered');
            res.send({
                'status': 'Email Already Registered'
            });

        } else
            if (cook_details == "") {


                db.cook_infos.find({ cook_contact: parseInt(req.body.profile_detail.cook_contact) }, function (err, cook_details_contact) {

                    if (cook_details_contact != "") {


                        console.log('Contact already registered');
                        res.status(409);

                        res.send({
                            'status': 'Contact_No Already Registered',
                            'code': 409
                        });

                    }
                    else {


                        res.send({
                            'status': 'valid',
                            'code': 400
                        });


                    }
                });



            }
    });



};


module.exports.cook_login_check = function (req, res, next) {

    // res.send('Task API');
    console.log(req.body);
    db.cook_infos.find(
        {
            cook_contact: parseInt(req.body.phone),

        }
        , function (err, cook) {

            if (err) {

                console.log(err);
                res.status(404);

                res.send('cook not find');
            } else {
                if (cook != "") {
                    if (bcrypt.compareSync(req.body.password, cook[0].cook_password)) {

                        // if (cook[0].status == "inactive" || cook[0].status == "InActive") {
                        //     res.status(400).send('account disabled');
                        //     console.log('cook is inactive');
                        // }
                        // else {
                        console.log(cook);
                        res.status(200).json(cook);

                        // }
                    }
                    else {

                        res.status(401).send('Credentials Are Invalid.!');


                    }

                }
                else {
                    console.log(cook);
                    res.status(401).send('Credentials Are Invalid.!');

                    console.log('cook not valid');
                }


            }


        });
};

module.exports.cook_pass_update = function (req, res, next) {

    //console.log('cook pass update');
    console.log(req.body);
    var flag = false;
    db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.cook_id)

        }
        , function (err, cook) {

            if (err || cook == "") {

                console.log(err);
                res.status(404);
                res.send('cook not find');
            } else {

                if (bcrypt.compareSync(req.body.old_pass, cook[0].cook_password)) {
                    //     console.log(cook);
                    // res.status(200).json(cook);
                    db.cook_infos.findAndModify({
                        query: { _id: mongojs.ObjectId(req.body.cook_id) },
                        update: {
                            $set: {

                                cook_password: bcrypt.hashSync(req.body.new_pass, bcrypt.genSaltSync(10))
                            }
                        },
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {

                            flag = false;

                        }
                        res.status(200);
                        res.send("Password Successfully Updated");
                        flag = true;
                        console.log('COOK password UPDATED');
                    })


                }
                else {
                    if (flag) {
                        console.log('pass updated');
                    }
                    else if (!flag) {
                        res.status(400).send('err');
                        console.log('not match');
                    }
                    // res.status(200).send('fine');


                }


            }
        });

};


module.exports.cook_deactivate = function (req, res, next) {


    console.log(req.body);


    db.cook_infos.find(
        {

            _id: mongojs.ObjectId(req.body.cook_id),

            cook_contact: parseInt(req.body.cook_contact_no),
        }
        , function (err, cook) {


            if (err || cook == "") {
                res.status(404);
                res.status(404).send('details are incorrect');
            } else {


                if (bcrypt.compareSync(req.body.cook_password, cook[0].cook_password)) {
                    db.cook_infos.findAndModify({
                        query: {
                            _id: mongojs.ObjectId(req.body.cook_id),


                        },
                        update: {
                            $set: {

                                status: "inactive"
                            }
                        },
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {
                            res.status(400);
                            res.send('error');
                            console.log('err');
                            throw err;

                        }

                        res.status(200).send({ 'status': 'acount deactivated' });

                    });

                }
                else {

                    res.status(404).send('password not match');
                    console.log('password not match');
                }
            }

        });

};

module.exports.cook_profile_update = function (req, res, next) {


    console.log(req.body);
    /**********************NOTES
     * Make a array subdocument in cook_infos which stores  available hours
     * 
     * 
     * ********** */
    db.cook_infos.find({

        _id: mongojs.ObjectId(req.body.cook_id),

    }
        //,
        // {food_details:0,available_hours:0,bank_account_no:0,bank_name:0}
        , function (err, data, lastErrorObject) {
            if (err) {
                res.status(400);
                res.send('error');
                throw err;

            }

            console.log('cook detail');
            console.log(data);
            var cook_info;
            cook_info = data[0];



            var updated_data = [];
            var updated_data_final = [];
            var updated_obj = {};
            var main_obj = {};
            //   if(req.body.hasOwnProperty('cook_name')){

            // if (cook_info.cook_name != req.body.cook_name) {
            //     updated_obj = {};
            //     updated_obj.field_name = 'Name';
            //     updated_obj.field_attr = "cook_name";
            //     updated_obj.field_value = req.body.cook_name;
            //     updated_obj.old_val = data[0].cook_name;
            //     updated_data.push(updated_obj);
            //     console.log('COOK NAME CHANGED');


            // }

            if (cook_info.cook_contact != req.body.cook_contact) {
                updated_obj = {};
                updated_obj.id = randomstring.generate(13);
                updated_obj.field_name = 'Contact';
                updated_obj.field_attr = "cook_contact";
                updated_obj.field_value = req.body.cook_contact;
                updated_obj.old_val = data[0].cook_contact;
                updated_data.push(updated_obj);

            }


            if (cook_info.delivery_by != req.body.delivery_by) {
                updated_obj = {};

                updated_obj.id = randomstring.generate(13);
                updated_obj.field_name = 'Delivery By';
                updated_obj.field_attr = "delivery_by";
                updated_obj.field_value = req.body.delivery_by;
                updated_obj.old_val = data[0].delivery_by;
                updated_data.push(updated_obj);
                console.log('COOK Delivery CHANGED');
            }


            if (cook_info.updated_fields.length > 0) {

                updated_data_final = cook_info.updated_fields;

                // updated_data_final.push(updated_data);

                for (var i = 0; i < updated_data.length; i++) {

                    updated_data_final.push(updated_data[i]);

                }

            }
            if (cook_info.updated_fields.length < 1) {

                for (var i = 0; i < updated_data.length; i++) {

                    updated_data_final.push(updated_data[i]);

                }

            }






            console.log(updated_data_final);
            //   res.send(updated_data);


            // FOR CHECKING PREVIOUS UPDATE
            //    if(cook_info.updated_fields.length>0){

            //           for(var i=0;i<cook_info.length;i++){

            //                 for(var )
            //               if(cook_info[i].)
            //           }

            //    }

            var is_delvery_range = false;

            if (req.body.hasOwnProperty('delivery_range')) {

                if (req.body.delivery_range != '') {

                    if (req.body.hasOwnProperty('activation_stat')) {

                        console.log('IT HAS ACTIVATON STAT');
                        db.cook_infos.findAndModify({
                            query: { _id: mongojs.ObjectId(req.body.cook_id) },
                            update: {
                                $set: {

                                    cook_name: req.body.cook_name,
                                    cook_email: req.body.cook_email,
                                    street_address: req.body.street_address,
                                    gender: req.body.gender,
                                    landmark: req.body.landmark,
                                    city: req.body.city,
                                    pincode: req.body.pincode,
                                    state: req.body.state,
                                    cook_latitude: req.body.cook_latitude,
                                    cook_longitude: req.body.cook_longitude,

                                    delivery_by: req.body.delivery_by,
                                    delivery_range: req.body.delivery_range,
                                    //   available_hours: req.body.available_hours,

                                    updated_fields: updated_data_final,
                                    status: req.body.activation_stat
                                }

                            }
                            ,
                            new: true
                        }, function (err, data, lastErrorObject) {
                            if (err) {
                                res.status(400);
                                res.send('error');
                                throw err;

                            }


                            res.status(200).send({ 'status': 'success'});

                        });

                    }
                    else {

                        db.cook_infos.findAndModify({
                            query: { _id: mongojs.ObjectId(req.body.cook_id) },
                            update: {
                                $set: {

                                    cook_name: req.body.cook_name,
                                    cook_email: req.body.cook_email,
                                    street_address: req.body.street_address,
                                    gender: req.body.gender,
                                    landmark: req.body.landmark,
                                    city: req.body.city,
                                    pincode: req.body.pincode,
                                    state: req.body.state,
                                    cook_latitude: req.body.cook_latitude,
                                    cook_longitude: req.body.cook_longitude,

                                    delivery_by: req.body.delivery_by,
                                    delivery_range: req.body.delivery_range,
                                    //  available_hours: req.body.available_hours,

                                    updated_fields: updated_data_final,
                                    isApproved: 'updated'
                                }

                            }
                            ,
                            new: true
                        }, function (err, data, lastErrorObject) {
                            if (err) {
                                res.status(400);
                                res.send('error');
                                throw err;

                            }


                            res.status(200).send({ 'status': 'success' });

                        });

                    }



                }



            }
            else {

                if (req.body.hasOwnProperty('activation_stat')) {

                    console.log('IT HAS ACTIVATON STAT');
                    db.cook_infos.findAndModify({
                        query: { _id: mongojs.ObjectId(req.body.cook_id) },
                        update: {
                            $set: {

                                cook_name: req.body.cook_name,
                                cook_email: req.body.cook_email,
                                street_address: req.body.street_address,
                                gender: req.body.gender,
                                landmark: req.body.landmark,
                                city: req.body.city,
                                pincode: req.body.pincode,
                                state: req.body.state,
                                cook_latitude: req.body.cook_latitude,
                                cook_longitude: req.body.cook_longitude,

                                //   available_hours: req.body.available_hours,

                                updated_fields: updated_data_final,
                                status: req.body.activation_stat
                            }

                        }
                        ,
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {
                            res.status(400);
                            res.send('error');
                            throw err;

                        }


                        res.status(200).send({ 'status': 'success' });

                    });

                }
                else {

                    db.cook_infos.findAndModify({
                        query: { _id: mongojs.ObjectId(req.body.cook_id) },
                        update: {
                            $set: {

                                cook_name: req.body.cook_name,
                                cook_email: req.body.cook_email,
                                street_address: req.body.street_address,
                                gender: req.body.gender,
                                landmark: req.body.landmark,
                                city: req.body.city,
                                pincode: req.body.pincode,
                                state: req.body.state,
                                cook_latitude: req.body.cook_latitude,
                                cook_longitude: req.body.cook_longitude,

                                //  available_hours: req.body.available_hours,

                                updated_fields: updated_data_final,
                                isApproved: 'updated'
                            }

                        }
                        ,
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {
                            res.status(400);
                            res.send('error');
                            throw err;

                        }


                        res.status(200).send({ 'status': 'success'});

                    });

                }



            }




            //}

        });


}
module.exports.get_cook_profile_data = function (req, res, next) {


    db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.cook_id)

        }
        , function (err, cook) {

            if (err || cook == "") {

                console.log(err);
                res.status(404);
                res.send('cook not find');
            } else {

                res.status(200).send(cook);

            }
        });
}

module.exports.cook_company_details_update = function (req, res, next) {

    var update_col = [];
    console.log(req.body);
  //  if (req.body.cook_banner_img == "") {

        console.log('This is LOG NULL');
        console.log(req.body);
        db.cook_infos.find({
            _id: mongojs.ObjectId(req.body.cook_id)
        }
            , function (err, data, lastErrorObject) {
                if (err) {
                    res.status(400);
                    res.send('error');
                    throw err;

                }


                console.log(data[0].cook_name);
                var updated_data = [];
                var updated_data_final = [];
                var updated_obj = {};

                if (data[0].cook_company_name != req.body.cook_company_name) {

                    updated_obj = {};

                    updated_obj.id = randomstring.generate(13);
                    updated_obj.field_name = 'Company Name';
                    updated_obj.field_attr = "cook_company_name";
                    updated_obj.field_value = req.body.cook_company_name;
                    updated_obj.old_val = data[0].cook_company_name;
                    updated_data.push(updated_obj);
                    console.log('COOK Comapny Name CHANGED');

                }

                if (data[0].bank_type != req.body.bank_type) {

                    updated_obj = {};

                    updated_obj.id = randomstring.generate(13);
                    updated_obj.field_name = 'Bank Type';
                    updated_obj.field_attr = "bank_type";
                    updated_obj.field_value = req.body.bank_type;
                    updated_obj.old_val = data[0].bank_type;
                    updated_data.push(updated_obj);
                    console.log('COOK Bank Name CHANGED');

                }

                if (data[0].cook_name_on_bank_acc != req.body.cook_name_on_bank_acc) {

                    updated_obj = {};

                    updated_obj.id = randomstring.generate(13);
                    updated_obj.field_name = 'Name On Bank Account';
                    updated_obj.field_attr = "cook_name_on_bank_acc";
                    updated_obj.field_value = req.body.cook_name_on_bank_acc;
                    updated_obj.old_val = data[0].cook_name_on_bank_acc;
                    updated_data.push(updated_obj);
                    console.log('COOK Bank Acc Name CHANGED');

                }

                if (data[0].branch_name != req.body.branch_name) {

                    updated_obj = {};

                    updated_obj.id = randomstring.generate(13);
                    updated_obj.field_name = 'Branch Name';
                    updated_obj.field_attr = "branch_name";
                    updated_obj.field_value = req.body.branch_name;
                    updated_obj.old_val = data[0].branch_name;
                    updated_data.push(updated_obj);
                    console.log('Branch Name CHANGED');

                }

                if (data[0].bank_account_no != req.body.bank_account_no) {

                    updated_obj = {};

                    updated_obj.id = randomstring.generate(13);
                    updated_obj.field_name = 'Bank Account No.';
                    updated_obj.field_attr = "bank_account_no";
                    updated_obj.field_value = req.body.bank_account_no;
                    updated_obj.old_val = data[0].bank_account_no;
                    updated_data.push(updated_obj);
                    console.log('Acc No. CHANGED');

                }

                if (data[0].bank_ifsc != req.body.bank_ifsc) {

                    updated_obj = {};

                    updated_obj.id = randomstring.generate(13);
                    updated_obj.field_name = 'Bank IFSC';
                    updated_obj.field_attr = "bank_ifsc";
                    updated_obj.field_value = req.body.bank_ifsc;
                    updated_obj.old_val = data[0].bank_ifsc;
                    updated_data.push(updated_obj);
                    console.log('IFSC Code CHANGED');

                }
                  if (data[0].bank_name != req.body.bank_name) {

                    updated_obj = {};

                    updated_obj.id = randomstring.generate(13);
                    updated_obj.field_name = 'Bank Name';
                    updated_obj.field_attr = "bank_name";
                    updated_obj.field_value = req.body.bank_name;
                    updated_obj.old_val = data[0].bank_name;
                    updated_data.push(updated_obj);
                    console.log('Bank Name CHANGED');

                }



                if (data[0].updated_fields.length > 0) {

                    updated_data_final = data[0].updated_fields;

                    // updated_data_final.push(updated_data);

                    for (var i = 0; i < updated_data.length; i++) {

                        updated_data_final.push(updated_data[i]);

                    }

                }
                if (data[0].updated_fields.length < 1) {

                    for (var i = 0; i < updated_data.length; i++) {

                        updated_data_final.push(updated_data[i]);

                    }

                }


                // if (data[0].bank_type != req.body.bank_type) {
                //     var update_fields = {};
                //     update_fields.field_name = "Bank Type";
                //     update_fields.field_attr = "bank_type";
                //     update_fields.field_value = req.body.bank_type;
                //     update_fields.old_val = data[0].bank_type;
                //     update_col.push(update_fields);
                // }
                // if (data[0].cook_name_on_bank_acc != req.body.cook_name_on_bank_acc) {
                //     var update_fields = {};
                //     update_fields.field_name = "Cook Name On Bank Account";
                //     update_fields.field_attr = "cook_name_on_bank_acc";
                //     update_fields.field_value = req.body.cook_name_on_bank_acc;
                //     update_fields.old_val = data[0].cook_name_on_bank_acc;
                //     update_col.push(update_fields);
                // }
                // if (data[0].branch_name != req.body.branch_name) {
                //     var update_fields = {};
                //     update_fields.field_name = "Cook Branch Name";
                //     update_fields.field_attr = "branch_name";
                //     update_fields.field_value = req.body.branch_name;
                //     update_fields.old_val = data[0].branch_name;
                //     update_col.push(update_fields);
                // }
                // if (data[0].bank_account_no != req.body.bank_account_no) {
                //     var update_fields = {};
                //     update_fields.field_name = "Cook Bank Account Number";
                //     update_fields.field_attr = "bank_account_no";
                //     update_fields.field_value = req.body.bank_account_no;
                //     update_fields.old_val = data[0].bank_account_no;
                //     update_col.push(update_fields);
                // }
                // if (data[0].bank_ifsc != req.body.bank_ifsc) {
                //     var update_fields = {};
                //     update_fields.field_name = "Cook Bank IFSC";
                //     update_fields.field_attr = "bank_ifsc";
                //     update_fields.field_value = req.body.bank_ifsc;
                //     update_fields.old_val = data[0].bank_ifsc;
                //     update_col.push(update_fields);
                // }





                //                     if (cook_info.delivery_by != req.body.delivery_by) {
                //     updated_obj = {};

                //     updated_obj.id = randomstring.generate(13);
                //     updated_obj.field_name = 'Delivery By';
                //     updated_obj.field_attr = "delivery_by";
                //     updated_obj.field_value = req.body.delivery_by;
                //     updated_obj.old_val = data[0].delivery_by;
                //     updated_data.push(updated_obj);
                //     console.log('COOK Delivery CHANGED');
                // }


                // if(cook_info.updated_fields.length>0){

                //     updated_data_final=cook_info.updated_fields;

                //    // updated_data_final.push(updated_data);

                //     for(var i=0;i<updated_data.length;i++){

                //             updated_data_final.push(updated_data[i]);

                //     }

                // }

                db.cook_infos.findAndModify({
                    query: { _id: mongojs.ObjectId(req.body.cook_id) },
                    update: {
                        $set: {

                            updated_fields: updated_data_final


                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    res.send({'status':'success'});
                    console.log('cook PROFILE NULL');
                });


                // db.cook_infos.findAndModify({
                //     query: { _id: mongojs.ObjectId(req.body.cook_id) },
                //     update: {
                //         $set: {

                //             about_us: req.body.about_us,
                //             cook_company_name: req.body.cook_company_name,

                //             bank_type: req.body.bank_type,
                //             bank_name: req.body.bank_name,
                //             branch_name: req.body.branch_name,
                //             isApproved: 'updated',
                //             bank_ifsc: req.body.bank_ifsc,
                //             cook_name_on_bank_acc: req.body.cook_name_on_bank_acc,
                //             bank_account_no: req.body.bank_account_no,
                //             updated_fields: update_col


                //         }
                //     },
                //     new: true
                // }, function (err, data, lastErrorObject) {
                //     if (err) {
                //         res.status(400);
                //         res.send('error');
                //         throw err;

                //     }

                //     res.status(200);
                //     res.send(data);
                //     console.log('cook PROFILE UPDATED');
                // });

            });




 //   }
    // else if (req.body.cook_banner_img != "") {
    //     dns.lookup(os.hostname(), function (err, add, fam) {


    //         var cook_bn_img = randomstring.generate(13);

    //         var cook_bn_img_for_web = '/uploads/cook_uploads/' + cook_bn_img + '.jpg';

    //         var cook_banner_img = add + ':3000/uploads/cook_uploads/' + cook_bn_img + '.jpg';


    //         fs.writeFile("client/uploads/cook_uploads/" + cook_bn_img + ".jpg", new Buffer(req.body.cook_banner_img, "base64"), function (err) {

    //             if (err) {

    //                 throw err;
    //                 console.log(err);
    //                 res.send(err)
    //             }
    //             else {
    //                 console.log('cook banner Img uploaded');
    //                 // res.send("success");
    //                 // console.log("success!");
    //             }

    //         });

    //         db.cook_infos.find({
    //             _id: mongojs.ObjectId(req.body.cook_id)
    //         }
    //             , function (err, data, lastErrorObject) {
    //                 if (err) {
    //                     res.status(400);
    //                     res.send('error');
    //                     throw err;

    //                 }


    //                 console.log(data[0].cook_name);

    //                 if (data[0].about_us != req.body.about_us) {
    //                     var update_fields = {};
    //                     update_fields.field_name = "About Cook";
    //                     update_fields.field_attr = "about_us";
    //                     update_fields.field_value = req.body.about_us;
    //                     update_fields.old_val = data[0].about_us;
    //                     update_col.push(update_fields);
    //                 }

    //                 if (data[0].cook_company_name != req.body.cook_company_name) {
    //                     var update_fields = {};
    //                     update_fields.field_name = "Company Name";
    //                     update_fields.field_attr = "cook_company_name";
    //                     update_fields.field_value = req.body.cook_company_name;
    //                     update_fields.old_val = data[0].about_us;
    //                     update_col.push(update_fields);
    //                 }
    //                 if (data[0].bank_type != req.body.bank_type) {
    //                     var update_fields = {};
    //                     update_fields.field_name = "Bank Type";
    //                     update_fields.field_attr = "bank_type";
    //                     update_fields.field_value = req.body.bank_type;
    //                     update_fields.old_val = data[0].bank_type;
    //                     update_col.push(update_fields);
    //                 }
    //                 if (data[0].cook_name_on_bank_acc != req.body.cook_name_on_bank_acc) {
    //                     var update_fields = {};
    //                     update_fields.field_name = "Cook Name On Bank Account";
    //                     update_fields.field_attr = "cook_name_on_bank_acc";
    //                     update_fields.field_value = req.body.cook_name_on_bank_acc;
    //                     update_fields.old_val = data[0].cook_name_on_bank_acc;
    //                     update_col.push(update_fields);
    //                 }
    //                 if (data[0].branch_name != req.body.branch_name) {
    //                     var update_fields = {};
    //                     update_fields.field_name = "Cook Branch Name";
    //                     update_fields.field_attr = "branch_name";
    //                     update_fields.field_value = req.body.branch_name;
    //                     update_fields.old_val = data[0].branch_name;
    //                     update_col.push(update_fields);
    //                 }
    //                 if (data[0].bank_account_no != req.body.bank_account_no) {
    //                     var update_fields = {};
    //                     update_fields.field_name = "Cook Bank Account Number";
    //                     update_fields.field_attr = "bank_account_no";
    //                     update_fields.field_value = req.body.bank_account_no;
    //                     update_fields.old_val = data[0].bank_account_no;
    //                     update_col.push(update_fields);
    //                 }
    //                 if (data[0].bank_ifsc != req.body.bank_ifsc) {
    //                     var update_fields = {};
    //                     update_fields.field_name = "Cook Bank IFSC";
    //                     update_fields.field_attr = "bank_ifsc";
    //                     update_fields.field_value = req.body.bank_ifsc;
    //                     update_fields.old_val = data[0].bank_ifsc;
    //                     update_col.push(update_fields);
    //                 }

    //                 var update_fields = {};
    //                 update_fields.field_name = "Cook Banner";
    //                 update_fields.field_attr = "cook_banner_img_for_web";

    //                 update_col.push(update_fields);

    //                 db.cook_infos.findAndModify({
    //                     query: { _id: mongojs.ObjectId(req.body.cook_id) },
    //                     update: {
    //                         $set: {

    //                             updated_fields: []


    //                         }
    //                     },
    //                     new: true
    //                 }, function (err, data, lastErrorObject) {
    //                     if (err) {
    //                         res.status(400);
    //                         res.send('error');
    //                         throw err;

    //                     }

    //                     console.log('cook PROFILE NULL');
    //                 });


    //                 db.cook_infos.findAndModify({
    //                     query: { _id: mongojs.ObjectId(req.body.cook_id) },
    //                     update: {
    //                         $set: {

    //                             about_us: req.body.about_us,
    //                             cook_company_name: req.body.cook_company_name,
    //                             cook_banner_img: cook_banner_img,
    //                             cook_banner_img_for_web: cook_bn_img_for_web,
    //                             bank_type: req.body.bank_type,
    //                             bank_name: req.body.bank_name,
    //                             branch_name: req.body.branch_name,
    //                             isApproved: 'updated',
    //                             bank_ifsc: req.body.bank_ifsc,
    //                             cook_name_on_bank_acc: req.body.cook_name_on_bank_acc,
    //                             bank_account_no: req.body.bank_account_no,
    //                             updated_fields: update_col


    //                         }
    //                     },
    //                     new: true
    //                 }, function (err, data, lastErrorObject) {
    //                     if (err) {
    //                         res.status(400);
    //                         res.send('error');
    //                         throw err;

    //                     }

    //                     res.status(200);
    //                     res.send(data);
    //                     console.log('cook PROFILE UPDATED');
    //                 });

    //             });


    //     });

    // }




}




module.exports.get_cusines_list = function (req, res, next) {

    db.categories_infos.find({}
        , {
            _id: false,
            category_name: true,
            status: true
        }
        ,
        function (err, category) {

            if (err || category == "") {

                console.log(category);
                res.status(404);
                res.send('category not find');
            } else {

                console.log(category);
                res.status(200).send(category);

            }
        });

}


module.exports.get_occ_veg_list = function (req, res, next) {



    db.attributes_infos.find({}, function (err, attribute_infos) {

        if (err || !attribute_infos) console.log(err);
        else {

            //  var len=attribute_infos[0].groupname.length
            //   res.status(200).send(attribute_infos[0].groupname[0].group_fields);
            // var data=[];
            // var Occassions;
            // var Vegetable_type;


            //     Occassions=attribute_infos[0].groupname[0].group_fields;
            //     Vegetable_type=attribute_infos[0].groupname[1].group_fields;

            //     data.push(Occassions);
            //     data.push(Vegetable_type);


            res.send(attribute_infos);
            console.log(attribute_infos);
        }
    });


}


module.exports.add_food_details = function (req, res, next) {

    //test
    console.log(req.body.files.length);
    // var img_len = req.body.files.length;
    // var img_name;
    // var img_arr = [];
    // var img_obj = {};
    // for (var i = 0; i < img_len; i++) {

    //     img_obj = {};
    //     img_name = randomstring.generate(13);
    //     img_obj.img_name =img_name;

    //     img_arr.push(img_obj);

    //         fs.writeFile("client/uploads/" + img_name + ".jpg", new Buffer(req.body.files[i], "base64"), function (err) {

    //             if (err) {

    //                 throw err;
    //                 console.log(err);
    //                 res.send(err)
    //             }
    //             else {
    //                 console.log('FOod image uploaded');
    //                 // res.send("success");
    //                 // console.log("success!");
    //             }

    //         });

    // }

    //test



    var ip_details;
    console.log(req.body.food_details);
    var cook_name = "";
    db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.food_details.cook_id)

        },
        { cook_name: 1 }
        , function (err, cook) {

            if (err) {

                console.log(err);
                res.status(404);
                res.send('cook not found');
            } else {

                console.log(cook);
                cook_name = cook[0].cook_name;




                dns.lookup(os.hostname(), function (err, add, fam) {

                    var occ_len = req.body.food_details.occassion_list.length;
                    var cuss_len = req.body.food_details.cuisine_types.length;
                    var occ_data = [];
                    var cuss_data = [];
                    var available_hours = req.body.food_details.available_hours;
                    var date = new Date();
                    var img_name = date.getTime();

                    var food_img_for_web = '/uploads/cook_uploads/raw/' + img_name + '.jpg';

                    for (var i = 0; i < occ_len; i++) {
                        occ_data.push(req.body.food_details.occassion_list[i]);
                    }
                    for (var i = 0; i < cuss_len; i++) {
                        cuss_data.push(req.body.food_details.cuisine_types[i]);
                    }


                    var img_len = req.body.files.length;
                    var img_name;
                    var img_arr = [];
                    var img_obj = {};
                    for (var i = 0; i < img_len; i++) {

                        img_obj = {};
                        img_name = randomstring.generate(13);
                        img_obj.food_img = add + ':3000/uploads/cook_uploads/raw/' + img_name + '.jpg';
                        img_obj.food_img_web = '/uploads/cook_uploads/raw/' + img_name + '.jpg';
                        img_obj.img_name = img_name + '.jpg';
                        // img_arr.push(img_obj);

                        fs.writeFile("client/uploads/cook_uploads/raw/" + img_name + ".jpg", new Buffer(req.body.files[i], "base64"), function (err) {

                            if (err) {

                                throw err;
                                console.log(err);
                                res.send(err)
                            }
                            else {
                                console.log('FOod image uploaded');

                            }

                        });

                        Jimp.read(Buffer.from(req.body.files[i], 'base64'), function (err, lenna) {
                            if (err) throw err;
                            lenna.resize(143, 128, Jimp.RESIZE_HERMITE)            // resize
                                .quality(100)                 // set JPEG quality
                                // set greyscale
                                .write("client/uploads/cook_uploads/200_by_250/" + img_name + ".jpg");
                        });
                        Jimp.read(Buffer.from(req.body.files[i], 'base64'), function (err, lenna) {
                            if (err) throw err;
                            lenna.resize(40, 40, Jimp.RESIZE_HERMITE)            // resize
                                .quality(100)                 // set JPEG quality
                                // set greyscale
                                .write("client/uploads/cook_uploads/thumb/" + img_name + ".jpg");
                        });

                        img_arr.push(img_obj);
                    }


                    // var food_img = add + ':3000/uploads/cook_uploads/' + img_name + '.jpg';

                    // fs.writeFile("client/uploads/cook_uploads/" + img_name + ".jpg", new Buffer(req.body.files, "base64"), function (err) {

                    //     if (err) {

                    //         throw err;
                    //         console.log(err);
                    //         res.send(err)
                    //     }
                    //     else {
                    //         console.log('FOod image uploaded');
                    //         // res.send("success");
                    //         // console.log("success!");
                    //     }

                    // });

                    db.cook_infos.findAndModify(

                        {
                            query: { _id: mongojs.ObjectId(req.body.food_details.cook_id) },
                            update: {
                                $push: {
                                    'food_details': {
                                        _id: mongojs.ObjectId(),
                                        'cook_id': req.body.food_details.cook_id,
                                        'food_selection': req.body.food_details.food_selection,
                                        'cook_name': cook_name,
                                        'food_name': req.body.food_details.food_name,
                                        'food_desc': req.body.food_details.food_desc,
                                        'food_price_per_plate': req.body.food_details.food_price_per_plate,
                                        'food_total_qty': req.body.food_details.food_total_qty,
                                        'food_min_qty': req.body.food_details.food_min_qty,
                                        'food_max_qty': req.body.food_details.food_max_qty,
                                        'cart_qty': '0',
                                        'food_isApproved': 'new',
                                        'food_status': 'Disable',
                                        'occassion_list': occ_data,
                                        'cuisine_list': cuss_data,
                                        'food_type': req.body.food_details.food_type,
                                        'selected_date_from': req.body.food_details.selected_date_from,
                                        'selected_date_to': req.body.food_details.selected_date_to,

                                        'available_hours': available_hours,
                                        'food_img': img_arr
                                        // 'food_img_for_web': food_img_for_web

                                    },

                                }
                            },
                            new: true
                        }
                        , function (err, food, lastErrorObject) {
                            if (err) {
                                res.status(400);
                                res.send('error');
                                throw err;

                            }
                            else {


                                console.log('food adds');
                                res.status(200);
                                res.send(food);


                            }


                        });

                });

            }
        });






    // // //    db.attribute_infos.find(function(err, attribute_infos) {

    //   if( err || !attribute_infos) console.log(err);
    //   else 
    //       {
    //             res.status(200).send(attribute_infos);
    //             console.log(attribute_infos);
    //       }     
    // });

}
module.exports.get_cook_details = function (req, res, next) {

    console.log(req.body);
    db.cook_infos.find({ _id: mongojs.ObjectId(req.body.cook_id) }, function (err, cook_details) {

        if (err) console.log(err);

        else {
            res.status(200).send(cook_details[0].food_details)
            console.log(cook_details[0].food_details);
        }
    });

}



module.exports.remove_food_details = function (req, res, next) {

    console.log(req.body);

    db.cook_infos.findAndModify({
        query: { _id: mongojs.ObjectId(req.body.cook_id) },
        update: {
            $pull: { 'food_details': { _id: mongojs.ObjectId(req.body.food_id) } }

        }

    }, function (err, data, lastErrorObject) {
        if (err) {
            res.status(400);
            res.send('error');
            throw err;

        }
        console.log('deleted');
        res.status(200).send(data);

    });

}

module.exports.edit_food_details = function (req, res, next) {


    console.log(req.body);
    db.cook_infos.find({ 'food_details._id': mongojs.ObjectId(req.body.food_id) }, function (err, cook_details) {

        if (err) {
            res.status(400);
            res.send('error');
            throw err;
        }

        //   console.log(cook_details[0]);
        var len = cook_details[0].food_details.length;
        console.log(len);
        for (var i = 0; i < len; i++) {

            if (cook_details[0].food_details[i]._id == req.body.food_id) {

                res.status(200).send(cook_details[0].food_details[i]);
            }
            else {

            }
        }
        //  res.status(200).send(cook_details[0].food_details);


    });


}


module.exports.update_food_details = function (req, res, next) {

    //console.log(req.body.update_food_details);
    //  console.log(req.body.files.length);
    var date = new Date();

    db.cook_infos.update({
        "food_details._id": mongojs.ObjectId(req.body.food_id)
    },

        {
            "$set": {
                "food_img": []

            }

        }

        ,
        function (err, data, lastErrorObject) {
            if (err) {
                res.status(400);
                res.send('error');
                throw err;

            }


            dns.lookup(os.hostname(), function (err, add, fam) {

                // if (req.body.files == "") {


                var occ_len = req.body.food_details.occassion_list.length;
                var cuss_len = req.body.food_details.cuisine_list.length;
                var occ_data = [];
                var cuss_data = [];

                var available_hours = req.body.food_details.available_hours;

                console.log(available_hours);
                for (var i = 0; i < occ_len; i++) {
                    occ_data.push(req.body.food_details.occassion_list[i]);
                }

                for (var i = 0; i < cuss_len; i++) {
                    cuss_data.push(req.body.food_details.cuisine_list[i]);
                }

                var img_len = req.body.files.length;
                var img_name;
                var img_arr = [];
                var img_obj = {};
                for (var i = 0; i < img_len; i++) {

                    img_obj = {};
                    img_name = randomstring.generate(13);
                    img_obj.food_img = add + ':3000/uploads/cook_uploads/' + img_name + '.jpg';
                    img_obj.food_img_web = '/uploads/cook_uploads/raw/' + img_name + '.jpg';
                    img_obj.img_name = img_name + '.jpg';

                    img_arr.push(img_obj);

                    fs.writeFile("client/uploads/cook_uploads/raw/" + img_name + ".jpg", new Buffer(req.body.files[i], "base64"), function (err) {

                        if (err) {

                            throw err;
                            console.log(err);
                            res.send(err)
                        }
                        else {
                            console.log('FOod image uploaded');
                            // res.send("success");
                            // console.log("success!");
                        }

                    });

                }



                db.cook_infos.findAndModify({
                    query: { 'food_details._id': mongojs.ObjectId(req.body.food_id) },
                    update: {
                        $set: {
                            'food_details.$.food_selection': req.body.food_details.food_selection,
                            'food_details.$.food_name': req.body.food_details.food_name,
                            'food_details.$.food_desc': req.body.food_details.food_desc,
                            'food_details.$.food_price_per_plate': req.body.food_details.food_price_per_plate,
                            'food_details.$.food_total_qty': req.body.food_details.food_total_qty,
                            'food_details.$.food_min_qty': req.body.food_details.food_min_qty,
                            'food_details.$.food_max_qty': req.body.food_details.food_max_qty,
                            'food_details.$.occassion_list': occ_data,
                            'food_details.$.cuisine_list': cuss_data,
                            'food_details.$.available_hours': available_hours,
                            'food_details.$.selected_date_from': req.body.food_details.selected_date_from,
                            'food_details.$.selected_date_to': req.body.food_details.selected_date_to,
                            'food_details.$.food_img': img_arr,
                            'food_details.$.food_type': req.body.food_details.food_type,

                            'food_details.$.food_isApproved': 'Un Appr',

                        }

                    }
                    ,
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    else {
                        console.log(data);
                        console.log('Name UPdated');


                    }

                    res.status(200).send('success');
                });



            });


        });



}
module.exports.get_cook_activation_status = function (req, res, next) {

    db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.cook_id)

        }
        , function (err, cook) {

            if (err || cook == "") {

                console.log(err);
                res.status(404);
                res.send('cook not find');
            } else {

                console.log('PROFILE DATA');
                console.log(cook[0].isApproved);
                res.status(200).send(cook[0].isApproved);

            }
        });

}


module.exports.cook_contact_validate = function (req, res, next) {

    // res.send('Task API');

    db.cook_infos.find(
        {
            cook_contact: parseInt(req.body.cook_contact_no),

        }
        , function (err, cook) {

            if (err) {

                console.log(err);
                res.status(404);

                res.send('cook not find');
            } else {

                console.log(cook);
                if (cook.length < 1) {

                    res.send({ 'status': 'Not Registered' });

                }
                if (cook.length > 0) {

                    res.send({ 'status': 'Registered' });

                }


            }


        });
};

module.exports.cook_forget_pass_update = function (req, res, next) {

    console.log(req.body);

    db.cook_infos.findAndModify({
        query: { cook_contact: parseInt(req.body.cook_contact_no) },
        update: {
            $set: {
                // bcrypt.hashSync(req.body.new_pass, bcrypt.genSaltSync(10))
                cook_password: bcrypt.hashSync(req.body.cook_new_pass, bcrypt.genSaltSync(10))
            }
        },
        new: true
    }, function (err, data, lastErrorObject) {
        if (err) {

            flag = false;

        }
        res.status(200);
        res.send("Password Successfully Updated");

        console.log('COOK password UPDATED');
    });


};

module.exports.send_verify_email_to_cook = function (req, res, next) {

    db.cook_infos.find({

        _id: mongojs.ObjectId(req.body.cook_id),

    }, {

            cook_name: 1, _id: 0
        }, function (err, cook) {

            var cookname = cook[0].cook_name;

            console.log(cookname);
            var email_href = 'http://192.168.1.6:3000/#/verify-cook-params/' + req.body.cook_id + '/' + req.body.email;
            var template = process.cwd() + '/mailers/update_email_cook.html';
            //console.log(template);

            fs.readFile(template, 'utf8', function (err, file) {
                if (err) {
                    //handle errors
                    console.log('ERROR!');
                    return res.send('ERROR!');
                }

                String.prototype.replaceAll = function (target, replacement) {
                    return this.split(target).join(replacement);
                };

                var email_template = file.replace("#user_name#", cookname);
                email_template = email_template.replaceAll("#user_email#", req.body.email);
                email_template = email_template.replaceAll("#user_email_href#", email_href);

                var mailOptions = {
                    from: '"EatoEato 👻" <ankuridigitie@gmail.com>', // sender address
                    to: 'ankuridigitie@gmail.com', // list of receivers
                    subject: 'EatoEato Email Verification', // Subject line
                    //   text: 'Please Verify Your Email Account', // plain text body
                    html: email_template
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        // res.json({
                        //     yo: 'error'
                        // });
                    } else {
                        console.log('Message sent: ' + info.response);
                        res.send(info.response);

                    };
                });
            });




            //  res.send(username);

        });

    // var mailOptions = {
    //     from: '"EatoEato 👻" <ankuridigitie@gmail.com>', // sender address
    //     to: req.body.email, // list of receivers
    //     subject: 'EatoEato Cook Email Verification', // Subject line
    //     text: 'Please Verify Your Email Account', // plain text body
    //     html: '<b> Please Click on Below Link to Verify your Account</b> <br><br> <a href="http://192.168.1.6:3000/#/verify-cook-params/' + req.body.cook_id + '/' + req.body.email + '">' + randomstring.generate({ length: 100, charset: 'alphabetic' }) + '</a>' // html body
    // };


    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //         res.json({
    //             yo: 'error'
    //         });
    //     } else {
    //         console.log('Message sent: ' + info.response);
    //         res.send(info.response);

    //     };
    // });

};

module.exports.cook_verify_email_params = function (req, res, next) {
    console.log(req.params['cook_id']);
    console.log(req.params['email']);

    var get_cook_id = req.params['cook_id'];
    var get_cook_email = req.params['email'];
    db.cook_infos.findAndModify({
        query: {
            _id: mongojs.ObjectId(req.params['cook_id'])
        },
        update: {
            $set: {
                isEmailVerified: "true",
                cook_email: req.params['email']
            }
        },
        new: true
    }, function (err, cook, lastErrorObject) {
        if (err) {
            res.status(400);
            res.send(err);
            throw err;
            console.log(err);

        }

        res.status(200);
        res.send(cook);


        db.cook_infos.find({

            _id: mongojs.ObjectId(get_cook_id),

        }, {

                cook_name: 1, _id: 0
            }, function (err, cook) {

                var cookname = cook[0].cook_name;

                console.log(cookname);
                //    var email_href = 'http://192.168.1.6:3000/#/verify-cook-params/' + req.body.cook_id + '/' + req.body.email;
                var template = process.cwd() + '/mailers/update_email_cook_success.html';
                //console.log(template);

                fs.readFile(template, 'utf8', function (err, file) {
                    if (err) {
                        //handle errors
                        console.log('ERROR!');
                        return res.send('ERROR!');
                    }

                    String.prototype.replaceAll = function (target, replacement) {
                        return this.split(target).join(replacement);
                    };

                    var email_template = file.replace("#user_name#", cookname);
                    email_template = email_template.replaceAll("#user_email#", get_cook_email);
                    //     email_template = email_template.replaceAll("#user_email_href#", email_href);

                    var mailOptions = {
                        from: '"EatoEato 👻" <ankuridigitie@gmail.com>', // sender address
                        to: 'ankuridigitie@gmail.com', // list of receivers
                        subject: 'EatoEato Email Successfully Updated ', // Subject line
                        //   text: 'Please Verify Your Email Account', // plain text body
                        html: email_template
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            // res.json({
                            //     yo: 'error'
                            // });
                        } else {
                            console.log('Message sent: ' + info.response);
                            res.send(info.response);

                        };
                    });
                });


                console.log('Email Verified');
            });

    });

};
