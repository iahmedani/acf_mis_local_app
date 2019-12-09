module.exports = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: `${process.env.APPDATA}/nims_aap/acf_mis_local.sqlite3`
    },
    useNullAsDefault: true
})