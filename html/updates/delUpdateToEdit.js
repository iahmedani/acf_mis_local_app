const knex = require('../../mainfunc/db');

// window.sessionStorage.setItem('UpdatedTables', '{}');

async function updateDeledtedEdit(tableName) {
    
    try {
        await knex(tableName).update({ upload_status:2 }).where({ is_deleted: 1 })
        // return JSON.stringify({tblName:tableName, updated:true})
    } catch (error) {
        console.log(error)
    }
    
}

const updateDeletedToEditValue = async function () {
    // const UpdatedTables = JSON.parse(window.sessionStorage.getItem('UpdateTables'));
   
        // update deleted admisions
        knex.schema.hasTable('tbldeleteUpdates').then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('tbldeleteUpdates', function (t) {
                    t.increments('id').primary();
                    t.string('table', 100);
                    t.integer('value', 2);
                });
            }
        })
        
        const exists = await knex.schema.hasTable('tbldeleteUpdates')
        if (exists) {
            try {
                var UpdatedTables = await knex('tbldeleteUpdates');
                console.log({ UpdatedTables })
                console.log(`condition for tblOtpAdd ${UpdatedTables.filter(x => x.table == 'tblOtpAdd')}`)
                if ( UpdatedTables.length == 0 || UpdatedTables.filter(x => x.table == 'tblOtpAdd').length == 0) {
                    await updateDeledtedEdit('tblOtpAdd');
                    await knex('tbldeleteUpdates').insert({ table: 'tblOtpAdd', value: 1 })
                    // console.log('tblOtpAdd updated')
                }
                if ( UpdatedTables.length == 0 ||  UpdatedTables.filter(x => x.table == 'tblOtpFollowup').length ==0) {
                    await updateDeledtedEdit('tblOtpFollowup');
                    await knex('tbldeleteUpdates').insert({table:'tblOtpFollowup', value:1})
                }
                if ( UpdatedTables.length == 0 ||  UpdatedTables.filter(x => x.table == 'tblOtpExit').length ==0) {
                    await updateDeledtedEdit('tblOtpExit');
                    await knex('tbldeleteUpdates').insert({table:'tblOtpExit', value:1})
                }
                if ( UpdatedTables.length == 0 ||  UpdatedTables.filter(x => x.table == 'tblSiteStock').length ==0) {
                    await updateDeledtedEdit('tblSiteStock');
                    await knex('tbldeleteUpdates').insert({table:'tblSiteStock', value:1})
                }
                if ( UpdatedTables.length == 0 || UpdatedTables.filter(x => x.table == 'tblStokDistv2').length ==0) {
                    await updateDeledtedEdit('tblStokDistv2');
                    await knex('tbldeleteUpdates').insert({table:'tblStokDistv2', value:1})
                }
                if ( UpdatedTables.length == 0 || UpdatedTables.filter(x => x.table == 'tblScrChildren').length ==0) {
                    await updateDeledtedEdit('tblScrChildren');
                    await knex('tbldeleteUpdates').insert({table:'tblScrChildren', value:1})
                }
                if ( UpdatedTables.length == 0 || UpdatedTables.filter(x => x.table == 'tblScrPlw').length ==0) {
                    await updateDeledtedEdit('tblScrPlw');
                    await knex('tbldeleteUpdates').insert({table:'tblScrPlw', value:1})
                }
                

                } catch (error) {
                console.log('Table updated deleting issue')
                }
        }

    
}

// updateDeledtedEdit();
// updateDeletedToEditValue();
module.exports = updateDeletedToEditValue