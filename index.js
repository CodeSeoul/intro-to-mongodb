#!/usr/bin/env node

import 'dotenv/config';
import { MongoClient } from 'mongodb';

const connectionString = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
const client = new MongoClient(connectionString);

const dbName = 'hr';

async function main() {
    await client.connect();
    console.log('Connected successfully');
    const db = client.db(dbName);
    const collection = db.collection('employees');

    return 'done';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
