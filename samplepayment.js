// const { Plan, Shop } =require('../../models');

const shopModel = require("../../models/shop");
const planModel = require("../../models/planModel");
const axios = require("axios");

exports.planCreate = async (req, res) => {
    try {
        const { shopName, planValue } = req.query;
        const check1 = await shopModel.find({ shopName: shopName });
        console.log("check1", check1);
        if (check1.length >= 1) {
            const accessToken = check1[0].shopToken;
            console.log(accessToken);
            const shopName = check1[0].shopName;
            console.log(shopName);

            const chargerCreateUrl = `https://${shopName}/admin/api/2022-04/recurring_application_charges.json`;
            const shopRequestHeaders = {
                "X-Shopify-Access-Token": accessToken,
            };
            let amountToCharge;
            let planName;
            if (planValue == 2) {
                amountToCharge = 4.9;
                planName = "Basic";
            } else if (planValue == 4) {
                amountToCharge = 9.99;
                planName = "Medium";
            }
            else if (planValue == 3) {
                amountToCharge = 14.99;
                planName = "Advance";
            }
            const bodyData = {
                recurring_application_charge: {
                    name: planName,
                    price: Number(amountToCharge),
                    return_url: `https://zip-code-validator.herokuapp.com/planstatus?shop=${shopName}&planValue=${planValue}`,
                    test: false,
                },
            };

            console.log("line 42 jjjjj");
            const getData = await axios({
                url: chargerCreateUrl,
                method: "POST",
                headers: shopRequestHeaders,
                data: bodyData,
            });

            console.log("line 50", getData.status);
            if (getData.status === 201 || getData.status === 200) {
                console.log("status part");
                const { confirmation_url } = getData.data.recurring_application_charge;
                console.log("line 54", confirmation_url);
                res.redirect(confirmation_url);
            } else {
                console.log(error);
                res.status(200).json({
                    message: "er here",
                });
            }
        } else {
            res.status(200).json({
                message: "flag0",
            });
        }
    } catch (error) {
        const err = error
        if (err.response) {
            console.log(err.response.status)
            console.log(err.response.data)
        }
        // this.handleAxiosError(error)
        res.status(200).json({
            message: "here is the ======>>> err last",
            error: error,
        });
    }
};
//26927071476

exports.planStatus = async (req, res) => {
    try {
        const { charge_id, shop: shopName, planValue } = req.query;
        if (!planValue) {
            console.log("required");
        }
        const checker = await shopModel.find({ shopName });
        console.log("48 planMonth.js", checker);
        if (checker.length >= 1) {
            const accessToken = checker[0].shopToken;
            console.log("accessToken", accessToken);
            const shop = checker[0].shopName;
            console.log("shop", shop);
            const shopRequestHeaders = {
                "X-Shopify-Access-Token": accessToken,
            };
            const getData = await axios({
                url: `https://${shop}/admin/api/2022-04/recurring_application_charges/${charge_id}.json`,
                method: "GET",
                headers: shopRequestHeaders,
            });
            console.log("line 99", getData);

            if (getData.status === 201 || getData.status === 200) {
                console.log("146");
                console.log("line 146===========>>>>>", getData);

                const { status, id, activated_on, return_url } =
                    getData.data.recurring_application_charge;

                console.log(
                    "150===>>>>>>>>>>>>>",
                    getData.data.recurring_application_charge
                );
                console.log("150===>>>>>>>>>>>>>", status, activated_on);

                let ViewsToGive;
                let planName;
                if (planValue == 2) {
                    console.log("153");

                    ViewsToGive = 5000;
                    planName = "Basic";
                }
                if (planValue == 4) {
                    console.log("159");
                    ViewsToGive = 50000;
                    planName = "Medium";
                }
                if (planValue == 3) {
                    console.log("159");
                    ViewsToGive = 15;
                    planName = "Advance";
                }

                const planData = {
                    shop: shop,
                    activationDate: activated_on,
                    currentPlan: planValue,
                    thisMonthTaken: "true",
                    totalViewsused: 0,
                    totalViewsReceived: ViewsToGive,
                    planStatus: "active",
                    planFullDetail: getData.data.recurring_application_charge,
                };
                console.log("plain", planData);
                if (status == "active") {
                    console.log("178");

                    const checker = await shopModel.find({ shopName });
                    console.log("checker", checker);
                    if (checker.length >= 1) {
                        console.log("184");

                        let planDataUpd;
                        if (checker[0].planStatus == "active") {
                            planDataUpd = {
                                shop: shop,
                                activationDate: activated_on,
                                currentPlan: planValue,
                                thisMonthTaken: "true",
                                totalViewsused: 0,
                                totalViewsReceived: ViewsToGive,
                                planStatus: "active",
                                planFullDetail: getData.data.recurring_application_charge,
                            };
                        } else {
                            planDataUpd = {
                                shop: shop,
                                activationDate: activated_on,
                                currentPlan: planValue,
                                thisMonthTaken: "true",
                                totalViewsused: 1,
                                totalViewsReceived: ViewsToGive,
                                planStatus: "active",
                                planFullDetail: getData.data.recurring_application_charge,
                            };
                        }
                        console.log("line 168", planDataUpd);
                        const planUpdate = await planModel.findOneAndUpdate(
                            { shopName },
                            planDataUpd,
                            { upsert: true }
                        );
                        console.log("planUpdate", planUpdate);
                        res.redirect(`/index?shop=${shop}`);
                    } else {
                        const cretePlan = new planModel(planData);
                        await cretePlan.save();
                        res.redirect(`/index?shop=${shop}`);
                    }
                } else {
                    console.log("else part==>>>>>>>>>>>>> ");
                    // res.redirect(`/index?shop=${shop}`);
                    res.json({
                        msg: "hello else part  plzz attached require url",
                        status: 200,
                    });
                }
            } else {
                res.json({
                    msge: "catch part",
                });
            }
        } else {
            console.log("else part");
        }
    } catch (error) {
        const err = error
        if (err.response) {
            console.log(err.response.status)
            console.log(err.response.data)
        }
        console.log("i m this error", error);
        res.json({
            msg: "hello error part",
            error: error,
        });
    }
};

