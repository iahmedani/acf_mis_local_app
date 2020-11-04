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
            await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
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
            await knex.raw(`CREATE TABLE [aapUpdate](
                [id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, 
                [version] INTEGER, 
                [desc] VARCHAR(50));
              `)
              var add = {version : _version, desc:'update v_otpAddmision2 view'}
              await knex('aapUpdate').insert(add);
        } catch (error) {
            console.log(`version 1554 update error - updating view for otp reports v_otpAddmision2`)
        }
       

    }if(_version == 1555){
        try {
            var v_check = await knex('aapUpdate').select('version').where({version: _version})
            if(v_check.length){
            await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
            await knex.raw(`DROP VIEW IF EXISTS [main].[v_otpExitFullForUpdateNSC];`)
            await knex.raw(`CREATE VIEW [main].[v_otpExitFullForUpdateNSC]
            AS
            SELECT 
                   [main].[tblOtpAdd].[site_id], 
                   [main].[tblOtpAdd].[p_name], 
                   [main].[tblOtpAdd].[reg_id], 
                   [main].[tblOtpAdd].[reg_date] AS [add_date], 
                   [main].[tblOtpAdd].[site_village], 
                   [main].[tblOtpAdd].[prog_type], 
                   [main].[tblOtpAdd].[weight] AS [add_weight], 
                   [main].[v_geo].[province_id], 
                   [main].[v_geo].[province], 
                   [main].[v_geo].[district_id], 
                   [main].[v_geo].[district_name], 
                   [main].[v_geo].[tehsil_id], 
                   [main].[v_geo].[tehsil_name], 
                   [main].[v_geo].[uc_id], 
                   [main].[v_geo].[uc_name], 
                   [main].[v_geo].[site_name], 
                   [tblOtpExit].*
            FROM   [main].[tblOtpAdd]
                   INNER JOIN [main].[tblOtpExit] ON [main].[tblOtpAdd].[otp_id] = [main].[tblOtpExit].[otp_id]
                   INNER JOIN [main].[v_geo] ON [main].[tblOtpAdd].[site_id] = [main].[v_geo].[site_id]
            WHERE  [tblOtpExit].[is_deleted] = 0
                     AND [tblOtpAdd].[prog_type] = 'otp'
            UNION ALL
            SELECT 
                   [main].[tblOtpAdd].[site_id], 
                   [main].[tblOtpAdd].[p_name], 
                   [main].[tblOtpAdd].[reg_id], 
                   [main].[tblOtpAdd].[reg_date] AS [add_date], 
                   [main].[tblOtpAdd].[site_village], 
                   [main].[tblOtpAdd].[prog_type], 
                   [main].[tblOtpAdd].[weight] AS [add_weight], 
                   [main].[v_geo].[province_id], 
                   [main].[v_geo].[province], 
                   [main].[v_geo].[district_id], 
                   [main].[v_geo].[district_name], 
                   [main].[v_geo].[tehsil_id], 
                   [main].[v_geo].[tehsil_name], 
                   [main].[v_geo].[uc_id], 
                   [main].[v_geo].[uc_name], 
                   [main].[v_geo].[site_name], 
                   [tblOtpExit].*
            FROM   [main].[tblOtpAdd]
                   INNER JOIN [main].[tblOtpExit] ON [main].[tblOtpAdd].[otp_id] = [main].[tblOtpExit].[otp_id]
                   INNER JOIN [main].[v_geo] ON [main].[tblOtpAdd].[site_id] = [main].[v_geo].[site_id]
            WHERE  [tblOtpExit].[is_deleted] = 0
                     AND [tblOtpAdd].[prog_type] = 'sc';`)
            await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
            await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
            await knex.raw(`DROP VIEW IF EXISTS [main].[v_otpAdd_full];`)
            await knex.raw(`CREATE VIEW [main].[v_otpAdd_full]
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
                   [main].[v_geo].[site_id], 
                   [main].[tblOtpAdd].[client_id], 
                   [main].[tblOtpAdd].[site_village], 
                   [main].[tblOtpAdd].[p_name], 
                   [main].[tblOtpAdd].[otp_id], 
                   [main].[tblOtpAdd].[f_or_h_name], 
                   [main].[tblOtpAdd].[cnic], 
                   [main].[tblOtpAdd].[cnt_number], 
                   [main].[tblOtpAdd].[address], 
                   [main].[tblOtpAdd].[reg_date], 
                   [main].[tblOtpAdd].[reg_id], 
                   [main].[tblOtpAdd].[gender], 
                   [main].[tblOtpAdd].[age], 
                   [main].[tblOtpAdd].[ent_reason], 
                   [main].[tblOtpAdd].[ref_type], 
                   [main].[tblOtpAdd].[oedema], 
                   [main].[tblOtpAdd].[muac], 
                   [main].[tblOtpAdd].[weight], 
                   [main].[tblOtpAdd].[height], 
                   [main].[tblOtpAdd].[diarrhoea], 
                   [main].[tblOtpAdd].[vomiting], 
                   [main].[tblOtpAdd].[cough], 
                   [main].[tblOtpAdd].[appetite], 
                   [main].[tblOtpAdd].[daily_stool], 
                   [main].[tblOtpAdd].[pass_urine], 
                   [main].[tblOtpAdd].[b_Feeding], 
                   [main].[tblOtpAdd].[prog_type], 
                   [main].[tblOtpAdd].[is_deleted], 
                   [main].[tblOtpAdd].[plw_type], 
                   [main].[tblOtpAdd].[lhw_code], 
                   [main].[tblOtpAdd].[lhw_name], 
                   [main].[tblOtpAdd].[lhw_cnt_number], 
                   [main].[tblOtpAdd].[resp_rate], 
                   [main].[tblOtpAdd].[chest_in_drawing], 
                   [main].[tblOtpAdd].[temp], 
                   [main].[tblOtpAdd].[conjuctives], 
                   [main].[tblOtpAdd].[eyes], 
                   [main].[tblOtpAdd].[dehyderation], 
                   [main].[tblOtpAdd].[ears], 
                   [main].[tblOtpAdd].[mouth], 
                   [main].[tblOtpAdd].[lymph_nodes], 
                   [main].[tblOtpAdd].[disability], 
                   [main].[tblOtpAdd].[skin_problems], 
                   [main].[tblOtpAdd].[extemities], 
                   [main].[tblOtpAdd].[measels]
            FROM   [main].[v_geo]
                   INNER JOIN [main].[tblOtpAdd] ON [main].[v_geo].[site_id] = [main].[tblOtpAdd].[site_id]
            WHERE  [main].[tblOtpAdd].[is_deleted] = 0;`)
            await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
            var add = {version: _version, desc:'updated v_otpExitFullForUpdateNSC, v_otpAdd_full view'}
            await knex('aapUpdate').insert(add);
            console.log(`${_version} desc:'update v_otpExitFullForUpdateNSC view'`)
            }
        } catch (error) {
            console.log(error)
        }
    }else{
        console.log('already pdated till 1554')
    }
    
}