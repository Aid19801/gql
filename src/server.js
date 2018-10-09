import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import { prepare } from './utils';
const { DB_USERNAME, DB_PASSWORD, DB_ML_USER, PORT } = process.env;
// connecting to mongoDB
const MONGO_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds243931.mlab.com:43931/${DB_ML_USER}`;

// express setup localhost
const homePath = '/graphiql'
const URL = 'http://localhost'
const devPORT = PORT || 5000;
const app = express();
app.use(cors());


export const start = async () => {
    try {
        // connect to mongodb
        const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true });

        // defining Users and Messages collections
        const myDb = await client.db('dads-app-db');
        const MessagesCollection = myDb.collection('messages');
        const UsersCollection = myDb.collection('users');
        const messages = await MessagesCollection.find().toArray();
        const users = await UsersCollection.find().toArray();
        console.log('no. of users: ', users.length);
        console.log('no. of messages: ', messages.length);
        
        const typeDefs = [`
            type Message {
                _id: String
                message: String
                timestamp: String
                userName: String
                userId: String
            }

            type User {
                _id: String
                email: String
                userName: String
                userId: String
                password: String
                likes: String
                dislikes: String
                tagline: String
                latitude: String
                longitude: String
                messages: [Message]
            }

            type Query {
            message(_id: String): Message
            messages: [Message]
            users: [User]
            user(_id: String): User
            }

            type Mutation {
            createMessage(message: String, timestamp: String, userName: String, userId: String): Message
            createUser(email: String, userName: String, userId: String, password: String, likes: String, dislikes: String, tagline: String, latitude: String, longitude: String): User
            }

            schema {
                query: Query
                mutation: Mutation
            }
        `]

        const resolvers = {
            Query: {
                message: async (root, {_id}) => {
                    return prepare(await MessagesCollection.findOne(ObjectId(_id)));
                },
                messages: async () => {
                    return (MessagesCollection.find({}).toArray()).map(prepare);
                },
                user: async () => {
                    return prepare(await UsersCollection.findOne(ObjectId(_id)));
                },
                users: async () => {
                    return (UsersCollection.find({}).toArray()).map(prepare);
                }
            },
            User: {
                messages: async ({_id}) => {
                    return (await MessagesCollection.find({ userId: _id }).toArray()).map(prepare);
                }
            },
            Mutation: {
                createMessage: async (root, args, context, info) => {
                    const res = await MessagesCollection.insertOne(args);
                    return prepare(res.ops[0]);
                },
                createUser: async () => {
                    const res = await UsersCollection.insertOne(args);
                    return prepare(res.ops[0]);
                }
            },
        }

        const schema = makeExecutableSchema({
            typeDefs,
            resolvers
        });

        app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

        app.use(homePath, graphiqlExpress({
            endpointURL: '/graphql'
        }))

        app.listen(PORT, () => {
            console.log(`Visit ${URL}:${devPORT}${homePath}`)
        })

    } catch(err) {
        console.log('try catch error: ', err);
    }
}

start();
