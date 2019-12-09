const fs = require('fs');
const {
    app
} = require('electron');
var regex = /([/./])/g;
module.exports = (knex) => {
    var _version = app.getVersion();
    _version = parseInt(_version.replace(regex, ''));
    console.log(_version)
    // fs.stat(`${process.env.APPDATA}/nims_aap/.nv`, (err, stat)=>{
    //     if(err){
    //         console.log(err)
    //         fs.writeFileSync(`${process.env.APPDATA}/nims_aap/.nv`, _version, 'utf8')
    //     }else if(stat){
    //         var oldV = fs.readFileSync(`${process.env.APPDATA}/nims_aap/.nv`, {
    //             encoding: 'utf8'
    //         });
    //         oldV = parseInt(oldV.replace(regex, ''));
    //         console.log(oldV)

    //         for(_vold = oldV; _vold <= _version; _vold++){
    //             console.log(_vold)
    //             if(_vold <= 1546){
    //                 knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
    //                 .then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
    //                 }).then(r=>{                    
    //                 return knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
    //                 })
    //                 .then(r=>{
    //                     return knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`ALTER TABLE [main].[tblScrPlw] RENAME TO [_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`CREATE TABLE [main].[tblScrPlw](
    //                         [plw_scr_id_old] INTEGER, 
    //                         [plw_scr_id] char(36), 
    //                         [site_id] INTEGER, 
    //                         [screening_date] DATE, 
    //                         [created_at] DATE, 
    //                         [village] VARCHAR(50), 
    //                         [staff_name] VARCHAR(50), 
    //                         [staff_code] VARCHAR(10), 
    //                         [sup_name] VARCHAR(50), 
    //                         [sup_code] VARCHAR(10), 
    //                         [total_scr_pragnent] INTEGER, 
    //                         [total_scr_lactating] INTEGER, 
    //                         [new_scr_pragnent] INTEGER, 
    //                         [new_scr_lactating] INTEGER, 
    //                         [reScreened_scr_pragnent] INTEGER, 
    //                         [reScreened_scr_lactating] INTEGER, 
    //                         [muac_gt_21_pragnent] INTEGER, 
    //                         [muac_gt_21_lactating] INTEGER, 
    //                         [muac_le_21_pragnent] INTEGER, 
    //                         [muac_le_21_lactating] INTEGER, 
    //                         [client_id] varchar(255), 
    //                         [username] VARCHAR, 
    //                         [project] VARCHAR, 
    //                         [upload_status] INTEGER DEFAULT 0, 
    //                         [approved] INTEGER, 
    //                         [is_deleted] INTEGER(1) NOT NULL DEFAULT 0, 
    //                         [report_month] VARCHAR, 
    //                         [ifa_first_time_pragnent] INTEGER NOT NULL DEFAULT 0, 
    //                         [ifa_first_time_lactating] INTEGER NOT NULL DEFAULT 0, 
    //                         [followup_pragnent] INTEGER NOT NULL DEFAULT 0, 
    //                         [followup_lactating] INTEGER NOT NULL DEFAULT 0, 
    //                         [exits_pragnent] INTEGER NOT NULL DEFAULT 0, 
    //                         [exit_lactating] INTEGER NOT NULL DEFAULT 0, 
    //                         [upload_date] DATE, 
    //                         [uc_id] INTEGER, 
    //                         [catchment_population] INTEGER, 
    //                         [total_hh], 
    //                         [total_followup] INTEGER DEFAULT 0, 
    //                         [total_exits] INTEGER DEFAULT 0, 
    //                         [ent_type] CHAR(10));`)
    //                 }).then(r=>{
    //                     return knex.raw(`INSERT INTO [main].[tblScrPlw]([rowid], [plw_scr_id_old], [plw_scr_id], [site_id], [screening_date], [created_at], [village], [staff_name], [staff_code], [sup_name], [sup_code], [total_scr_pragnent], [total_scr_lactating], [new_scr_pragnent], [new_scr_lactating], [reScreened_scr_pragnent], [reScreened_scr_lactating], [muac_gt_21_pragnent], [muac_gt_21_lactating], [muac_le_21_pragnent], [muac_le_21_lactating], [client_id], [username], [project], [upload_status], [approved], [is_deleted], [report_month], [ifa_first_time_pragnent], [ifa_first_time_lactating], [followup_pragnent], [followup_lactating], [exits_pragnent], [exit_lactating], [upload_date], [uc_id], [catchment_population], [total_hh], [total_followup], [total_exits], [ent_type])
    //                     SELECT [rowid], [plw_scr_id_old], [plw_scr_id], [site_id], [screening_date], [created_at], [village], [staff_name], [staff_code], [sup_name], [sup_code], [total_scr_pragnent], [total_scr_lactating], [new_scr_pragnent], [new_scr_lactating], [reScreened_scr_pragnent], [reScreened_scr_lactating], [muac_gt_21_pragnent], [muac_gt_21_lactating], [muac_le_21_pragnent], [muac_le_21_lactating], [client_id], [username], [project], [upload_status], [approved], [is_deleted], [report_month], [ifa_first_time_pragnent], [ifa_first_time_lactating], [followup_pragnent], [followup_lactating], [exits_pragnent], [exit_lactating], [upload_date], [uc_id], [catchment_population], [total_hh], [total_followup], [total_exits], [ent_type]
    //                     FROM [main].[_sqliteexpert_temp_table_1];
    //                     `)
    //                 }).then(r=>{
    //                     return knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'on';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`)
    //                 })
    //                 .then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`ALTER TABLE [main].[tblScrChildren] RENAME TO [_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`CREATE TABLE [main].[tblScrChildren](
    //                         [ch_scr_id_old] INTEGER, 
    //                         [ch_scr_id] char(36), 
    //                         [site_id] INTEGER, 
    //                         [screening_date] DATE, 
    //                         [created_at] DATE, 
    //                         [catchment_population] INTEGER DEFAULT 0, 
    //                         [staff_name] VARCHAR(50), 
    //                         [staff_code] VARCHAR(50), 
    //                         [sup_name] VARCHAR(50), 
    //                         [sup_code] VARCHAR(50), 
    //                         [total_scr_girls] INTEGER, 
    //                         [total_scr_boys] INTEGER, 
    //                         [sam_without_comp_girls_623] INTEGER, 
    //                         [sam_without_comp_boys_623] INTEGER, 
    //                         [sam_with_comp_girls_623] INTEGER, 
    //                         [sam_with_comp_boys_623] INTEGER, 
    //                         [mam_girls_623] INTEGER, 
    //                         [mam_boys_623] INTEGER, 
    //                         [sam_without_comp_girls_2459] INTEGER, 
    //                         [sam_without_comp_boys_2459] INTEGER, 
    //                         [sam_with_comp_girls_2459] INTEGER, 
    //                         [sam_with_comp_boys_2459] INTEGER, 
    //                         [mam_girls_2459] INTEGER, 
    //                         [mam_boys_2459] INTEGER, 
    //                         [reffer_tsfp_girls] INTEGER, 
    //                         [reffer_otp_girls] INTEGER, 
    //                         [reffer_tsfp_boys] INTEGER, 
    //                         [reffer_otp_boys] INTEGER, 
    //                         [normal_boys_623] INTEGER, 
    //                         [normal_girls_623] INTEGER, 
    //                         [normal_boys_2459] INTEGER, 
    //                         [normal_girls_2459] INTEGER, 
    //                         [plus12_oedema_boys_623] INTEGER, 
    //                         [plus12_oedema_girls_623] INTEGER, 
    //                         [plus12_oedema_boys_2459] INTEGER, 
    //                         [plus12_oedema_girls_2459] INTEGER, 
    //                         [plus3_oedema_boys_623] INTEGER, 
    //                         [plus3_oedema_girls_623] INTEGER, 
    //                         [plus3_oedema_boys_2459] INTEGER, 
    //                         [plus3_oedema_girls_2459] INTEGER, 
    //                         [nsc1_boys_623] INTEGER, 
    //                         [nsc1_girls_623] INTEGER, 
    //                         [nsc1_boys_2459] INTEGER, 
    //                         [nsc1_girls_2459] INTEGER, 
    //                         [deworming_girls] INTEGER, 
    //                         [deworming_boys] INTEGER, 
    //                         [new_boys] INTEGER, 
    //                         [new_girls] INTEGER, 
    //                         [reScreened_boys] INTEGER, 
    //                         [reScreened_girls] INTEGER, 
    //                         [nsc2_boys_623] INTEGER, 
    //                         [nsc2_girls_623] INTEGER, 
    //                         [nsc2_boys_2459] INTEGER, 
    //                         [nsc2_girls_2459] INTEGER, 
    //                         [ent_type] CHAR(10), 
    //                         [nsc_two] CHAR(50), 
    //                         [client_id] INTEGER, 
    //                         [username] VARCHAR, 
    //                         [project] VARCHAR, 
    //                         [upload_status] INTEGER DEFAULT 0, 
    //                         [approved] INTEGER, 
    //                         [is_deleted] INTEGER(1) NOT NULL DEFAULT 0, 
    //                         [report_month] VARCHAR, 
    //                         [followedup_boys] INTEGER, 
    //                         [followedup_girls] INTEGER, 
    //                         [exits_boys] INTEGER, 
    //                         [exits_girls] INTEGER, 
    //                         [other_specify] VARCHAR, 
    //                         [other_boys] INTEGER, 
    //                         [other_girls] INTEGER, 
    //                         [upload_date] DATE, 
    //                         [site_one] VARCHAR(50), 
    //                         [site_two] VARCHAR(50), 
    //                         [reffer_otp_girls_s1] INTEGER DEFAULT 0, 
    //                         [reffer_otp_girls_s2] INTEGER DEFAULT 0, 
    //                         [reffer_otp_boys_s1] INTEGER DEFAULT 0, 
    //                         [reffer_otp_boys_s2] INTEGER DEFAULT 0, 
    //                         [reffer_tsfp_girls_s1] INTEGER DEFAULT 0, 
    //                         [reffer_tsfp_girls_s2] INTEGER DEFAULT 0, 
    //                         [total_hh] INTEGER DEFAULT 0, 
    //                         [uc_id] INTEGER, 
    //                         [reffer_tsfp_boys_s1] INTEGER DEFAULT 0, 
    //                         [reffer_tsfp_boys_s2] INTEGER DEFAULT 0, 
    //                         [mnp_boys] INTEGER DEFAULT 0, 
    //                         [mnp_girls] INTEGER DEFAULT 0, 
    //                         [total_followup] INTEGER DEFAULT 0, 
    //                         [total_exits] INTEGER DEFAULT 0, 
    //                         [nsc_one] CHAR(50));`)
    //                     }).then(r=>{
    //                     return knex.raw(`INSERT INTO [main].[tblScrChildren]([rowid], [ch_scr_id_old], [ch_scr_id], [site_id], [screening_date], [created_at], [catchment_population], [staff_name], [staff_code], [sup_name], [sup_code], [total_scr_girls], [total_scr_boys], [sam_without_comp_girls_623], [sam_without_comp_boys_623], [sam_with_comp_girls_623], [sam_with_comp_boys_623], [mam_girls_623], [mam_boys_623], [sam_without_comp_girls_2459], [sam_without_comp_boys_2459], [sam_with_comp_girls_2459], [sam_with_comp_boys_2459], [mam_girls_2459], [mam_boys_2459], [reffer_tsfp_girls], [reffer_otp_girls], [reffer_tsfp_boys], [reffer_otp_boys], [normal_boys_623], [normal_girls_623], [normal_boys_2459], [normal_girls_2459], [plus12_oedema_boys_623], [plus12_oedema_girls_623], [plus12_oedema_boys_2459], [plus12_oedema_girls_2459], [plus3_oedema_boys_623], [plus3_oedema_girls_623], [plus3_oedema_boys_2459], [plus3_oedema_girls_2459], [nsc1_boys_623], [nsc1_girls_623], [nsc1_boys_2459], [nsc1_girls_2459], [deworming_girls], [deworming_boys], [new_boys], [new_girls], [reScreened_boys], [reScreened_girls], [nsc2_boys_623], [nsc2_girls_623], [nsc2_boys_2459], [nsc2_girls_2459], [ent_type], [nsc_two], [client_id], [username], [project], [upload_status], [approved], [is_deleted], [report_month], [followedup_boys], [followedup_girls], [exits_boys], [exits_girls], [other_specify], [other_boys], [other_girls], [upload_date], [site_one], [site_two], [reffer_otp_girls_s1], [reffer_otp_girls_s2], [reffer_otp_boys_s1], [reffer_otp_boys_s2], [reffer_tsfp_girls_s1], [reffer_tsfp_girls_s2], [total_hh], [uc_id], [reffer_tsfp_boys_s1], [reffer_tsfp_boys_s2], [mnp_boys], [mnp_girls], [total_followup], [total_exits], [nsc_one])
    //                     SELECT [rowid], [ch_scr_id_old], [ch_scr_id], [site_id], [screening_date], [created_at], [catchment_population], [staff_name], [staff_code], [sup_name], [sup_code], [total_scr_girls], [total_scr_boys], [sam_without_comp_girls_623], [sam_without_comp_boys_623], [sam_with_comp_girls_623], [sam_with_comp_boys_623], [mam_girls_623], [mam_boys_623], [sam_without_comp_girls_2459], [sam_without_comp_boys_2459], [sam_with_comp_girls_2459], [sam_with_comp_boys_2459], [mam_girls_2459], [mam_boys_2459], [reffer_tsfp_girls], [reffer_otp_girls], [reffer_tsfp_boys], [reffer_otp_boys], [normal_boys_623], [normal_girls_623], [normal_boys_2459], [normal_girls_2459], [plus12_oedema_boys_623], [plus12_oedema_girls_623], [plus12_oedema_boys_2459], [plus12_oedema_girls_2459], [plus3_oedema_boys_623], [plus3_oedema_girls_623], [plus3_oedema_boys_2459], [plus3_oedema_girls_2459], [nsc1_boys_623], [nsc1_girls_623], [nsc1_boys_2459], [nsc1_girls_2459], [deworming_girls], [deworming_boys], [new_boys], [new_girls], [reScreened_boys], [reScreened_girls], [nsc2_boys_623], [nsc2_girls_623], [nsc2_boys_2459], [nsc2_girls_2459], [ent_type], [nsc_two], [client_id], [username], [project], [upload_status], [approved], [is_deleted], [report_month], [followedup_boys], [followedup_girls], [exits_boys], [exits_girls], [other_specify], [other_boys], [other_girls], [upload_date], [site_one], [site_two], [reffer_otp_girls_s1], [reffer_otp_girls_s2], [reffer_otp_boys_s1], [reffer_otp_boys_s2], [reffer_tsfp_girls_s1], [reffer_tsfp_girls_s2], [total_hh], [uc_id], [reffer_tsfp_boys_s1], [reffer_tsfp_boys_s2], [mnp_boys], [mnp_girls], [total_followup], [total_exits], [nsc_one]
    //                     FROM [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'on';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
    //                 })                   
    //                 .then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(` SAVEPOINT [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`ALTER TABLE [main].[tblOtpAdd] RENAME TO [_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`CREATE TABLE [main].[tblOtpAdd](
    //                         [otp_id] char(36), 
    //                         [otp_id_old] integer, 
    //                         [client_id] varchar(255), 
    //                         [site_id] integer, 
    //                         [site_village] varchar(255), 
    //                         [reg_date] date, 
    //                         [reg_id] varchar(255), 
    //                         [p_name] varchar(255), 
    //                         [f_or_h_name] varchar(255), 
    //                         [cnic] VARCHAR(255), 
    //                         [address] varchar(255), 
    //                         [cnt_number] varchar(255), 
    //                         [age] integer, 
    //                         [gender] varchar(255), 
    //                         [plw_type] varchar(255), 
    //                         [ent_reason] varchar(255), 
    //                         [ref_type] varchar(255), 
    //                         [oedema] varchar(255), 
    //                         [muac] FLOAT, 
    //                         [diarrhoea] boolean, 
    //                         [vomiting] boolean, 
    //                         [cough] boolean, 
    //                         [appetite] varchar(255), 
    //                         [daily_stool] varchar(255), 
    //                         [pass_urine] boolean, 
    //                         [b_Feeding] boolean, 
    //                         [weight] FLOAT, 
    //                         [height] FLOAT, 
    //                         [ration1] varchar(255), 
    //                         [quantity1] integer, 
    //                         [ration2] varchar(255), 
    //                         [quantity2] integer, 
    //                         [ration3] varchar(255), 
    //                         [quantity3] integer, 
    //                         [prog_type] varchar(255), 
    //                         [created_at] datetime, 
    //                         [updated_at] datetime, 
    //                         [upload_status] INTEGER DEFAULT 0, 
    //                         [username] VARCHAR(50), 
    //                         [org_name] VARCHAR(50), 
    //                         [project_name] VARCHAR(50), 
    //                         [is_deleted] BOOLEAN NOT NULL DEFAULT 0, 
    //                         [other_com_name] VARCHAR(20), 
    //                         [other_com_qty] FLOAT, 
    //                         [nsc_old_otp_id] VARCHAR DEFAULT 0, 
    //                         [ref_type_other] VARCHAR, 
    //                         [entry_reason_other] VARCHAR, 
    //                         [travel_time_minutes] INTEGER NOT NULL DEFAULT 0, 
    //                         [is_mother_alive] VARCHAR(3) NOT NULL DEFAULT Yes, 
    //                         [tehsil_id] INTEGER, 
    //                         [nsc_otp_id] VARCHAR, 
    //                         [upload_date] DATE, 
    //                         [hh_id] VARCHAR(20), 
    //                         [lhw_code] CHAR(20), 
    //                         [lhw_name] CHAR(50), 
    //                         [lhw_cnt_number] CHAR(15), 
    //                         [resp_rate] CHAR(10), 
    //                         [chest_in_drawing] BOOL, 
    //                         [temp] FLOAT(8, 2), 
    //                         [conjuctives] CHAR(10), 
    //                         [eyes] CHAR(10), 
    //                         [dehyderation] CHAR(6), 
    //                         [ears] CHAR(10), 
    //                         [mouth] CHAR(8), 
    //                         [lymph_nodes] CHAR(30), 
    //                         [disability] BOOL, 
    //                         [skin_problems] CHAR(30), 
    //                         [extemities] CHAR(6), 
    //                         [measels] BOOL);`)
    //                 }).then(r=>{
    //                     return knex.raw(`INSERT INTO [main].[tblOtpAdd]([rowid], [otp_id], [otp_id_old], [client_id], [site_id], [site_village], [reg_date], [reg_id], [p_name], [f_or_h_name], [cnic], [address], [cnt_number], [age], [gender], [plw_type], [ent_reason], [ref_type], [oedema], [muac], [diarrhoea], [vomiting], [cough], [appetite], [daily_stool], [pass_urine], [b_Feeding], [weight], [height], [ration1], [quantity1], [ration2], [quantity2], [ration3], [quantity3], [prog_type], [created_at], [updated_at], [upload_status], [username], [org_name], [project_name], [is_deleted], [other_com_name], [other_com_qty], [nsc_old_otp_id], [ref_type_other], [entry_reason_other], [travel_time_minutes], [is_mother_alive], [tehsil_id], [nsc_otp_id], [upload_date], [hh_id], [lhw_code], [lhw_name], [lhw_cnt_number], [resp_rate], [chest_in_drawing], [temp], [conjuctives], [eyes], [dehyderation], [ears], [mouth], [lymph_nodes], [disability], [skin_problems], [extemities], [measels])
    //                     SELECT [rowid], [otp_id], [otp_id_old], [client_id], [site_id], [site_village], [reg_date], [reg_id], [p_name], [f_or_h_name], [cnic], [address], [cnt_number], [age], [gender], [plw_type], [ent_reason], [ref_type], [oedema], [muac], [diarrhoea], [vomiting], [cough], [appetite], [daily_stool], [pass_urine], [b_Feeding], [weight], [height], [ration1], [quantity1], [ration2], [quantity2], [ration3], [quantity3], [prog_type], [created_at], [updated_at], [upload_status], [username], [org_name], [project_name], [is_deleted], [other_com_name], [other_com_qty], [nsc_old_otp_id], [ref_type_other], [entry_reason_other], [travel_time_minutes], [is_mother_alive], [tehsil_id], [nsc_otp_id], [upload_date], [hh_id], [lhw_code], [lhw_name], [lhw_cnt_number], [resp_rate], [chest_in_drawing], [temp], [conjuctives], [eyes], [dehyderation], [ears], [mouth], [lymph_nodes], [disability], [skin_problems], [extemities], [measels]
    //                     FROM [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(` PRAGMA [main].foreign_keys = 'on';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(` 
    //                     PRAGMA [main].legacy_alter_table = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`ALTER TABLE [main].[tblNSC] RENAME TO [_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`CREATE TABLE [main].[tblNSC](
    //                         [nsc_id] INTEGER, 
    //                         [province_id] integer, 
    //                         [tehsil_id] integer, 
    //                         [district_id] integer, 
    //                         [nsc_name] char(50), 
    //                         [created_at] datetime, 
    //                         [updated_at] datetime, 
    //                         [upload_status] INTEGER, 
    //                         [upload_date] datetime, 
    //                         [isActive] INT(1) NOT NULL DEFAULT 1);`)
    //                 }).then(r=>{
    //                     return knex.raw(`INSERT INTO [main].[tblNSC]([rowid], [nsc_id], [province_id], [tehsil_id], [district_id], [nsc_name], [created_at], [updated_at], [upload_status], [upload_date], [isActive])
    //                     SELECT [rowid], [nsc_id], [province_id], [tehsil_id], [district_id], [nsc_name], [created_at], [updated_at], [upload_status], [upload_date], [isActive]
    //                     FROM [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'on';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`ALTER TABLE [main].[tblOutreachInd] RENAME TO [_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(` CREATE TABLE [main].[tblOutreachInd](
    //                         [entry_type] char(20), 
    //                         [uc_id] integer, 
    //                         [sup_code] char(50), 
    //                         [sup_name] char(50), 
    //                         [staff_name] char(50), 
    //                         [staff_code] char(50), 
    //                         [type] char(10), 
    //                         [old_id] char(10), 
    //                         [ent_date] date, 
    //                         [p_name] char(50), 
    //                         [h_or_f_name] char(50), 
    //                         [cnic] char(15), 
    //                         [contact] char(12), 
    //                         [age] FLOAT(8, 2), 
    //                         [address] char(255), 
    //                         [p_type] char(10), 
    //                         [gender] char(10), 
    //                         [muac] FLOAT(8, 2), 
    //                         [p_month] integer, 
    //                         [session_given] char(3), 
    //                         [grp_ind] char(10), 
    //                         [session_type] char(50), 
    //                         [other_session] char(100), 
    //                         [comm1] char(20), 
    //                         [qty1] FLOAT(8, 2), 
    //                         [comm2] char(20), 
    //                         [qty2] FLOAT(8, 2), 
    //                         [referred_to] char(5), 
    //                         [ref_otp] integer, 
    //                         [ref_nsc] integer, 
    //                         [upload_status] integer, 
    //                         [created_at] datetime, 
    //                         [updated_at] datetime, 
    //                         [is_deleted] BOOLEAN, 
    //                         [upload_date] date, 
    //                         [client_id] char(36), 
    //                         [outreach_id] char(36));`)
    //                 }).then(r=>{
    //                     return knex.raw(`INSERT INTO [main].[tblOutreachInd]([rowid], [entry_type], [uc_id], [sup_code], [sup_name], [staff_name], [staff_code], [type], [old_id], [ent_date], [p_name], [h_or_f_name], [cnic], [contact], [age], [address], [p_type], [gender], [muac], [p_month], [session_given], [grp_ind], [session_type], [other_session], [comm1], [qty1], [comm2], [qty2], [referred_to], [ref_otp], [ref_nsc], [upload_status], [created_at], [updated_at], [is_deleted], [upload_date], [client_id], [outreach_id])
    //                     SELECT [rowid], [entry_type], [uc_id], [sup_code], [sup_name], [staff_name], [staff_code], [type], [old_id], [ent_date], [p_name], [h_or_f_name], [cnic], [contact], [age], [address], [p_type], [gender], [muac], [p_month], [session_given], [grp_ind], [session_type], [other_session], [comm1], [qty1], [comm2], [qty2], [referred_to], [ref_otp], [ref_nsc], [upload_status], [created_at], [updated_at], [is_deleted], [upload_date], [client_id], [outreach_id]
    //                     FROM [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`)
    //                 }).then(r=>{
    //                     return knex.raw(` RELEASE [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].foreign_keys = 'on';`)
    //                 }).then(r=>{
    //                     return knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`)
    //                 }).then(r=>{
    //                     return knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`DROP VIEW IF EXISTS [main].[v_outreach_ind];`)
    //                 }).then(r=>{
    //                     return knex.raw(`CREATE VIEW [main].[v_outreach_ind]
    //                     AS
    //                     SELECT 
    //                            [tblOutreachInd].*, 
    //                            [main].[v_geo_uc].[province], 
    //                            [main].[v_geo_uc].[province_id], 
    //                            [main].[v_geo_uc].[district_name], 
    //                            [main].[v_geo_uc].[district_id], 
    //                            [main].[v_geo_uc].[tehsil_name], 
    //                            [main].[v_geo_uc].[tehsil_id], 
    //                            [main].[v_geo_uc].[uc_name]
    //                     FROM   [main].[v_geo_uc]
    //                            INNER JOIN [main].[tblOutreachInd] ON [main].[v_geo_uc].[uc_id] = [main].[tblOutreachInd].[uc_id];`)
    //                 }).then(r=>{
    //                     return knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     return knex.raw(`DROP VIEW IF EXISTS [main].[v_outreach_ind_report];`)
    //                 }).then(r=>{
    //                     return knex.raw(`CREATE VIEW [main].[v_outreach_ind_report]
    //                     AS
    //                     SELECT 
    //                            [v_outreach_ind].*, 
    //                            [main].[v_geo].[site_name], 
    //                            [main].[tblNSC].[nsc_name]
    //                     FROM   [main].[v_outreach_ind]
    //                            LEFT JOIN [main].[v_geo] ON [main].[v_geo].[site_id] = [main].[v_outreach_ind].[ref_otp]
    //                            LEFT JOIN [main].[tblNSC] ON [main].[tblNSC].[nsc_id] = [main].[v_outreach_ind].[ref_nsc];   `)
    //                 }).then(r=>{
    //                     return knex.raw(` RELEASE [sqlite_expert_apply_design_transaction];`)
    //                 }).then(r=>{
    //                     fs.writeFileSync(`${process.env.APPDATA}/nims_aap/.nv`, _version, 'utf8')
    //                     console.log('Db updated')
    //                 }).catch(e=>{
    //                     console.log(e)
    //                 })
                    
    //             }

    //         }
    //     }
    // })



}