#!/usr/bin/env node

const Service = require('../lib/service')
const service = new Service()

const args = process.argv.slice(2)
const command = args[0]
service.bootstrap(command)
