"use strict";

exports.health = async () => {
  return { status: "Healthy", uptime: process.uptime() };
};
