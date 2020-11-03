const fs = require('fs');
const {
    app
} = require('electron');
// const knex = require('../db');
const knex = require('knex');
var regex = /([/./])/g;
module.exports = async (knex) => {
    var _version = app.getVersion();
    _version = parseInt(_version.replace(regex, ''));
    if(_version == 1554){
        try {
            await knex.raw(`v_otpAddmision2SAVEPOINT [sqlite_expert_apply_design_transaction];`)
            await knex.raw(` DROP VIEW IF EXISTS [main].[v_otpAddmision2];`)
            await knex.raw(`CREATE VIEW [main].[v_otpAddmision2]
            AS
            SELECT 
                   [main].[v_geo].[province_id], 
                   [main].[v_geo].[province], 
                   [main].[v_geo].[district_id], 
                   [main].[v_geo].[district_name], 
                   [main].[v_geo].[tehsil_id], 
                   [main].[v_geo].[tehsil_name], 
                   [main].[v_geo].[uc_id], 
                   [main].[v_geo].[uc_name], 
                   [main].[v_geo].[site_name], 
                   [tblOtpAdd].*
            FROM   [main].[v_geo]
                   INNER JOIN [main].[tblOtpAdd] ON [main].[v_geo].[site_id] = [main].[tblOtpAdd].[site_id]
            WHERE  [main].[tblOtpAdd].[is_deleted] = 0
            UNION ALL
            SELECT 
                   [v_geo_tehsil].[province_id], 
                   [v_geo_tehsil].[province_name] AS [province], 
                   [v_geo_tehsil].[district_id], 
                   [v_geo_tehsil].[district_name], 
                   [v_geo_tehsil].[tehsil_id], 
                   [v_geo_tehsil].[tehsil_name], 
                   '' AS [uc_id], 
                   '' AS [uc_name], 
                   '' AS [site_name], 
                   [tblOtpAdd].*
            FROM   [main].[v_geo_tehsil]
                   INNER JOIN [main].[tblOtpAdd] ON [main].[v_geo_tehsil].[tehsil_id] = [main].[tblOtpAdd].[tehsil_id]
            WHERE  [main].[tblOtpAdd].[is_deleted] = 0
                     AND [main].[tblOtpAdd].[site_id] = '';`)
            await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
        } catch (error) {
            console.log(`version 1554 update error - updating view for otp reports v_otpAddmision2`)
        }
       

    }else{
        console.log('already pdated till 1554')
    }
    
}