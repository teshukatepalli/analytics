//  befor excute this query need to run below comand in bash
// export GOOGLE_APPLICATION_CREDENTIALS="./big_cred.json"

// Import the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery');
const fs = require('fs');

async function queryStackOverflow() {
  // Queries a public Stack Overflow dataset.

  // Create a client
  const bigqueryClient = new BigQuery();

  // The SQL query to run
  // const sqlQuery = `SELECT
  //   CONCAT(
  //     'https://stackoverflow.com/questions/',
  //     CAST(id as STRING)) as url,
  //   view_count
  //   FROM \`bigquery-public-data.stackoverflow.posts_questions\`
  //   WHERE tags like '%google-bigquery%'
  //   ORDER BY view_count DESC
  //   LIMIT 10`;
    // const sqlQuery = `SELECT * FROM \`hopeful-kingdom-308108.analytics_266416269.events_20210401\` where user_id is not null LIMIT 1000`;
    const sqlQuery = `SELECT * FROM \`threaduidev.analytics_268117400.events_intraday_20210516\` LIMIT 10000`;

  const options = {
    query: sqlQuery,
    // Location must match that of the dataset(s) referenced in the query.
    location: 'US',
  };

  // Run the query
  const [rows] = await bigqueryClient.query(options);

  console.log('Query Results:', rows );
  // rows.forEach(row => {
  //   const url = row['url'];
  //   const viewCount = row['view_count'];
  //   console.log(`url: ${url}, ${viewCount} views`);
  // });
  let path = './output.json';
  fs.writeFileSync(path, JSON.stringify(rows))
  // const storeData = (rows, path) => {
  //   try {
  //     fs.writeFileSync(path, JSON.stringify(rows))
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
}
export default queryStackOverflow();
