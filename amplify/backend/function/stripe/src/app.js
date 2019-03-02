/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
var moment = require("moment");
require("dotenv").config();

var AWS = require("aws-sdk");
const awsConfig = {
  accessKeyId: "AKIAJTPTKWOQQX57B57A",
  secretAccessKey: "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",
  region: "us-west-2",
  fromSiteEmail: "info@harrisonlakeshuttles.com",
};

var ses = new AWS.SES(awsConfig);

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function buildTicketTables(title, ticketProds, pickupLoc, dropoffLoc, passTickets, ticketId, depDate, reqWheelchair) {
  let ticketTables = "";
  const selectedDepartureTicket = ticketProds.find((ticketProd) => ticketProd.id === ticketId);

  let departurePickupLocRow = "";
  if (pickupLoc) {
    departurePickupLocRow += `
    <tr>
      <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Departure Pickup Location:</td>
      <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>${pickupLoc}</b></td>
    </tr>
  `;
  }

  let departureDropoffLocRow = "";
  if (dropoffLoc) {
    departureDropoffLocRow += `
    <tr>
      <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Arrival Dropoff Location:</td>
      <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>${dropoffLoc}</b></td>
    </tr>
  `;
  }

  let departureRequiresWheelchairRow = "";
  if (reqWheelchair) {
    departureRequiresWheelchairRow = `
    <tr>
      <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Wheelchair Seat Reserved:</td>
      <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>Yes</b></td>
    </tr>
  `;
  }

  let departureTravellerTable = "";
  let departureTravellerSubTotal = 0;
  passTickets.forEach((passTicket, passTicketIndex) => {
    const selectedTicketType =
      selectedDepartureTicket &&
      selectedDepartureTicket.ticketTypes.items.find((ticketType) => ticketType.id === passTicket.type);
    if (passTicketIndex === 0) {
      departureTravellerTable += `
    <h5 style='font-size: 18px; margin-top: 15px; margin-bottom: 15px;'><span style='border-bottom: 1px solid silver; padding-bottom: 5px;'>Traveller Information</span>:</h5>
      <table style="color: #333; font-family: Helvetica, Arial, sans-serif; width: 100%; margin: 0 auto; margin-bottom: 20px; border-collapse: collapse; border-spacing: 0;">
      <tr>
        <th style='background: #F3F3F3; text-align: center; font-weight: 100; border: 1px solid #CCC; padding-top: 10px; padding-bottom: 10px;'>Traveller Name</th>
        <th style='background: #F3F3F3; text-align: center; font-weight: 100; border: 1px solid #CCC; padding-top: 10px; padding-bottom: 10px;'>Ticket Type</th>
        <th style='background: #F3F3F3; text-align: center; font-weight: 100; border: 1px solid #CCC; padding-top: 10px; padding-bottom: 10px;'>Ticket Price</th>
      </tr>
    `;
    }

    departureTravellerSubTotal += selectedTicketType && selectedTicketType.price;
    const selectedTicketTypePrice = new Intl.NumberFormat("en-CDN", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "symbol",
    }).format(selectedTicketType && selectedTicketType.price);

    departureTravellerTable += `
    <tr>
      <td style='background: #FAFAFA; border: 1px solid #CCC; padding-top: 10px; padding-bottom: 10px; text-align: center;'><b>${
        passTicket.name
      }</b></td>
      <td style='background: #FAFAFA; border: 1px solid #CCC; padding-top: 10px; padding-bottom: 10px; text-align: center;'><b>${selectedTicketType &&
        selectedTicketType.age}</b></td>
      <td style='background: #FAFAFA; border: 1px solid #CCC; padding-top: 10px; padding-bottom: 10px; text-align: center;'><b>${selectedTicketTypePrice}</b></td>
    </tr>
  `;

    // close table
    if (passTicketIndex === passTickets.length - 1) {
      const departureTravellerSubTotalFormatted = new Intl.NumberFormat("en-CDN", {
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
      }).format(departureTravellerSubTotal);
      // sum of tickets
      departureTravellerTable += `
      <tr>
        <td colspan="2" style='background: #FAFAFA; border: 1px solid #CCC; border-top: 2px solid #4a4a4a; text-align: center; padding-right: 20px; padding-top: 10px; padding-bottom: 10px;'>Subtotal (taxes included):</td>
        <td style='background: #FAFAFA; border: 1px solid #CCC; border-top: 2px solid #4a4a4a; text-align: center; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;'><b>${departureTravellerSubTotalFormatted}</b></td>
      </tr>
    `;
      departureTravellerTable += "</table>";
    }
  });

  ticketTables += `
  <div>
    <h5 style='font-size: 18px;  margin-top: 15px; margin-bottom: 15px;'><span style='border-bottom: 1px solid silver; padding-bottom: 5px'>${title}</span>:</h5>
    <table style="color: #333; font-family: Helvetica, Arial, sans-serif; width: 100%; margin: 0 auto; margin-bottom: 20px; border-collapse: collapse; border-spacing: 0;">
      <tr>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Departure Location:</td>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>${selectedDepartureTicket &&
          selectedDepartureTicket.departsLocName}</b></td>
      </tr>
      <tr>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Departure Date:</td>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>${moment(
          depDate,
        ).format("MMM DD, YYYY")}</b></td>
      </tr>
      <tr>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Departure Time:</td>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>${selectedDepartureTicket &&
          selectedDepartureTicket.departsTime}</b></td>
      </tr>
      ${departurePickupLocRow}
      ${departureRequiresWheelchairRow}
      <tr>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Arrival Location:</td>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>${selectedDepartureTicket &&
          selectedDepartureTicket.arrivesLocName}</b></td>
      </tr>
      <tr>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-right: 20px;'>Arrival Time:</td>
        <td style='background: #FAFAFA; border: 1px solid #CCC; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 20px;'><b>${selectedDepartureTicket &&
          selectedDepartureTicket.arrivesTime}</b></td>
      </tr>
      ${departureDropoffLocRow}
    </table>
      
    ${departureTravellerTable}
  </div>
`;

  return ticketTables;
}

