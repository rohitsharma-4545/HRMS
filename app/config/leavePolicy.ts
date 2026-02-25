export const leavePolicy = {
  ANNUAL: {
    monthlyAccrual: 1.5,
    maxPerYear: 18,
    carryForwardCap: 5,
    allowCarryForward: true,
  },
  SICK: {
    monthlyAccrual: 1,
    maxPerYear: 12,
    carryForwardCap: 0,
    allowCarryForward: false,
  },
  CASUAL: {
    monthlyAccrual: 0.5,
    maxPerYear: 6,
    carryForwardCap: 0,
    allowCarryForward: false,
  },
};
