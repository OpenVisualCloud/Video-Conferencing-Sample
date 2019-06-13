#!/usr/bin/env node

// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

'use strict';

var dbURL = process.argv[2];
if (!dbURL) {
  throw 'DB_URL not found';
}

console.log("dbURL is:", dbURL);

var currentVersion = '1.0';
var fs = require('fs');
var path = require('path');

var db;
var cipher = require('./cipher');

function prepareDB(next) {
    db = require('mongojs')(dbURL, ['services', 'infos', 'rooms']);
    next();
}

function prepareService (serviceName, next) {
  db.services.findOne({name: serviceName}, function cb (err, service) {
    if (err || !service) {      
      console.log('mongodb error: no sample service');          
    } else {
      if (service.encrypted === true) {
        service.key = cipher.decrypt(cipher.k, service.key);
      }
      next(service);
    }
  });
}

prepareDB(function() {
  prepareService('sampleService', function (service) {
    var sampleServiceId = service._id+'';
    var sampleServiceKey = service.key;
    console.log('sampleServiceId:', sampleServiceId);
    console.log('sampleServiceKey:', sampleServiceKey);
    db.close();
  });
});


