
const sqlite3 = require('sqlite3').verbose();
let fs = require('fs')
fs.mkdir('./database/modules/inventory management/s/inventory/rack/rack', { recursive: true }, () => {
    const db = new sqlite3.Database('./database/modules/inventory management/s/inventory/rack/rack/rack.db');

// Create the table with columns of different data types
db.serialize(() => {
    db.run(`  
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY, name TEXT, adress TEXT, capacity INTEGER, isAvailable INTEGER, weight INTEGER, width INTEGER, height INTEGER, length INTEGER, manufacturer TEXT, serialNumber TEXT, purchaseDate TEXT, purchasePrice INTEGER, powerPorts INTEGER, dataPorts INTEGER, fans INTEGER, hasCooling INTEGER, rackType TEXT, manufacturerContact TEXT, notes TEXT, warrantyExpires TEXT, lastServiceDate TEXT, nextServiceDate TEXT, serviceContact TEXT, barcode TEXT, assetTag TEXT, createdAt TEXT, updatedAt TEXT
    )
  `);
});

let getDateTimeStamp = () => {
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const day = currentDate.getDate();
    const month = monthsOfYear[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const millisecond = currentDate.getMilliseconds();

    const formattedDate = `${ dayOfWeek }-${ day }-${ month }-${ year } at ${ hour }:${ minute }:${ second }:${ millisecond }`;

    return formattedDate;
};

let check_values = async (input_data) => {
    let model = JSON.parse(`{"name":{"key":"name","type":"string","required":false,"default":null},"adress":{"key":"adress","type":"string","required":false,"default":null},"capacity":{"key":"capacity","type":"number","required":false,"default":null},"isAvailable":{"key":"isAvailable","type":"boolean","required":false,"default":null},"weight":{"key":"weight","type":"number","required":false,"default":null},"width":{"key":"width","type":"number","required":false,"default":null},"height":{"key":"height","type":"number","required":false,"default":null},"length":{"key":"length","type":"number","required":false,"default":null},"manufacturer":{"key":"manufacturer","type":"string","required":false,"default":null},"serialNumber":{"key":"serialNumber","type":"string","required":false,"default":null},"purchaseDate":{"key":"purchaseDate","type":"date","required":false,"default":null},"purchasePrice":{"key":"purchasePrice","type":"number","required":false,"default":null},"powerPorts":{"key":"powerPorts","type":"number","required":false,"default":null},"dataPorts":{"key":"dataPorts","type":"number","required":false,"default":null},"fans":{"key":"fans","type":"number","required":false,"default":null},"hasCooling":{"key":"hasCooling","type":"boolean","required":false,"default":null},"rackType":{"key":"rackType","type":"string","required":false,"default":null},"manufacturerContact":{"key":"manufacturerContact","type":"string","required":false,"default":null},"notes":{"key":"notes","type":"string","required":false,"default":null},"warrantyExpires":{"key":"warrantyExpires","type":"date","required":false,"default":null},"lastServiceDate":{"key":"lastServiceDate","type":"date","required":false,"default":null},"nextServiceDate":{"key":"nextServiceDate","type":"date","required":false,"default":null},"serviceContact":{"key":"serviceContact","type":"date","required":false,"default":null},"barcode":{"key":"barcode","type":"string","required":false,"default":null},"assetTag":{"key":"assetTag","type":"string","required":false,"default":null},"createdAt":{"key":"createdAt","type":"string","required":false,"default":null},"updatedAt":{"key":"updatedAt","type":"string","required":false,"default":null}}`);
//let model = [object Object];
 return new Promise((resolve, reject) => {
        let input_data_keys = Object.keys(input_data);
        let input_data_out = {};

        for (let index = 0; index < input_data_keys.length; index++) {
            const key = input_data_keys[index];
            const value = input_data[key];

            let model_field = model[key];
            if (model_field) {
                if (!value) {
                    if (model_field.required && !model_field.default_value) {
                        resolve(`${ key } must not be empty`);
                    } else if (model_field.default_value) {
                        value = model_field.default_value
                    }
                }
                const valueType = typeof value;
                const typeString = model_field.type.toString();

                if (valueType != typeString) {
                    resolve(`${ key } should be of type '${typeString}'`);
                } else {
                    input_data_out[key] = value;
                }
            }
            }
            resolve(input_data_out)
        

    });
}


// Get all records
exports.getAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM records', (err, rows) => {
            if (err) {
                console.error('Error retrieving records:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else {
                resolve({ completed: true, data: rows });
            }
        });
    });
}

// Get a single record by ID
exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM records WHERE id = ?', id, (err, row) => {
            if (err) {
                console.error('Error retrieving record:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else if (!row) {
                resolve({ completed: false, error: 'Data not found' });
            } else {
                resolve({ completed: true, data: row });
            }
        });
    });
}

