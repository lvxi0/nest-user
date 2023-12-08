// testData.js

const usersTestData = [
  {
    userId: '11111111-1111-1111-1111-111111111111',
    username: 'user1',
    password: '$2b$10$bFMheEZ74ZMriGmsy1aON.RN5ta8F.L5wHZ66eatQsLaojJIyAGDe',
  },
  {
    userId: '22222222-2222-2222-2222-222222222222',
    username: 'user2',
    password: '$2b$10$Ficv5e4jFOubwSZEUyVUfe6FrukdskTePXNg78R7WxDRryam/ncE6',
  },
  {
    userId: '33333333-3333-3333-3333-333333333333',
    username: 'user3',
    password: '$2b$10$zFtX77Qr3QfUbcU.Sp6X4OfsFdqsdRIJqSHLHSUo3CSnYYZifT4qe',
  },
  {
    userId: '44444444-4444-4444-4444-444444444444',
    username: 'user4',
    password: '$2b$10$YaUXFYun8YOit5Jn2f6emua8NUn5kCsrJ96de6O9zCMZr4iScz8Zy',
  },
  {
    userId: '55555555-5555-5555-5555-555555555555',
    username: 'user5',
    password: '$2b$10$khAMqueq4mj8Sw0EOxDtzup46PvVr7lzVxFFPeE93MW1H.IOuncv.',
  },
  {
    userId: '66666666-6666-6666-6666-666666666666',
    username: 'user6',
    password: '$2b$10$ambAjfyjB1adeOmd88NoqeTnXXbqKtlETffS5gHsv7X1E95OPiQem',
  },
  {
    userId: '77777777-7777-7777-7777-777777777777',
    username: 'user7',
    password: '$2b$10$2Lp1DzyXTx1hAtWPzndB4.GAiikSuigbgf1H2qMnbG3rFTdZSoFFa',
  },
  {
    userId: '88888888-8888-8888-8888-888888888888',
    username: 'user8',
    password: '$2b$10$XZpzrm21SDu7m2XdVvRqPOUbpxTjlBLYO..bC72glx4yyyL670/Ey',
  },
  {
    userId: '99999999-9999-9999-9999-999999999999',
    username: 'user9',
    password: '$2b$10$e6j2H.wtaZIexK.b38YqIO8ys/BfaJCYgZB5a8eSS20IBP868UWUO',
  },
  {
    userId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    username: 'user10',
    password: '$2b$10$28Y5op3ElX.mo6q/n6DoWeuAnW13c0icj9Dl.lurYX0etSRpJGwoK',
  },
];

const loginTestData = [
  {
    userId: '11111111-1111-1111-1111-111111111111',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '22222222-2222-2222-2222-222222222222',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '33333333-3333-3333-3333-333333333333',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '44444444-4444-4444-4444-444444444444',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '55555555-5555-5555-5555-555555555555',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '66666666-6666-6666-6666-666666666666',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '77777777-7777-7777-7777-777777777777',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '88888888-8888-8888-8888-888888888888',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: '99999999-9999-9999-9999-999999999999',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
  {
    userId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    isLocked: false,
    lockedAt: '',
    invalidLoginTimestamps: [],
  },
];

db.users.deleteMany({});
db.login.deleteMany({});

db.users.insertMany(usersTestData);
db.login.insertMany(loginTestData);
