#!/usr/bin/env node

import { Command } from "commander";
import { authCommand } from "./commands/auth.js";
import { boostCommand } from "./commands/boost.js";
import { creditsCommand } from "./commands/credits.js";
import { productsCommand } from "./commands/products.js";

const program = new Command();

program
  .name("communiply")
  .description("Boost your tweets with community-powered engagement")
  .version("0.1.0");

program.addCommand(authCommand());
program.addCommand(boostCommand());
program.addCommand(creditsCommand());
program.addCommand(productsCommand());

program.parse();