// Get a single record by condition
exports.getByCondition = (condition) => {
    let searchKey = Object.keys(condition)[0];
    let params = condition[searchKey];
    params = typeof(params) == 'string'?params.split(','):params;
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM records WHERE ${ searchKey } = ?`;
        db.get(query, params, (err, row) => {
            if (err) {
                console.error('Error retrieving record:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else if (!row) {
                resolve({ completed: false, error: 'Data not found' });
            } else {
                resolve({ completed: true, data: row });
            }
        });
    });
}
 
// Get records by condition
exports.getAllByCondition = (condition) => {
    let searchKey = Object.keys(condition)[0];
    let params = condition[searchKey];
    params = typeof(params) == 'string'?params.split(','):params;

    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM records WHERE ${ condition } = ?`;
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('Error retrieving records:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else {
                resolve({ completed: true, data: rows });
            }
        });
    });
};


// Create a new record
exports.create = async (data) => {
    data.createdAt = getDateTimeStamp();
    data.updatedAt = getDateTimeStamp();
   // console.log(data)
      let is_valid_inputs = await check_values(data);
    if (!typeof (is_valid_inputs) == 'object') {
        return is_valid_inputs;
    }
    return new Promise((resolve, reject) => {
        const { name, adress, capacity, isAvailable, weight, width, height, length, manufacturer, serialNumber, purchaseDate, purchasePrice, powerPorts, dataPorts, fans, hasCooling, rackType, manufacturerContact, notes, warrantyExpires, lastServiceDate, nextServiceDate, serviceContact, barcode, assetTag, createdAt, updatedAt } = data;

        db.run(
            'INSERT INTO records (name, adress, capacity, isAvailable, weight, width, height, length, manufacturer, serialNumber, purchaseDate, purchasePrice, powerPorts, dataPorts, fans, hasCooling, rackType, manufacturerContact, notes, warrantyExpires, lastServiceDate, nextServiceDate, serviceContact, barcode, assetTag, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            data.name, data.adress, data.capacity, data.isAvailable, data.weight, data.width, data.height, data.length, data.manufacturer, data.serialNumber, data.purchaseDate, data.purchasePrice, data.powerPorts, data.dataPorts, data.fans, data.hasCooling, data.rackType, data.manufacturerContact, data.notes, data.warrantyExpires, data.lastServiceDate, data.nextServiceDate, data.serviceContact, data.barcode, data.assetTag, data.createdAt, data.updatedAt,
            function (err) {
                if (err) {
                    console.error('Error creating record:', err);
                    resolve({ completed: false, error: 'Internal Server Error' });
                } else {
                    resolve({ completed: true, data: { id: this.lastID, name, adress, capacity, isAvailable, weight, width, height, length, manufacturer, serialNumber, purchaseDate, purchasePrice, powerPorts, dataPorts, fans, hasCooling, rackType, manufacturerContact, notes, warrantyExpires, lastServiceDate, nextServiceDate, serviceContact, barcode, assetTag, createdAt, updatedAt } });
                }
            }
        );
    });
}

// Update a record
exports.update = (id, data) => {
  
    data.updatedAt = getDateTimeStamp();
    return new Promise((resolve, reject) => {
        const { name, adress, capacity, isAvailable, weight, width, height, length, manufacturer, serialNumber, purchaseDate, purchasePrice, powerPorts, dataPorts, fans, hasCooling, rackType, manufacturerContact, notes, warrantyExpires, lastServiceDate, nextServiceDate, serviceContact, barcode, assetTag, createdAt, updatedAt } = data;

        db.run(
            'UPDATE records SET name = ?, adress = ?, capacity = ?, isAvailable = ?, weight = ?, width = ?, height = ?, length = ?, manufacturer = ?, serialNumber = ?, purchaseDate = ?, purchasePrice = ?, powerPorts = ?, dataPorts = ?, fans = ?, hasCooling = ?, rackType = ?, manufacturerContact = ?, notes = ?, warrantyExpires = ?, lastServiceDate = ?, nextServiceDate = ?, serviceContact = ?, barcode = ?, assetTag = ?, createdAt = ?, updatedAt = ? WHERE id = ?',
            [data.name, data.adress, data.capacity, data.isAvailable, data.weight, data.width, data.height, data.length, data.manufacturer, data.serialNumber, data.purchaseDate, data.purchasePrice, data.powerPorts, data.dataPorts, data.fans, data.hasCooling, data.rackType, data.manufacturerContact, data.notes, data.warrantyExpires, data.lastServiceDate, data.nextServiceDate, data.serviceContact, data.barcode, data.assetTag, data.createdAt, data.updatedAt, id],
            (err) => {
                if (err) {
                    console.error('Error updating record:', err);
                    resolve({ completed: false, error: 'Internal Server Error' });
                } else {
                    resolve({ completed: true });
                }
            }
        );
    });
}

// Delete a record
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM records WHERE id = ?', id, (err) => {
            if (err) {
                console.error('Error deleting record:', err);
                resolve({ completed: false, error: 'Internal Server Error' });
            } else {
                resolve({ completed: true });
            }
        });
    });
}


// Delete all records
exports.deleteAll = () => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM records', (err) => {
            if (err) {
                console.error('Error deleting all records:', err);
                resolve({ completed: false, error: 'Internal Server Error' });
            } else {
                resolve({ completed: true });
            }
        });
    });
}
 })