function buildEmailConfirmationEmail(req) {
  let receiptHtml =
    "<div style='width: 100%; margin: 0 auto;'><h2 style='text-align: left; font-size: 24px;'>Greetings " +
    req.body.charge.payeeName +
    ",</h2>";
  receiptHtml +=
    "<p style='text-align: left;'>Thank you for booking with Harrison Lake Shuttles! This emails confirms that your order has been received and your trip is booked. Please find your ticket information below, you may be required to show this email to your bus driver in order to board the bus.</p></div>";

  receiptHtml +=
    "<div style='margin-top: 15px; margin-bottom: 15px;'><hr style='width: 100%; margin: auto; border: 1px dashed #4a4a4a;' /></div>";

  const depHtml = buildTicketTables(
    "Departure Ticket Details",
    req.body.charge.ticketProds,
    req.body.charge.departure.pickupLocation,
    req.body.charge.departure.dropoffLocation,
    req.body.charge.departure.passengerTickets,
    req.body.charge.departure.ticketId,
    req.body.charge.departure.departureDate,
    req.body.charge.departure.requiresWheelchair,
  );

  receiptHtml += depHtml;
  receiptHtml +=
    "<div style='margin-top: 15px; margin-bottom: 15px;'><hr style='width: 100%; margin: auto; border: 1px dashed #4a4a4a;' /></div>";

  if (req.body.charge.return.ticketId) {
    const returnHtml = buildTicketTables(
      "Return Ticket Details",
      req.body.charge.ticketProds,
      req.body.charge.return.pickupLocation,
      req.body.charge.return.dropoffLocation,
      req.body.charge.return.passengerTickets,
      req.body.charge.return.ticketId,
      req.body.charge.return.departureDate,
      req.body.charge.return.requiresWheelchair,
    );

    receiptHtml += returnHtml;
    receiptHtml +=
      "<div style='margin-top: 15px; margin-bottom: 15px;'><hr style='width: 100%; margin: auto; border: 1px dashed #4a4a4a;' /></div>";
  }

  if (req.body.charge.return.extraTicketId) {
    const extraReturnHtml = buildTicketTables(
      "Return Ticket Two Details",
      req.body.charge.ticketProds,
      req.body.charge.return.extraPickupLocation,
      req.body.charge.return.extraDropoffLocation,
      req.body.charge.return.extraPassengerTickets,
      req.body.charge.return.extraTicketId,
      req.body.charge.return.extraDepartureDate,
      req.body.charge.return.extraRequiresWheelchair,
    );

    receiptHtml += extraReturnHtml;
    receiptHtml +=
      "<div style='margin-top: 15px; margin-bottom: 15px;'><hr style='width: 100%; margin: auto; border: 1px dashed #4a4a4a;' /></div>";
  }

  receiptHtml +=
    "<p>If you have any questions about your order, contact us at <a href='mailto:info@harrisonlakeshuttles.com'>info@harrisonlakeshuttles.com</a>.</p>";

  receiptHtml +=
    "<p><b>Harrison Lake Shuttles</b> <br /> 270 Esplanade Ave,<br /> Harrison Hot Springs, BC <br /> V0M1K0</p>";

  const formatHtml = `
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
          <td style="text-align: center;">
            ${receiptHtml}
          </td>
      </tr>
  </table>
  `;

  return formatHtml;
}

