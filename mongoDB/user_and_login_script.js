// testData.js

const usersTestData = [
  {
    userId: '11111111-1111-1111-1111-111111111111',
    username: 'User1',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '22222222-2222-2222-2222-222222222222',
    username: 'User2',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '33333333-3333-3333-3333-333333333333',
    username: 'User3',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '44444444-4444-4444-4444-444444444444',
    username: 'User4',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '55555555-5555-5555-5555-555555555555',
    username: 'User5',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '66666666-6666-6666-6666-666666666666',
    username: 'User6',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '77777777-7777-7777-7777-777777777777',
    username: 'User7',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '88888888-8888-8888-8888-888888888888',
    username: 'User8',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: '99999999-9999-9999-9999-999999999999',
    username: 'User9',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
  },
  {
    userId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    username: 'User10',
    password: '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
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
