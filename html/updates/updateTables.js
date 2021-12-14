const knex = require('../../mainfunc/db');

const updateOtpAddExitDetails = async () =>  {
    try {
        var exists = await knex.schema.hasColumn('tblOtpAdd', 'exit_date')
        if (!exists) {
            Swal.fire({
                title: 'Please wait',
                html: `<div class="d-flex justify-content-center">
                 <div>
                 <p>We are updating database
                  Total Updates: <span id="totals"></span> - <span id='done'></span> = <span id='remaing'></span></p>
                </div>
              </div>`,
                showCloseButton: false
            })
            await knex.raw(`PRAGMA [main].legacy_alter_table = 'on';`)
            await knex.raw(`PRAGMA [main].foreign_keys = 'off';`)
            await knex.raw(`SAVEPOINT [sqlite_expert_apply_design_transaction];`)
            await knex.raw(`ALTER TABLE [main].[tblOtpAdd] RENAME TO [_sqliteexpert_temp_table_1];`)
            await knex.raw(`CREATE TABLE [main].[tblOtpAdd](
                [otp_id] char(36), 
                [otp_id_old] integer, 
                [client_id] varchar(255), 
                [site_id] integer, 
                [site_village] varchar(255), 
                [reg_date] date, 
                [reg_id] varchar(255), 
                [p_name] varchar(255), 
                [f_or_h_name] varchar(255), 
                [cnic] VARCHAR(255), 
                [address] varchar(255), 
                [cnt_number] varchar(255), 
                [age] integer, 
                [gender] varchar(255), 
                [plw_type] varchar(255), 
                [ent_reason] varchar(255), 
                [ref_type] varchar(255), 
                [oedema] varchar(255), 
                [muac] FLOAT, 
                [diarrhoea] boolean, 
                [vomiting] boolean, 
                [cough] boolean, 
                [appetite] varchar(255), 
                [daily_stool] varchar(255), 
                [pass_urine] boolean, 
                [b_Feeding] boolean, 
                [weight] FLOAT, 
                [height] FLOAT, 
                [ration1] varchar(255), 
                [quantity1] integer, 
                [ration2] varchar(255), 
                [quantity2] integer, 
                [ration3] varchar(255), 
                [quantity3] integer, 
                [prog_type] varchar(255), 
                [created_at] datetime, 
                [updated_at] datetime, 
                [upload_status] INTEGER DEFAULT 0, 
                [username] VARCHAR(50), 
                [org_name] VARCHAR(50), 
                [project_name] VARCHAR(50), 
                [is_deleted] BOOLEAN NOT NULL DEFAULT 0, 
                [other_com_name] VARCHAR(20), 
                [other_com_qty] FLOAT, 
                [nsc_old_otp_id] VARCHAR DEFAULT 0, 
                [ref_type_other] VARCHAR, 
                [entry_reason_other] VARCHAR, 
                [travel_time_minutes] INTEGER NOT NULL DEFAULT 0, 
                [is_mother_alive] VARCHAR(3) NOT NULL DEFAULT Yes, 
                [tehsil_id] INTEGER, 
                [nsc_otp_id] VARCHAR, 
                [upload_date] DATE, 
                [hh_id] VARCHAR(20), 
                [lhw_code] CHAR(20), 
                [lhw_name] CHAR(50), 
                [lhw_cnt_number] CHAR(15), 
                [resp_rate] CHAR(10), 
                [chest_in_drawing] BOOL, 
                [temp] FLOAT(8, 2), 
                [conjuctives] CHAR(10), 
                [eyes] CHAR(10), 
                [dehyderation] CHAR(6), 
                [ears] CHAR(10), 
                [mouth] CHAR(8), 
                [lymph_nodes] CHAR(30), 
                [disability] BOOL, 
                [skin_problems] CHAR(30), 
                [extemities] CHAR(6), 
                [measels] BOOL, 
                [exit_date] DATE, 
                [exit_reason] CHAR(50), 
                [total_days] INTEGER, 
                [total_followups] INTEGER);`)
            await knex.raw(`INSERT INTO [main].[tblOtpAdd]([rowid], [otp_id], [otp_id_old], [client_id], [site_id], [site_village], [reg_date], [reg_id], [p_name], [f_or_h_name], [cnic], [address], [cnt_number], [age], [gender], [plw_type], [ent_reason], [ref_type], [oedema], [muac], [diarrhoea], [vomiting], [cough], [appetite], [daily_stool], [pass_urine], [b_Feeding], [weight], [height], [ration1], [quantity1], [ration2], [quantity2], [ration3], [quantity3], [prog_type], [created_at], [updated_at], [upload_status], [username], [org_name], [project_name], [is_deleted], [other_com_name], [other_com_qty], [nsc_old_otp_id], [ref_type_other], [entry_reason_other], [travel_time_minutes], [is_mother_alive], [tehsil_id], [nsc_otp_id], [upload_date], [hh_id], [lhw_code], [lhw_name], [lhw_cnt_number], [resp_rate], [chest_in_drawing], [temp], [conjuctives], [eyes], [dehyderation], [ears], [mouth], [lymph_nodes], [disability], [skin_problems], [extemities], [measels])
            SELECT [rowid], [otp_id], [otp_id_old], [client_id], [site_id], [site_village], [reg_date], [reg_id], [p_name], [f_or_h_name], [cnic], [address], [cnt_number], [age], [gender], [plw_type], [ent_reason], [ref_type], [oedema], [muac], [diarrhoea], [vomiting], [cough], [appetite], [daily_stool], [pass_urine], [b_Feeding], [weight], [height], [ration1], [quantity1], [ration2], [quantity2], [ration3], [quantity3], [prog_type], [created_at], [updated_at], [upload_status], [username], [org_name], [project_name], [is_deleted], [other_com_name], [other_com_qty], [nsc_old_otp_id], [ref_type_other], [entry_reason_other], [travel_time_minutes], [is_mother_alive], [tehsil_id], [nsc_otp_id], [upload_date], [hh_id], [lhw_code], [lhw_name], [lhw_cnt_number], [resp_rate], [chest_in_drawing], [temp], [conjuctives], [eyes], [dehyderation], [ears], [mouth], [lymph_nodes], [disability], [skin_problems], [extemities], [measels]
            FROM [main].[_sqliteexpert_temp_table_1];`)
            await knex.raw(`DROP TABLE IF EXISTS [main].[_sqliteexpert_temp_table_1];`)
            await knex.raw(`RELEASE [sqlite_expert_apply_design_transaction];`)
            await knex.raw(`PRAGMA [main].foreign_keys = 'on';`)
            await knex.raw(`PRAGMA [main].legacy_alter_table = 'off';`)

            var totalAdds = await knex.select('otp_id').from('tblOtpAdd').where({ is_deleted: 0 });
            var __count = 0
            var tAds = totalAdds.length;
            $('#totals').text(tAds)
            doneel = $('#done')
            remel = $('#remaing')
            for (add of totalAdds) {
                console.log(add)
                var _exits = await knex('tblOtpExit').where({ is_deleted: 0, otp_id: add['otp_id'] })
                __count++
                if (_exits.length) {                    
                    var _total_followups = await knex('tblOtpFollowup').count('* as total_followups').where({ is_deleted: 0, otp_id: add['otp_id'] })
                    await knex('tblOtpAdd').update({ total_followups: _total_followups[0]['total_followups'], exit_date: _exits[0]['exit_date'], exit_reason: _exits[0]['exit_reason'], total_days: _exits[0]['total_days'], upload_status: 2 }).where({otp_id: add['otp_id']})
                    // console.log( {_total_followups}, {_exits})
                } else {
                    console.log('not exit yet')
                }
                doneel.text(__count)
                __rem = tAds - __count;
                remel.text(__rem)
            }
            Swal.close();
        } else {
            console.log('No need to update tblOtpAdd Table')
        }
    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: JSON.stringify(error),
            // footer: '<a href="">Why do I have this issue?</a>'
          })
    }
    
}

module.exports = updateOtpAddExitDetails
