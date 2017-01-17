/**
 * Created by Gryzli on 17.01.2017.
 */
const https = require('https');
const querysting = require('querystring');
const group_id = '1707149242852457';
const access_token = '1173483302721639%7CM1wdI_6kHBG584FAXtK-LDVWNGo';
const api_ver = 'v2.8';
const limit = 10;
export default class connect {
    static sendRequest(callback) {
            let fieldsArr = ['story', 'from', 'link', 'caption', 'created_time'];
        let fields = fieldsArr.join('%2C');
        let query ={
            fields:fields,
            limit:limit,
            access_token:access_token
        };
        let query_str = querysting.parse(query);
        let path = `/${api_ver}/${group_id}/feed?fields=${fields}&limit=${limit}&access_token=${access_token}`;

        let options = {
            hostname: 'graph.facebook.com',
            port: 443,
            path: path,
            method: 'GET'
        };

        let req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (d) => {
                let str = d.toString();
                let data1 = JSON.parse(str);
                let data = data1.data;
                callback(data);
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
    }
}
