'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _graphqlServerExpress = require('graphql-server-express');

var _graphqlTools = require('graphql-tools');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _mongodb = require('mongodb');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process$env = process.env,
    DB_USERNAME = _process$env.DB_USERNAME,
    DB_PASSWORD = _process$env.DB_PASSWORD,
    DB_ML_USER = _process$env.DB_ML_USER;
// connecting to mongoDB

var MONGO_URL = 'mongodb://' + DB_USERNAME + ':' + DB_PASSWORD + '@ds243931.mlab.com:43931/' + DB_ML_USER;

// express setup localhost
var homePath = '/graphiql';
var URL = 'http://localhost';
var PORT = process.env.PORT || 5000;
var app = (0, _express2.default)();
app.use((0, _cors2.default)());

var start = exports.start = function _callee() {
    var client, myDb, MessagesCollection, UsersCollection, messages, users, typeDefs, resolvers, schema;
    return regeneratorRuntime.async(function _callee$(_context8) {
        while (1) {
            switch (_context8.prev = _context8.next) {
                case 0:
                    _context8.prev = 0;
                    _context8.next = 3;
                    return regeneratorRuntime.awrap(_mongodb.MongoClient.connect(MONGO_URL, { useNewUrlParser: true }));

                case 3:
                    client = _context8.sent;
                    _context8.next = 6;
                    return regeneratorRuntime.awrap(client.db('dads-app-db'));

                case 6:
                    myDb = _context8.sent;
                    MessagesCollection = myDb.collection('messages');
                    UsersCollection = myDb.collection('users');
                    _context8.next = 11;
                    return regeneratorRuntime.awrap(MessagesCollection.find().toArray());

                case 11:
                    messages = _context8.sent;
                    _context8.next = 14;
                    return regeneratorRuntime.awrap(UsersCollection.find().toArray());

                case 14:
                    users = _context8.sent;

                    console.log('no. of users: ', users.length);
                    console.log('no. of messages: ', messages.length);

                    typeDefs = ['\n            type Message {\n                _id: String\n                message: String\n                timestamp: String\n                userName: String\n            }\n\n            type User {\n                _id: String\n                email: String\n                userName: String\n                password: String\n                likes: String\n                dislikes: String\n                tagline: String\n                latitude: String\n                longitude: String\n                messages: [Message]\n            }\n\n            type Query {\n            message(_id: String): Message\n            messages: [Message]\n            users: [User]\n            user(_id: String): User\n            }\n\n            type Mutation {\n            createMessage(message: String, timestamp: String, userName: String, userId: String): Message\n            createUser(email: String, userName: String, userId: String, password: String, likes: String, dislikes: String, tagline: String, latitude: String, longitude: String): User\n            }\n\n            schema {\n                query: Query\n                mutation: Mutation\n            }\n        '];
                    resolvers = {
                        Query: {
                            messages: function messages() {
                                return regeneratorRuntime.async(function messages$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return regeneratorRuntime.awrap(MessagesCollection.find().toArray());

                                            case 2:
                                                return _context.abrupt('return', _context.sent);

                                            case 3:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, null, undefined);
                            },
                            users: function users() {
                                return regeneratorRuntime.async(function users$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _context2.next = 2;
                                                return regeneratorRuntime.awrap(UsersCollection.find().toArray());

                                            case 2:
                                                return _context2.abrupt('return', _context2.sent);

                                            case 3:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, null, undefined);
                            },
                            user: function user(root, _ref) {
                                var _id = _ref._id;
                                return regeneratorRuntime.async(function user$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.t0 = _utils.prepare;
                                                _context3.next = 3;
                                                return regeneratorRuntime.awrap(UsersCollection.findOne((0, _mongodb.ObjectId)(_id)));

                                            case 3:
                                                _context3.t1 = _context3.sent;
                                                return _context3.abrupt('return', (0, _context3.t0)(_context3.t1));

                                            case 5:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, null, undefined);
                            },
                            message: function message(root, _ref2) {
                                var _id = _ref2._id;
                                return regeneratorRuntime.async(function message$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.t0 = _utils.prepare;
                                                _context4.next = 3;
                                                return regeneratorRuntime.awrap(MessagesCollection.findOne((0, _mongodb.ObjectId)(_id)));

                                            case 3:
                                                _context4.t1 = _context4.sent;
                                                return _context4.abrupt('return', (0, _context4.t0)(_context4.t1));

                                            case 5:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, null, undefined);
                            }
                        },
                        User: {
                            messages: function messages(_ref3) {
                                var _id = _ref3._id;
                                return regeneratorRuntime.async(function messages$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _context5.next = 2;
                                                return regeneratorRuntime.awrap(MessagesCollection.find({ userId: _id }).toArray());

                                            case 2:
                                                _context5.t0 = _utils.prepare;
                                                return _context5.abrupt('return', _context5.sent.map(_context5.t0));

                                            case 4:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, null, undefined);
                            }
                        },
                        Mutation: {
                            createMessage: function createMessage(root, args, context, info) {
                                var res;
                                return regeneratorRuntime.async(function createMessage$(_context6) {
                                    while (1) {
                                        switch (_context6.prev = _context6.next) {
                                            case 0:
                                                _context6.next = 2;
                                                return regeneratorRuntime.awrap(MessagesCollection.insertOne(args));

                                            case 2:
                                                res = _context6.sent;
                                                return _context6.abrupt('return', (0, _utils.prepare)(res.ops[0]));

                                            case 4:
                                            case 'end':
                                                return _context6.stop();
                                        }
                                    }
                                }, null, undefined);
                            },
                            createUser: function createUser(root, args, context, info) {
                                var res;
                                return regeneratorRuntime.async(function createUser$(_context7) {
                                    while (1) {
                                        switch (_context7.prev = _context7.next) {
                                            case 0:
                                                _context7.next = 2;
                                                return regeneratorRuntime.awrap(UsersCollection.insertOne(args));

                                            case 2:
                                                res = _context7.sent;
                                                return _context7.abrupt('return', (0, _utils.prepare)(res.ops[0]));

                                            case 4:
                                            case 'end':
                                                return _context7.stop();
                                        }
                                    }
                                }, null, undefined);
                            }
                        }
                    };
                    schema = (0, _graphqlTools.makeExecutableSchema)({
                        typeDefs: typeDefs,
                        resolvers: resolvers
                    });


                    app.use('/graphql', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({ schema: schema }));

                    app.use(homePath, (0, _graphqlServerExpress.graphiqlExpress)({
                        endpointURL: '/graphql'
                    }));

                    app.listen(PORT, function () {
                        console.log('Visit ' + URL + ':' + PORT + homePath);
                    });

                    _context8.next = 28;
                    break;

                case 25:
                    _context8.prev = 25;
                    _context8.t0 = _context8['catch'](0);

                    console.log('try catch error: ', _context8.t0);

                case 28:
                case 'end':
                    return _context8.stop();
            }
        }
    }, null, undefined, [[0, 25]]);
};

start();