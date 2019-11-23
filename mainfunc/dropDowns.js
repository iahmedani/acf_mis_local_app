var knex = require('./db');

module.exports = {
    getNSC : async function(tehsil_id){
        try {
            var data = await knex('tblNSC').where({tehsil_id: tehsil_id, isActivated: 1})
           return  data
        } catch (error) {
            return error
        }
    },
    getAllNSC : async function(){
        try {
            var data = await knex('tblNSC').where({isActivated: 1})
            return  data
        } catch (error) {
            return error
        }
    },
    getAllOtpDistrict : async function(district_id){
        try {
            var data = await knex('v_geo_active').where({district_id: district_id})
            return data
        } catch (error) {
            return error
        }
    },
}