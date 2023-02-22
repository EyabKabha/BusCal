import vest, { validate, test, enforce } from 'vest';
// var CryptoJS = require("crypto-js");

var date = new Date(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();

if (month.length < 2)
    month = '0' + month;
if (day.length < 2)
    day = '0' + day;

const finalDate = [year, month, day].join('-');

//Export a function that takes the data, and an optional changed field name
const validateFormEmployee = (data = {}, changedField) => validate('pledge', () => {
    // When called, `only()` filters out any test calls that aren't specified in it.
    // If no field is passed to only (when submitting, for example), it will be ignored.
    vest.only(changedField);
    /**
     * test arguments:
     * 1. fieldName: same name can be used in multiple tests
     * 2. String to show on failure
     * 3. Callback that contains our assertions
     */

    test('first_name', 'שדה חובה', () => {

        // enforce takes a value
        // and checks that it matches our requirements
        enforce(data.first_name)
            .isNotEmpty()
            .matches(NAME_REGEX);
    });

    test('last_name', 'שדה חובה.', () => {
        enforce(data.last_name)
            .isNotEmpty()
            .matches(NAME_REGEX);
    });

    test('identity', 'המספר שהזנת קצר מדי. יש להזין מספר זהות בן 9 ספרות.', () => {
        enforce(data.identity)
            .matches(IDENTITY_REGEX)
        // .isNotEmpty().shorterThan(11);
        // enforce(data.username).isString().longerThan(1)
    });

    test('phone', 'מספר אינו חוקי.', () => {
        enforce(data.phone)
            .matches(PHONE_REGEX)
        // .isNotEmpty().shorterThan(11)
        // .isString().longerThan(1)
    });

    test('email', 'חייב להיות כתובת דואר אלקטרוני חוקית.', () => {
        enforce(data.email)
            .matches(EMAIL_REGEX);
    });

    test('password', 'הסיסמה חייבת להכיל מינימום שמונה תווים, שילוב של אותיות ומספרים ', () => {
        enforce(data.password).isNotEmpty().matches(PASSWORD_REGEX);

    });

    test('confirmPassword', 'סיסמה לא תואמות', () => {
        enforce(data.confirmPassword)
            .equals(data.password).isNotEmpty()
    });

    test('postal_code', 'מיקוד צריך להיות 5-7 ספרות', () => {
        if (data.postal_code) {
            enforce(data.postal_code)
                .matches(POSTAL_CODE_REGEX)
        }
    });

    test('street', 'שדה חובה', () => {
        if (data.street) {
            enforce(data.street)
                .matches(STREET_REGEX)
        }
    });

    test('city', 'שדה חובה', () => {
        enforce(data.city)
            .isNotEmpty();
    });

    test('role_id', 'אנא בחר תפקיד', () => {
        enforce(data.role_id)
            .isNotEmpty();
    });

    test('item', 'אנא בחר לפחות 3 קבצים', () => {
        enforce(data.item)
            .isNotEmpty().longerThanOrEquals(3);
    })
});

const validateCode = (data = {}, changedFieldEmployee, codeResetValid, passOrNot) => validate('codeResetPasswrod', () => {
    var dataCode = codeResetValid
    vest.only(changedFieldEmployee);

    test('email', 'חייב להיות כתובת דואר אלקטרוני חוקית.', () => {
        enforce(data.email)
            .matches(EMAIL_REGEX);

    });

    if (passOrNot) {

        test('password', 'הסיסמה חייבת להכיל מינימום שמונה תווים, שילוב של אותיות ומספרים ', () => {
            enforce(data.password).isNotEmpty().matches(PASSWORD_REGEX);

        });

        test('confirmPassword', 'סיסמה לא תואמות', () => {
            enforce(data.confirmPassword)
                .equals(data.password).isNotEmpty();
        });

        test('codeInput', 'קוד אינו תואם', () => {
            enforce(data.codeInput)
                .equals(dataCode).isNotEmpty();
        });

    }

});

const validateBid = (data = {}, changedFieldBid, checkedStation) => validate('bidOrder', () => {



    vest.only(changedFieldBid);
    test('start_date', 'אנא הזן תאריך חוקי.', () => {
        enforce(data.start_date)
        return data.start_date >= finalDate
        // .isNotEmpty().equals(finalDate)
    });

    test('end_date', 'אנא הזן תאריך חוקי.', () => {
        enforce(data.end_date)
        return (data.end_date >= finalDate && data.end_date >= data.start_date)
    });

    test('start_hour', 'אנא הזן שעת התחלה.', () => {
        enforce(data.start_hour).isNotEmpty()
    })

    test('end_hour', 'אנא הזן שעת חזרה.', () => {
        enforce(data.end_hour).isNotEmpty()
    })

    test('start_point', 'שדה חובה', () => {
        enforce(data.start_point)
            .isNotEmpty();
    });


    test('destination', 'שדה חובה', () => {
        enforce(data.destination)
            .isNotEmpty();
    });

    test('vehicle_id', 'אנא בחר סוג רכב', () => {
        enforce(data.vehicle_id)
            .isNotEmpty();
    });

    test('trip_id', 'אנא בחר סוג נסיעה', () => {
        enforce(data.trip_id)
            .isNotEmpty();
    });

    if (data.stopStation && data.checked) {
        test('stopStation', 'השדה חייב להכיל אותיות עברית או אנגלית בלבד.', () => {
            enforce(data.stopStation)
                .matches(REGEX_HEBREW_ENGLISH)
        });
    }
});

const validateSettingAdminTrip = (data = {}, changedFieldTrip) => validate('bidOrder', () => {

    vest.only(changedFieldTrip);

    test('tripValue', 'השדה חייב להכיל אותיות עברית או אנגלית בלבד.', () => {
        enforce(data.tripValue)
            .matches(REGEX_HEBREW_ENGLISH).isNotEmpty();
    });

})

const validateSettingAdminVehicle = (data = {}, changedFieldVehicle) => validate('bidOrder', () => {

    vest.only(changedFieldVehicle);

    test('vehicleType', 'השדה חייב להכיל אותיות עברית או אנגלית בלבד.', () => {
        enforce(data.vehicleType)
            .matches(REGEX_HEBREW_ENGLISH).isNotEmpty();
    });
    test('capacity', 'השדה חייב להכיל מספרים בלבד.', () => {
        enforce(data.capacity)
            .matches(CAPACITY_REGEX).isNotEmpty();
    });
})

const validateBidBus = (data = {}, changedFieldBidBus) => validate('bidOrder', () => {




    vest.only(changedFieldBidBus);
    test('start_date', 'אנא הזן תאריך חוקי.', () => {
        enforce(data.start_date)

        return data.start_date >= finalDate
        // .isNotEmpty().equals(finalDate)

    });

    test('end_date', 'אנא הזן תאריך חוקי.', () => {

        enforce(data.end_date)
        return (data.end_date >= finalDate && data.end_date >= data.start_date)
    });

    test('start_hour', 'אנא הזן שעת התחלה.', () => {
        enforce(data.start_hour).isNotEmpty()

    })

    test('end_hour', 'אנא הזן שעת חזרה.', () => {
        enforce(data.end_hour).isNotEmpty()

    })

    test('vehicle_id', 'אנא בחר סוג רכב', () => {
        enforce(data.vehicle_id)
            .isNotEmpty();
    });

});

const validateFormEmployeeCompany = (data = {}, changedField, confirmPassword) => validate('pledge', () => {
    // When called, `only()` filters out any test calls that aren't specified in it.
    // If no field is passed to only (when submitting, for example), it will be ignored.
    vest.only(changedField);

    test('first_name', 'שדה חובה', () => {
        enforce(data.first_name)
            .isNotEmpty();
    });

    test('last_name', 'שדה חובה.', () => {
        enforce(data.last_name)
            .isNotEmpty();
    });

    test('phone', 'מספר אינו חוקי.', () => {
        enforce(data.phone)
            .matches(PHONE_REGEX)
    });

    test('email', 'חייב להיות כתובת דואר אלקטרוני חוקית.', () => {
        enforce(data.email)
            .matches(EMAIL_REGEX);
    });

    test('password', 'הסיסמה חייבת להכיל מינימום שמונה תווים, שילוב של אותיות ומספרים ', () => {
        enforce(data.password).isNotEmpty().matches(PASSWORD_REGEX);

    });

    test('confirmPassword', 'סיסמה לא תואמות', () => {
        enforce(data.confirmPassword)
            .equals(data.password).isNotEmpty();
    });

    test('city', 'שדה חובה', () => {
        enforce(data.city)
            .isNotEmpty();
    });

});

const validateFormSignUpOrEditInfo = (data = {}, changedField, dataCodePhone) => validate('pledge', () => {
    // When called, `only()` filters out any test calls that aren't specified in it.
    // If no field is passed to only (when submitting, for example), it will be ignored.
    vest.only(changedField);
    test('first_name', 'שדה חובה', () => {
        enforce(data.first_name)
            .isNotEmpty();
    });
    test('first_name', 'שם לא חוקי', () => {
        enforce(data.first_name)
            .matches(NAME_REGEX);
    });

    test('last_name', 'שדה חובה.', () => {
        enforce(data.last_name)
            .isNotEmpty();
    });

    test('last_name', 'שדה חובה.', () => {
        enforce(data.last_name)
            .matches(NAME_REGEX);
    });

    test('phone', 'מספר אינו חוקי.', () => {
        enforce(data.phone)
            .matches(PHONE_REGEX)
    });

    test('email', 'חייב להיות כתובת דואר אלקטרוני חוקית.', () => {
        enforce(data.email)
            .matches(EMAIL_REGEX);
    });

    test('password', 'הסיסמה חייבת להכיל מינימום שמונה תווים, שילוב של אותיות ומספרים ', () => {
        enforce(data.password).isNotEmpty().longerThan(5).matches(PASSWORD_REGEX);

    });

    test('confirmPassword', 'סיסמה לא תואמות', () => {
        enforce(data.confirmPassword)
            .equals(data.password).isNotEmpty();
    });

    test('city', 'שדה חובה', () => {
        enforce(data.city)
            .isNotEmpty();
    });

    test('fax', 'חייב להכיל 9 מספרים', () => {
        if (data.fax) {
            enforce(data.fax)
                .matches(FAX_REGEX);
        }
    });

    test('postal_code', 'חייב להכיל מספרים', () => {
        if (data.postal_code) {
            enforce(data.postal_code)
                .matches(POSTAL_CODE_REGEX);
        }
    });

    test('street', 'השדה חייב להכיל אותיות עברית או אנגלית בלבד.', () => {
        if (data.street) {
            enforce(data.street)
                .matches(REGEX_HEBREW_ENGLISH);
        }
    });

    test('type', 'שדה חובה', () => {
        enforce(data.type)
            .isNotEmpty();
    });
    if (data.type === 'חברה') {
        test('companyname', 'שדה חובה וחייב להכיל אותיות בעברית או אנגלית', () => {
            enforce(data.companyname)
                .isNotEmpty()
                .matches(REGEX_HEBREW_ENGLISH);
        });
        test('companyphone', 'מספר אינו חוקי.', () => {

            enforce(data.companyphone)
                .isNotEmpty()
                .matches(PHONE_REGEX)
        });
        test('company_t_phone', 'מספר אינו חוקי.', () => {
            enforce(data.company_t_phone)
                .isNotEmpty()
                .matches(T_PHONE_REGEX)
        });
        test('companyemail', 'חייב להיות כתובת דואר אלקטרוני חוקית.', () => {
            enforce(data.companyemail)
                .isNotEmpty()
                .matches(EMAIL_REGEX);
        });
        test('code', 'שדה חובה', () => {
            enforce(data.code)
                .isNotEmpty()
                .matches(IDENTITY_REGEX)
        });
        test('companyfax', 'חייב להכיל 9 מספרים', () => {
            enforce(data.companyfax)
                .isNotEmpty()
                .matches(FAX_REGEX);
        });
        test('companycity', 'שדה חובה', () => {
            enforce(data.companycity)
                .isNotEmpty();
        });
        test('companystreet', 'השדה חייב להכיל אותיות עברית או אנגלית בלבד.', () => {
            if (data.companystreet) {
                enforce(data.companystreet)
                    .isNotEmpty()
                    .matches(REGEX_HEBREW_ENGLISH);
            }

        });
        test('company_postal_code', 'חייב להכיל רק מספרים', () => {
            if (data.company_postal_code) {
                enforce(data.company_postal_code)
                    .isNotEmpty()
                    .matches(POSTAL_CODE_REGEX)
            }
        });
        test('file1', 'אנא בחר קובץ', () => {
            enforce(data.file1.name)
                .isNotEmpty();
        })
        test('file2', 'אנא בחר קובץ', () => {
            enforce(data.file2.name)
                .isNotEmpty();
        })
        test('file3', 'אנא בחר קובץ', () => {
            enforce(data.file3.name)
                .isNotEmpty();
        })
        test('validateCodePhone', 'קוד אימות אינו תואם', () => {
            enforce(data.validateCodePhone)
                .equals(dataCodePhone.toString()).isNotEmpty();
        })
    }

});

const validateFormClosedOrdersByCompany = (data = {}, changedField, idOrder, idOrderBusEncrypt) => validate('pledge', () => {
    vest.only(changedField);
    test('price', 'שדה חובה', () => {
        enforce(data.price)
            .isNotEmpty()
           
    });
    test('price', 'שדה חייב להכיל רק מספרים', () => {
        enforce(data.price)
            .matches(ISNUMBER_REGEX);
    });

    test('serial_number', 'מספר הזמנה אינו תואם', () => {
        enforce(data.serial_number)
            .equals(idOrder).isNotEmpty();
    });

    test('serial_number_Bus', 'מספר הזמנה אינו תואם', () => {
        enforce(data.serial_number_Bus)
            .equals(idOrderBusEncrypt);
    });


})
const validateFormFilterOrder = (data = {}, changedField) => validate('pledge', () => {
    vest.only(changedField);
    if (data.startdate) {
        test('startdate', 'אנא הזן תאריך חוקי.', () => {
            enforce(data.startdate)
            return data.startdate >= finalDate
        });
    }
    if (data.enddate) {
        test('enddate', 'אנא הזן תאריך חוקי.', () => {
            enforce(data.enddate)
            if (data.start_date)
                return (data.enddate >= finalDate && data.enddate >= data.start_date)
            return (data.enddate >= finalDate)
        });
    }
})

const validateLoginCustomerAndAdmin = (data = {}, changedField, password) => validate('pledge', () => {
    vest.only(changedField);

    test('email', 'חייב להיות כתובת דואר אלקטרוני חוקית.', () => {
        enforce(data.email)
            .matches(EMAIL_REGEX);
    });


    // test('password', 'עליך להזין לפחות 8 תווים בשדה סיסמה.', () => {
    //     enforce(data.password).longerThan(6);
    // });

})
// Copied from https://emailregex.com/
const NAME_REGEX = /^[a-zA-Z\u0590-\u05fe ']{2,30}$/;
const STREET_REGEX = /^[a-zA-Z\u0590-\u05fe']+[ 0-9]*$/;
const EMAIL_REGEX = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^[0][5][0|2|3|4|5|8|9]{1}[-]{0,1}[0-9]{7}$/;
const FAX_REGEX = /^[0][0-9]{8}$/;
const POSTAL_CODE_REGEX = /^[0-9]{5,7}$/;
const IDENTITY_REGEX = /^[0-9]{9}$/;
const CAPACITY_REGEX = /^[1-9][0-9]{0,2}$/
const REGEX_HEBREW_ENGLISH = /^[a-z\u0590-\u05fe ]+[a-z\u0590-\u05fe0-9 '"]*$/; 
const ISNUMBER_REGEX = /^[0-9]{2,10}$/;
const T_PHONE_REGEX = /^[0]{1}[0-9]{6,9}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

export {
    validateCode,
    validateFormEmployee,
    validateBid,
    validateSettingAdminTrip,
    validateSettingAdminVehicle,
    validateBidBus,
    validateFormEmployeeCompany,
    validateFormSignUpOrEditInfo,
    validateFormClosedOrdersByCompany,
    validateFormFilterOrder,
    validateLoginCustomerAndAdmin
};