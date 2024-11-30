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
    const employees = db.collection('employees');
    const teams = db.collection('teams');
    let result = await teams.insertMany([
        {
            name: "Product Management"
        },
        {
            name: "Frontend Engineering"
        }
    ]);
    console.log(`inserted ids: ${result.insertedIds}`);
    result = await employees.insertMany([
        {
            name: "Beege",
            title: "Team Lead",
            joined: "$date(2021-01-04)",
            team: {
                _id: result.insertedIds[0],
                name: "Product Management"
            }
        },
        {
            name: "Andrei",
            title: "Software Engineer",
            joined: "$date(2021-06-01)",
            team: {
                _id: result.insertedIds[1],
                name: "Frontend Engineering"
            }
        }
    ]);
    console.log(`inserted ids: ${result.insertedIds}`);
    
    let results = await employees.find(
        {
            "team.name": "Product Management"
        }, 
        {
            projection: {name: 1, team: "$team.name", _id: 0}
        }
    ).toArray();
    console.log(`find results: ${results}`);
    console.log(await results);
    results = await employees.aggregate([
        {
          '$match': {
            'name': {
              '$exists': 1
            }
          }
        }, {
          '$group': {
            '_id': '$team.name', 
            'countMembers': {
              '$count': {}
            }
          }
        }
      ]).toArray();
    console.log(`pipeline results: ${results}`);
    console.log(results);
    return 'done';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