const sendOrderConfirmationEmail = function(req, res, next) {
  const emailHtml = buildEmailConfirmationEmail(req);

  // send the email
  ses
    .sendEmail({
      ReturnPath: awsConfig.fromSiteEmail,
      Source: "Harrison Lake Shuttles <" + awsConfig.fromSiteEmail + ">",
      Destination: {
        ToAddresses: [req.body.charge.payeeEmail],
      },
      Message: {
        Subject: {
          Data: "Your Trip is Booked!",
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: emailHtml,
          },
        },
      },
    })
    .promise()
    .then((sendEmailRes) => {
      console.log("sendEmailRes:", sendEmailRes);
      next();
    })
    .catch((err) => {
      console.log("err:", err);
      return res.status(500).json({ error: err });
    });
};

const sendAdminOrderProcessedNotification = function(req, res, next) {
  const emailHtml = buildEmailConfirmationEmail(req);

  const adminEmail = `
    <p>This is an automated message to let you know that a trip was just booked online. You may review the full transaction below:</p>
    <h5><b>Payee Information</b>:</h5>
    <p>Payee Name: <b>${req.body.charge.payeeName}</b></p>
    <p>Payee Email: <b>${req.body.charge.payeeEmail}</b></p>
    <p>Payee Phone: <b>${req.body.charge.payeePhone}</b></p>
    <div style='margin-top: 15px; margin-bottom: 15px;'><hr style='width: 100%; margin: auto; border: 1px dashed #4a4a4a;' /></div>
    ${emailHtml}
  `;

  // send the email
  ses
    .sendEmail({
      ReturnPath: awsConfig.fromSiteEmail,
      Source: "Harrison Lake Shuttles <" + awsConfig.fromSiteEmail + ">",
      Destination: {
        ToAddresses: [awsConfig.fromSiteEmail],
      },
      Message: {
        Subject: {
          Data: "Online Order Processed!",
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: adminEmail,
          },
        },
      },
    })
    .promise()
    .then((sendEmailRes) => {
      console.log("sendEmailRes:", sendEmailRes);
      next();
    })
    .catch((err) => {
      console.log("err:", err);
      return res.status(500).json({ error: err });
    });
};

const processTransaction = function(req, res, next) {
  // process stripe charge
  stripe.charges
    .create({
      source: req.body.stripeToken.id,
      amount: req.body.charge.amount,
      currency: "CAD",
      description: req.body.charge.description,
    })
    .then((charge) => {
      console.log("stripe checkout success", charge);
      if (charge.status === "succeeded") {
        next();
      } else {
        return res.status(500).json({ error: new Error("charge did not succeed") });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

/****************************
 * Example post method *
 ****************************/

app.post(
  "/process-transaction",
  processTransaction,
  sendAdminOrderProcessedNotification,
  sendOrderConfirmationEmail,
  function(req, res) {
    return res.json({
      message: "Order Processed Successfully!",
    });
  },
);

app.post("/resend-order-confirmation-email", sendOrderConfirmationEmail, function(req, res) {
  return res.json({
    message: "Order Email Confirmation Sent Successfully!",
  });
});

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
