/**
 * Created by Gryzli on 17.01.2017.
 */
import request from 'request';
const group_id = '1707149242852457';
const access_token = '1173483302721639|M1wdI_6kHBG584FAXtK-LDVWNGo';
const api_ver = 'v2.8';
const limit = 100;
export default class connect {
    static sendRequest(callback) {
        let fieldsArr = ['story', 'from', 'link', 'caption', 'created_time', 'type', 'full_picture', 'updated_time', 'likes.limit(1).summary(true)'];
        let fields = fieldsArr.join(',');
        let query = {
            fields: fields,
            limit: limit,
            access_token: access_token
        };
        //let query_str = querysting.stringify(query);
        let path = `/${api_ver}/${group_id}/feed`;

        let address = 'https://graph.facebook.com';
        let options = {
            uri: path,
            baseUrl: address,
            qs: query,
            port: 443,
            path: path,
            method: 'GET'
        };

        request(options, function (err, res, body) {
            if (res.statusCode == 200) {
                callback(JSON.parse(body));
            } else {
                console.log('error: ' + res.statusCode);
                console.log(body)
            }
        });
    }
}
