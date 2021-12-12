var fs = require("fs");

module.exports = async (knex, dialog) => {
  if (fs.existsSync(`${process.env.APPDATA}/nims_aap/config.json`)) {
    var x = JSON.parse(
      fs.readFileSync(`${process.env.APPDATA}/nims_aap/config.json`, {
        encoding: "utf8",
      })
    );
    if (!x.createdVersion || x.createdVersion !== "1.5.65") {
      try {
        await knex.raw(`CREATE TABLE IF NOT EXISTS  [aapUpdate](
                                   [id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, 
                                   [version] INTEGER, 
                                   [desc] VARCHAR(50));
                                 `);
        var _version = 1554;
        var v_check = await knex("aapUpdate")
          .select("version")
          .where({ version: _version });
        if (!v_check.length) {
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`);
          await knex.raw(` DROP VIEW IF EXISTS [main].[v_otpAddmision2];`);
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
                                 AND [main].[tblOtpAdd].[site_id] = '';`);
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);

          var add = { version: 1554, desc: "update v_otpAddmision2 view" };
          await knex("aapUpdate").insert(add);
          console.log({ add });
        }
        var _version = 1555;
        var v_check = await knex("aapUpdate")
          .select("version")
          .where({ version: _version });
        if (!v_check.length) {
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`);
          await knex.raw(
            `DROP VIEW IF EXISTS [main].[v_otpExitFullForUpdateNSC];`
          );
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
                                   AND [tblOtpAdd].[prog_type] = 'sc';`);
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`);
          await knex.raw(`DROP VIEW IF EXISTS [main].[v_otpAdd_full];`);
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
                          WHERE  [main].[tblOtpAdd].[is_deleted] = 0;`);
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);
          var add = {
            version: _version,
            desc: "updated v_otpExitFullForUpdateNSC, v_otpAdd_full view",
          };
          await knex("aapUpdate").insert(add);
          //      console.log(`${_version} desc:'update v_otpExitFullForUpdateNSC view'`)
          console.log({ add });
        }
        var _version = 1560;
        var v_check = await knex("aapUpdate")
          .select("version")
          .where({ version: _version });
        if (!v_check.length) {
          await knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`);
          await knex.raw(`PRAGMA [main].foreign_keys = 'off';`);
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`);
          await knex.raw(
            `ALTER TABLE [main].[tblGeoNutSite] RENAME TO [_sqliteexpert_temp_table_1];`
          );
          await knex.raw(`CREATE TABLE [main].[tblGeoNutSite](
                                                 [id] integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                                                 [siteName] varchar(255), 
                                                 [province_id] integer, 
                                                 [district_id] integer, 
                                                 [tehsil_id] integer, 
                                                 [uc_id] integer, 
                                                 [OTP] integer, 
                                                 [SFP] integer, 
                                                 [SC] integer, 
                                                 [created_at] datetime, 
                                                 [updated_at] datetime, 
                                                 [isActive] BOOLEAN DEFAULT 1, 
                                                 [lat] FLOAT, 
                                                 [lang] FLOAT);
                                               `);
          await knex.raw(`INSERT INTO [main].[tblGeoNutSite]([rowid], [id], [siteName], [province_id], [district_id], [tehsil_id], [uc_id], [OTP], [SFP], [SC], [created_at], [updated_at], [isActive])
                                          SELECT [rowid], [id], [siteName], [province_id], [district_id], [tehsil_id], [uc_id], [OTP], [SFP], [SC], [created_at], [updated_at], [isActive]
                                          FROM [main].[_sqliteexpert_temp_table_1];`);
          await knex.raw(
            `DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`
          );
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);
          await knex.raw(`PRAGMA [main].foreign_keys = 'on';`);
          await knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`);
          await knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`);
          await knex.raw(`PRAGMA [main].foreign_keys = 'off';`);
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`);
          await knex.raw(
            `ALTER TABLE [main].[tblLhw] RENAME TO [_sqliteexpert_temp_table_1];`
          );
          await knex.raw(`CREATE TABLE [main].[tblLhw](
                                                 [site] INT, 
                                                 [uc] INT NOT NULL, 
                                                 [tehsil] INT NOT NULL, 
                                                 [district] INT NOT NULL, 
                                                 [staff_name] VARCHAR(50) NOT NULL, 
                                                 [staff_code] VARCHAR(10) NOT NULL UNIQUE, 
                                                 [province] INT NOT NULL, 
                                                 [id_old] INTEGER, 
                                                 [id] char(36), 
                                                 [client_id] VARCHAR NOT NULL, 
                                                 [upload_status] INT NOT NULL DEFAULT 0, 
                                                 [created_at] DATE, 
                                                 [upload_date] DATE, 
                                                 [is_deleted] BOOLEAN NOT NULL DEFAULT 0, 
                                                 [lat] FLOAT, 
                                                 [lang] FLOAT);
                                               `);
          await knex.raw(`INSERT INTO [main].[tblLhw]([rowid], [site], [uc], [tehsil], [district], [staff_name], [staff_code], [province], [id_old], [id], [client_id], [upload_status], [created_at], [upload_date], [is_deleted])
                                          SELECT [rowid], [site], [uc], [tehsil], [district], [staff_name], [staff_code], [province], [id_old], [id], [client_id], [upload_status], [created_at], [upload_date], [is_deleted]
                                          FROM [main].[_sqliteexpert_temp_table_1];
                                          `);
          await knex.raw(
            `DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`
          );
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);
          await knex.raw(`PRAGMA [main].foreign_keys = 'on';`);
          await knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`);
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`);
          await knex.raw(`DROP VIEW IF EXISTS [main].[v_geo_lhw];`);
          await knex.raw(`CREATE VIEW [main].[v_geo_lhw]
                                          AS
                                          SELECT 
                                                 [v_geo_uc].*, 
                                                 [main].[tblLhw].[staff_name], 
                                                 [main].[tblLhw].[staff_code], 
                                                 [main].[tblLhw].[lat], 
                                                 [main].[tblLhw].[lang]
                                          FROM   [main].[v_geo_uc]
                                                 INNER JOIN [main].[tblLhw] ON [main].[tblLhw].[uc] = [main].[v_geo_uc].[uc_id];
                                          `);
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);
          // var _send = {type:'success', msg: `Your application is updated to version: ${_version} \\n now you can add Geo location for CHWs`}
          // win.webContents.send('softwareUpd', _send);
          var add = {
            version: _version,
            desc: "updated table for nut site and lhw to support geo mapping",
          };
          await knex("aapUpdate").insert(add);
          console.log({ add });
        }
        var _version = 1576;
        var v_check = await knex("aapUpdate")
          .select("version")
          .where({ version: _version });
        if (!v_check.length) {
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`);
          await knex.raw(`DROP VIEW IF EXISTS [main].[v_otpExit_full];`);
          await knex.raw(`CREATE VIEW [main].[v_otpExit_full]
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
                 [main].[tblOtpAdd].[site_village], 
                 [main].[tblOtpAdd].[prog_type], 
                 [main].[tblOtpExit].[exit_date], 
                 [main].[tblOtpExit].[exit_reason], 
                 [main].[tblOtpExit].[exit_weight], 
                 [main].[tblOtpExit].[exit_muac], 
                 [main].[tblOtpExit].[is_deleted], 
                 [main].[tblOtpAdd].[p_name], 
                 [main].[tblOtpAdd].[f_or_h_name], 
                 [main].[tblOtpAdd].[gender], 
                 [main].[tblOtpAdd].[reg_id], 
                 [main].[tblOtpAdd].[reg_date], 
                 [main].[tblOtpAdd].[plw_type]
          FROM   [main].[v_geo]
                 INNER JOIN [main].[tblOtpAdd] ON [main].[v_geo].[site_id] = [main].[tblOtpAdd].[site_id]
                 INNER JOIN [main].[tblOtpExit] ON [main].[tblOtpAdd].[otp_id] = [main].[tblOtpExit].[otp_id]
          WHERE  [main].[tblOtpExit].[is_deleted] = 0
                   AND [main].[tblOtpAdd].[is_deleted] = 0;`);
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);
          var add = {
            version: _version,
            desc: "updated table for single data export with programme type",
          };
          await knex("aapUpdate").insert(add);
          console.log({ add });
        }
        var _version = 1580;
        var v_check = await knex("aapUpdate")
          .select("version")
          .where({ version: _version });
        if (!v_check.length) {
          await knex('tblScrChildren').update({ upload_status: 2 });
          var add = {
            version: _version,
            desc: "table children screening updated to upload data",
          };
          await knex("aapUpdate").insert(add);
          console.log({ add });
        }
        
        var _version = 1582;
        var v_check = await knex("aapUpdate")
          .select("version")
          .where({ version: _version });
        if (!v_check.length) {
          await knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
          await knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
          await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)          
          await knex.raw(`ALTER TABLE [main].[tblSupervisors] RENAME TO [_sqliteexpert_temp_table_1];`)          
          await knex.raw(`CREATE TABLE [main].[tblSupervisors](
            [site] INT, 
            [uc] INT NOT NULL, 
            [tehsil] INT NOT NULL, 
            [district] INT NOT NULL, 
            [sup_name] varchar(50) NOT NULL, 
            [sup_code] VARCHAR(10) NOT NULL UNIQUE, 
            [province] INT NOT NULL, 
            [id_old] INTEGER, 
            [id] char(36), 
            [client_id] VARCHAR NOT NULL, 
            [upload_status] VARCHAR NOT NULL DEFAULT 0, 
            [created_at] DATE, 
            [upload_date] DATE, 
            [is_deleted] BOOLEAN NOT NULL DEFAULT 0, 
            UNIQUE([sup_code], [district]) ON CONFLICT ROLLBACK);`);
          await knex.raw(`INSERT INTO [main].[tblSupervisors]([rowid], [site], [uc], [tehsil], [district], [sup_name], [sup_code], [province], [id_old], [id], [client_id], [upload_status], [created_at], [upload_date], [is_deleted])
          SELECT [rowid], [site], [uc], [tehsil], [district], [sup_name], [sup_code], [province], [id_old], [id], [client_id], [upload_status], [created_at], [upload_date], [is_deleted]
          FROM [main].[_sqliteexpert_temp_table_1];`);
          await knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`);          
          await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`);
          await knex.raw(`PRAGMA [main].foreign_keys = 'on';`);          
          await knex.raw(`PRAGMA [main].legacy_alter_table = 'off'`);
          await knex.raw(`update tblStokDistv2 set created_at=null`);
          await knex.raw(`update tblLhw set created_at = null `);
          await knex.raw(`create view scrplwreportv4 as
          select province,district_name,tehsil_name,uc_name,screening_date,report_month,ent_type,village,staff_name,staff_code,sup_name,sup_code,total_scr_pragnent,total_scr_lactating as [Total Lactating (Ch:0-3 M)],total_scr_lactating2 as [ Total Lactating (Ch:4-6 M)],new_scr_pragnent,new_scr_lactating as [New Lactating (Ch:0-3 M)],new_scr_lactating2 as [ New Lactating (Ch:4-6 M)],reScreened_scr_pragnent,reScreened_scr_lactating as [ ReScreened Lactating (Ch:0-3 M)],reScreened_scr_lactating2 as [ ReScreened Lactating (Ch:4-6 M)],muac_le_21_pragnent,muac_le_21_lactating as [MUAC <21 Lactating (Ch:0-3 M)],muac_le_21_lactating2 as [MUAC <21 Lactating (Ch:4-6 M)],muac_gt_21_pragnent,
          muac_gt_21_lactating as [MUAC >21 Lactating (Ch:0-3 M)],
          muac_gt_21_lactating2 as [MUAC >21 Lactating (Ch:4-6 M)],
          ifa_first_time_pragnent,ifa_first_time_lactating,followup_pragnent,followup_lactating,exits_pragnent,exit_lactating,upload_date,catchment_population,total_hh,total_followup,total_exits,ifa_first_time_lactating2,total_adolescent,username,project,upload_status,is_deleted, province_id, district_id, tehsil_id, uc_id, site_id
          from v_ScrPlwUpd`);
          await knex.raw(`CREATE VIEW [allExitsNotDel]
          AS
          SELECT *
          FROM   [tblOtpExit]
          WHERE  [is_deleted] = 0;`)
          await knex.raw(`CREATE VIEW [oneTable]
          AS
          SELECT 
                 [tblOtpAdd].*, 
                 [allExitsNotDel].[exit_muac], 
                 [allExitsNotDel].[exit_weight], 
                 [allExitsNotDel].[exit_height], 
                 [allExitsNotDel].[exit_reason], 
                 [allExitsNotDel].[days_in_program], 
                 [allExitsNotDel].[weight_gain], 
                 [allExitsNotDel].[exit_date]
          FROM   [tblOtpAdd]
                 LEFT JOIN [allExitsNotDel] ON [tblOtpAdd].[otp_id] = [allExitsNotDel].[otp_id]
          WHERE  [tblOtpAdd].[is_deleted] = 0;`)
          
          await knex.raw(`create view v_geo_active1 as
          SELECT 
                 [tblGeoProvince].[id] AS [province_id], 
                 [tblGeoProvince].[provinceName] AS [province], 
                 [tblGeoDistrict].[id] AS [district_id], 
                 [tblGeoDistrict].[districtName] AS [district_name], 
                 [tblGeoTehsil].[id] AS [tehsil_id], 
                 [tblGeoTehsil].[tehsilName] AS [tehsil_name], 
                 [tblGeoUC].[id] AS [uc_id], 
                 [tblGeoUC].[ucName] AS [uc_name], 
                 [tblGeoNutSite].[siteName] AS [site_name], 
                 [tblGeoNutSite].[OTP], 
                 [tblGeoNutSite].[SFP], 
                 [tblGeoNutSite].[SC], 
                 [tblGeoNutSite].[id] AS [site_id]
          FROM   [tblGeoDistrict]
                 INNER JOIN [tblGeoProvince] ON [tblGeoDistrict].[province_id] = [tblGeoProvince].[id]
                 INNER JOIN [tblGeoTehsil] ON [tblGeoDistrict].[id] = [tblGeoTehsil].[district_id]
                 INNER JOIN [tblGeoUC] ON [tblGeoTehsil].[id] = [tblGeoUC].[tehsil_id]
                 INNER JOIN [tblGeoNutSite] ON [tblGeoUC].[id] = [tblGeoNutSite].[uc_id]
          WHERE  [tblGeoUC].[isActive] = 1
                   AND [tblGeoTehsil].[isActive] = 1
                   AND [tblGeoNutSite].[isActive] = 1
                   AND [tblGeoDistrict].[isActive] = 1
          UNION ALL
          SELECT 
                 [main].[tblGeoDistrict].[province_id], 
                 [main].[tblGeoProvince].[provinceName] AS [province], 
                 [main].[tblGeoTehsil].[district_id], 
                 [main].[tblGeoDistrict].[districtName] AS [district_name], 
                 [main].[tblGeoNutSite].[tehsil_id], 
                 [main].[tblGeoTehsil].[tehsilName] AS [tehsil_name], 
                 '' AS [uc_id], 
                 '' AS [uc_name], 
                 [main].[tblGeoNutSite].[siteName] AS [site_name], 
                 [main].[tblGeoNutSite].[OTP], 
                 [main].[tblGeoNutSite].[SFP], 
                 [main].[tblGeoNutSite].[SC], 
                 [tblGeoNutSite].[id] AS [site_id]
          FROM   [main].[tblGeoDistrict]
                 INNER JOIN [main].[tblGeoTehsil] ON [main].[tblGeoDistrict].[id] = [main].[tblGeoTehsil].[district_id]
                 INNER JOIN [main].[tblGeoNutSite] ON [main].[tblGeoTehsil].[id] = [main].[tblGeoNutSite].[tehsil_id]
                 INNER JOIN [main].[tblGeoProvince] ON [main].[tblGeoProvince].[id] = [main].[tblGeoDistrict].[province_id]
          WHERE  [main].[tblGeoNutSite].[uc_id] IS NULL;`)

          await knex.raw(`CREATE VIEW [oneTableGeo]
          AS
          SELECT *
          FROM   [oneTable]
                 INNER JOIN [v_geo_active1] ON [oneTable].[site_id] = [v_geo_active1].[site_id];`)


          // await knex('tblScrChildren').update({ upload_status: 2 });
          var add = {
            version: _version,
            desc: "report issues resolved",
          };
          await knex("aapUpdate").insert(add);
          console.log({ add });
          }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("db already updated");
    }
  }
};