exports.freePlan = async (req, res) => {
    try {
        const { shopName } = req.query;
        const checker1 = await shopModel.find({ shopName: shopName });
        if (checker1.length >= 1) {
            const token = checker1[0].shopToken;
            const shop = checker1[0].shopName;
            console.log("line 223", shop);
            console.log("line 223", token);
            const checker2 = await planModel.find({ shopName: shopName });
            console.log("line 214", checker2);
            if (checker2.length >= 1) {
                const charge_id = checker2[0].planFullDetail.id;
                console.log(charge_id);
                const shopHeader = {
                    "X-Shopify-Access-Token": token,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                };
                console.log("line 246", shopHeader);
                const cancelCharge = `https://${shop}/admin/api/2022-04/recurring_application_charges/${charge_id}.json`;
                console.log("line 248", cancelCharge);
                const getData = await axios({
                    url: cancelCharge,
                    method: "DELETE",
                    headers: shopHeader,
                });
                console.log("line 254", getData);
                if (getData.status === 201 || getData.status === 200) {
                    const insertvalue = {
                        activationDate: new Date().toISOString().slice(0, 10),
                        currentPlan: 1,
                        totalViewsused: 0,
                        totalViewsReceived: 500,
                        planStatus: "active",
                        planFullDetail: {
                            name: "free",
                        },
                    };
                    console.log(insertvalue);
                    const freePlanChange = await planModel.updateMany(
                        { shopName },
                        insertvalue,
                        { upsert: true }
                    );
                    console.log("line 272", freePlanChange);
                    res.redirect(`/index?shop=${shop}`);
                } else {
                    console.log("err in line 275");
                    res.json({
                        status: 201,
                    });
                }
            }
        } else {
            console.log("err in ine 257");
            res.json({
                status: 200,
            });
        }
    } catch (error) {
        console.log("line 288", error);
        res.status(500).json({});
    }
};

exports.planUsed = async (req, res) => {
    const { shopName } = req.query;
    const planUsedFind = await planModel.find({ shopName: shopName });
    if (planUsedFind.length >= 1) {
        let totVVGet;
        if (planUsedFind[0].totalViewsReceived) {
            totVVGet = planUsedFind[0].totalViewsReceived;
        } else {
            totVVGet = 500;
        }
        if (planUsedFind[0].totalViewsused) {
            var totalUsedV = planUsedFind[0].totalViewsused;
        } else {
            totalUsedV = 0;
        }
        let planNAMe;

        if (planUsedFind[0].currentPlan == 1) {
            planNAMe = "Startup";
        } else if (planUsedFind[0].currentPlan == 2) {
            planNAMe = "Basic";
        } else if (planUsedFind[0].currentPlan == 4) {
            planNAMe = "Medium";
        }
        else if (planUsedFind[0].currentPlan == 3) {
            planNAMe = "Advance";
        }
        const planData = {
            totalViewsReceived: totVVGet,
            totalViewsused: totalUsedV,
            planName: planNAMe,
            planStatus: planUsedFind[0].planStatus
        };
        res.status(200).json({
            message: "flag1",
            data: planData,
        });
    } else {
        const planData = {
            totalViewsReceived: 8,
            totalViewsused: 0,
            planName: "Startup",
        };
        res.status(200).json({
            message: "flag1",
            data: planData,
        });
    }
};

