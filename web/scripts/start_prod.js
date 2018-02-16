process.env.NODE_ENV='production';
process.env.PORT='3000';
require('dotenv').config({silent: true});
require('../../server/src/index');
