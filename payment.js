const express = require('express');
import {RecurringApplicationCharge} from '@shopify/shopify-api/dist/rest-resources/2022-01/index.js';

const test_session = await Shopify.Utils.loadCurrentSession(request, response);
const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
recurring_application_charge.name = "Super Duper Plan";
recurring_application_charge.price = 10.0;
recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
await recurring_application_charge.save({
  update: true,
});