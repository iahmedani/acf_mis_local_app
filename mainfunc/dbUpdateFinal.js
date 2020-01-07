const fs = require('fs');
const {
    app
} = require('electron');
var regex = /([/./])/g;
module.exports = (knex) => {
    var _version = app.getVersion();
    _version = parseInt(_version.replace(regex, ''));
    console.log(_version)
    fs.stat(`${process.env.APPDATA}/nims_aap/.nv`, (err, stat) => {
        if (err) {
            console.log(err)
            fs.writeFileSync(`${process.env.APPDATA}/nims_aap/.nv`, _version, 'utf8')
        } else if (stat) {
            var oldV = fs.readFileSync(`${process.env.APPDATA}/nims_aap/.nv`, {
                encoding: 'utf8'
            });
            oldV = parseInt(oldV.replace(regex, ''));
            console.log(oldV)

            for (_vold = oldV; _vold <= _version; _vold++) {
                console.log(_vold)
                if (_vold <= 1547) {
                    knex.raw(`DROP VIEW IF EXISTS [main].[v_otpExitFullForUpdateNSC];`)
                        .then(r => {
                            return knex.raw(`CREATE VIEW [main].[v_otpExitFullForUpdateNSC]
                            AS
                            SELECT 
                                   [main].[tblOtpAdd].[site_id], 
                                   [main].[tblOtpAdd].[p_name], 
                                   [main].[tblOtpAdd].[reg_id], 
                                   [main].[tblOtpAdd].[site_village], 
                                   [main].[tblOtpAdd].[prog_type], 
                                   [main].[tblOtpAdd].[reg_date] AS [add_date], 
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
                            UNION ALL
                            SELECT 
                                   [main].[tblOtpAdd].[site_id], 
                                   [main].[tblOtpAdd].[p_name], 
                                   [main].[tblOtpAdd].[reg_id], 
                                   [main].[tblOtpAdd].[site_village], 
                                   [main].[tblOtpAdd].[prog_type], 
                                   [main].[tblOtpAdd].[reg_date] AS [add_date], 
                                   [main].[v_geo_tehsil].[province_id], 
                                   [main].[v_geo_tehsil].[province_name] AS [province], 
                                   [main].[v_geo_tehsil].[district_id], 
                                   [main].[v_geo_tehsil].[district_name], 
                                   [main].[v_geo_tehsil].[tehsil_id], 
                                   [main].[v_geo_tehsil].[tehsil_name], 
                                   '' AS [uc_id], 
                                   '' AS [uc_name], 
                                   '' AS [site_name], 
                                   [tblOtpExit].*
                            FROM   [main].[tblOtpAdd]
                                   INNER JOIN [main].[tblOtpExit] ON [main].[tblOtpAdd].[otp_id] = [main].[tblOtpExit].[otp_id]
                                   INNER JOIN [main].[v_geo_tehsil] ON [main].[tblOtpAdd].[tehsil_id] = [main].[v_geo_tehsil].[tehsil_id]
                            WHERE  [tblOtpExit].[is_deleted] = 0
                                     AND [tblOtpAdd].[prog_type] = 'sc';`)
                        })
                        .then(r => {
                            return knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
                        })
                        .then(r => {
                            console.log('db updated till version 1.5.44')
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
                if (_vold > 1551 && _vold < 1553) {
                    knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
                        .then(r => {
                            return knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
                        }).then(r => {
                            return knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
                        }).then(r => {
                            return knex.raw(`ALTER TABLE [main].[tblSessions] RENAME TO [_sqliteexpert_temp_table_1];`)
                        }).then(r => {
                            return knex.raw(`CREATE TABLE [main].[tblSessions](
                                [session_id] char(36), 
                                [session_id_old] integer, 
                                [site_id] integer, 
                                [client_id] varchar(255), 
                                [session_date] date, 
                                [session_type] varchar(255), 
                                [male_participants] INTEGER, 
                                [female_participants] INTEGER, 
                                [session_location] varchar(255), 
                                [upload_status] integer, 
                                [created_at] datetime, 
                                [updated_at] datetime, 
                                [old_participants] INTEGER, 
                                [new_participants] INTEGER, 
                                [username] VARCHAR(50), 
                                [org_name] VARCHAR(50), 
                                [project_name] VARCHAR(50), 
                                [pragnent] INT, 
                                [lactating] INT, 
                                [is_deleted] INTEGER(1) NOT NULL DEFAULT 0, 
                                [remarks] VARCHAR NOT NULL DEFAULT "N/A", 
                                [CHS_id] VARCHAR, 
                                [CHW_id] VARCHAR, 
                                [upload_date] DATE, 
                                [prog_type] varchar(10), 
                                [total_session] INTEGER DEFAULT 0, 
                                [ind_session] INTEGER DEFAULT 0, 
                                [grp_sessions] INTEGER DEFAULT 0, 
                                [uc_id] INTEGER, 
                                [fsg] INT DEFAULT 0, 
                                [msg] INT DEFAULT 0);`)
                        }).then(r => {
                            return knex.raw(`INSERT INTO [main].[tblSessions]([rowid], [session_id], [session_id_old], [site_id], [client_id], [session_date], [session_type], [male_participants], [female_participants], [session_location], [upload_status], [created_at], [updated_at], [old_participants], [new_participants], [username], [org_name], [project_name], [pragnent], [lactating], [is_deleted], [remarks], [CHS_id], [CHW_id], [upload_date], [prog_type], [total_session], [ind_session], [grp_sessions], [uc_id])
                            SELECT [rowid], [session_id], [session_id_old], [site_id], [client_id], [session_date], [session_type], [male_participants], [female_participants], [session_location], [upload_status], [created_at], [updated_at], [old_participants], [new_participants], [username], [org_name], [project_name], [pragnent], [lactating], [is_deleted], [remarks], [CHS_id], [CHW_id], [upload_date], [prog_type], [total_session], [ind_session], [grp_sessions], [uc_id]
                            FROM [main].[_sqliteexpert_temp_table_1];`)
                        }).then(r => {
                            return knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`)
                        }).then(r => {
                            return knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
                        }).then(r => {
                            return knex.raw(`PRAGMA [main].foreign_keys = 'on';`)
                        }).then(r => {
                            return knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`)
                        }).then(r => {
                            console.log(`sessions table is updated`)
                        })
                } else {
                    console.log('database allready updated')
                }

                if (_vold == _version) {
                    fs.writeFileSync(`${process.env.APPDATA}/ACF MIS Local app/.nv`, _version, 'utf8')
                }

            }
        }
    })
}