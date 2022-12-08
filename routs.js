const express = require("express");
const router = express.Router();
const cors = require("cors");
const { planCreate,
    planStatus,
    freePlan,
    planUsed,
    viewsUpdate,
    newMonthStart,
    viewCount,
    monthPlanReset
} = require('./Controler/planMonth');

const planModel = require("../models/planModel");


async function planChecked(req, res, next) {
    try {
        const { shopName, planValue } = req.query;
        const findPlan = await planModel.find({ shopName: shopName })
        if (findPlan.length == 0) {
            next();
        } else {
            if (findPlan[0].planStatus == "active") {
                if (planValue != findPlan[0].currentPlan) {
                    next();
                } else {
                    res.redirect('/index?shop=' + shopName);

                }

            } else {
                next()
            }

        }
    } catch (error) {
        res.json({
            msg: error
        })
    }
}

router.get("/plan/create", planChecked, planCreate);

router.get('/planstatus', planStatus);

router.get('/planstatus/free', freePlan);

router.get('/planViews', planUsed);

router.get('/planViews/update', cors(), viewsUpdate);

router.get('/stores/newmonth/start', newMonthStart)

router.get('/stores/newmonth/plan', monthPlanReset)


router.get('/view/data', viewCount)

module.exports = router;