exports.viewsUpdate = async (req, res) => {
    try {
        const { shopName } = req.query;
        const check1 = await shopModel.find({ shopName: shopName });
        if (check1.length >= 1) {
            const checker2 = await planModel.find({ shopName: shopName });
            console.log("line 321", checker2);
            console.log(checker2[0].planStatus)
            if (checker2[0].planStatus === "active") {
                let vePage;
                if (checker2[0].totalViewsused) {
                    vePage = checker2[0].totalViewsused;
                } else {
                    vePage = 0;
                }
                if (checker2[0].totalViewsReceived == 200) {
                    const viewsUpdate = await planModel.findOneAndUpdate(
                        { shopName: shopName },
                        { totalViewsused: Number(vePage) + 1 }
                    );
                    console.log("335");

                    res.json({
                        message: "flag1",
                        status: 200,
                    });
                }
                if (
                    Number(checker2[0].totalViewsReceived) >=
                    Number(vePage) + 1
                ) {
                    const viewsUpdate = await planModel.findOneAndUpdate(
                        { shopName: shopName },
                        { totalViewsused: Number(vePage) + 1 }
                    );
                    console.log("348");

                    res.json({
                        message: "flag1",
                        status: 200,
                    });
                } else {
                    console.log("355");

                    res.json({
                        message: "flag0",
                        status: 200,
                    });
                }

            } else if (checker2[0].planStatus === "Deactive") {
                console.log("368===>>>>>>>your plan ise deactivated");
                res.json({
                    message: "flag0",
                    status: 200,
                })
            } else {
                const shopData = {
                    shopName: shopName,
                    activationDate: new Date().toISOString().slice(0, 10),
                    currentPlan: 1,
                    totalViewsused: 0,
                    totalViewsReceived: 500,
                    planStatus: "active",
                    planFullDetail: {
                        name: "free",
                    },
                };
                const newCount = await new planModel(shopData);
                const savedata = await newCount.save();
                console.log("line 376", savedata);
                console.log("388", error);

                res.json({
                    message: "flag1",
                    status: 200,
                });
            }
        } else {
            console.log("line 394");
        }
    } catch (error) {
        console.log("395", error);
    }
}

//plan number1
exports.newMonthStart = async (req, res) => {
    try {
        const { shopName } = req.query;
        console.log(shopName);
        const checker1 = await planModel.find({ shopName: shopName });
        console.log(checker1);
        if (checker1.length >= 1) {
            const { apiKey } = req.query;
            console.log(typeof (apiKey));
            if (apiKey == "b768ff1f2b02f971f0e51bca294a1a6c") {
                const updateNewMonthPlan = await planModel.updateMany(
                    { shopName: shopName },
                    { planStatus: "Deactive", totalViewsused: 0 },
                    { upsert: true }
                );
                res.status(200).json({
                    message: "flag1",
                });
            }
        } else {
            res.status(200).json({
                message: "Invalid Api Key",
            });
        }
    } catch (error) {
        console.log("line 454", error)
        res.json({
            msg: "error",
            status: 200,
        });
    }
};


//plan number2
exports.monthPlanReset = async (req, res) => {
    const { shopName } = req.query;
    const checker1 = await planModel.find({ shopName: shopName });
    console.log("line 465", checker1);
    if (checker1.currentPlan === "2" || checker1.currentPlan === "3" || checker1.currentPlan === "4") {
        const { apiKey } = req.query;
        if (apiKey === "b768ff1f2b02f971f0e51bca294a1a6c") {
            const updateNewMonthPlan = await planModel.updateMany(
                { shopName: shopName },
                { currentPlan: 1, totalViewsReceived: 500, totalViewsused: 0, planFullDetail: { name: free } },
                { upsert: true }
            )
            res.status(200).json({
                message: "flag1"
            })
        } else {
            res.status(200).json({
                message: "Invalid Api Key"
            })
        }

    } else {
        res.status(200).json({
            message: "this is free plan"
        })
    }
}



// exports.monthPlanReset = async (req, res) => {
//     const { apiKey } = req.query;
//     if (apiKey == "b768ff1f2b02f971f0e51bca294a1a6c") {
//         const updateNewMonthPlan = await planModel.updateMany({ totalViewsused: 0, thisMonthTaken: false })
//         res.status(200).json({
//             message: "flag1"
//         })
//     } else {
//         res.status(200).json({
//             message: "Invalid Api Key"
//         })
//     }
// }

exports.viewCount = async (req, res) => {
    try {
        console.log('>>>>>>>>>>>>>>>>123');
        const { shop } = req.query;
        console.log('>>>>>>>>>>>>>>>>', shop);
        const check1 = await planModel.find({ shopName: shop });
        console.log("line 453", check1[0].currentPlan);
        // console.log("line 453",check1[0].currentPlan);
        if (check1[0].currentPlan === "3") {

            console.log("line 457 plan3");
            const viewRecieve = check1[0].totalViewsReceived;
            const useView = check1[0].totalViewsused;
            const plan = check1[0].planFullDetail.name;

            console.log(viewRecieve);
            console.log(useView);
            console.log(plan);
            res.send({
                totalViewsReceived: viewRecieve,
                totalViewsused: useView,
                plan: plan
            });
        } else {
            console.log("line 471 plan2");
            console.log("line 472 plan1");
            const viewRecieve = check1[0].totalViewsReceived;
            const useView = check1[0].totalViewsused;
            const plan = check1[0].planFullDetail.name;

            console.log(viewRecieve);
            console.log(useView);
            console.log(plan);


            res.send({
                totalViewsReceived: viewRecieve,
                totalViewsused: useView,
                plan: plan
            });
        }

    } catch (error) {
        console.log('error>>>>>>>>>>>>>>>', error);
    }
};
