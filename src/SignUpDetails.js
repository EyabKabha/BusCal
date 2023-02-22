import React from 'react';
import { Redirect } from 'react-router-dom';
import { CompanyContext } from './CompanyContext';
import './assets/style.css';
import { getUser } from './api/auth';
import Table from './shared/Table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Form } from 'react-bootstrap';
import fetcher from './api/fetcher';
import { AddDepModal } from './Company/AddDepModal';
import PopUp from './shared/PopUp';
import Swal from 'sweetalert2'
import { validateFormSignUpOrEditInfo } from './shared/validation';
import ValidateEmail from './shared/ValidateEmail';

class SignUpDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            isAdmin: false,
            isUsersFromAdmin: false,
            dataUpdateTemp: false,
            isCustomer: false,
            isSales: false,
            isSupport: false,
            isOpen: false,
            addModalShow: false,
            isCompany: false,
            addModalShowEmailValidate: false,
            editCustomer: false,
            showLabelCompany: true,
            checkIfReg: true,
            dataUpdate: false,
            updatePopup: false,
            imagePreviewUrl: null,
            imagePreviewUrl2: null,
            message: '',
            isCreate: false,
            file1Obj: [],
            fileTemp: '',
            backSupportFromInfo: 'support',
            backCustomerAdmin: 'customer',
            editInfoShow: '',
            isSignUp: false,
            checkIfChangeSub: '',
            signUpData: {
                first_name: '',
                last_name: '',
                phone: '',
                fax: '',
                email: '',
                password: '',
                confirmPassword: '',
                city: '',
                street: '',
                postal_code: '',
                type: '',
                companyname: '',
                companyphone: '',
                company_t_phone: '',
                companyemail: '',
                code: '',
                companyfax: '',
                companycity: '',
                companystreet: '',
                company_postal_code: '',
                email_notification: 1,
                subscription: 'regular',
                sms_notification: 0,
                companytype: 'חברה בע"מ',
                validateCodePhone: '',
            },
            file1: null,
            file2: null,
            file3: null,
            selectedCity: '',
            selectedCityCompany: '',
            defaultCity: '',
            code: '',
            backAfterSignUp: false,
            saleRedirect: false,
            adminRedirect: false,
            base64: 'data:image/jpg;base64,uploads\\3265485bf68840182f21943f5ec8848d=',
            formState: {},
            formMessages: {},
            validityState: {},
            msgErrorCode: '',
            changeSubscription: false,
            showEmailValidate: false,
            isUpdateRegular: false,
            inputFiles: [],
            selectedFileValidate: '',
            inputsFilesArray: [],
            username: "",
            item: [],
            filesArrayShow: [],
            fileCompany: [],
            idCompanyFile: '',
            showSms: false,
            homePageRegister: false,
            changeEmailValidate: false,
            isValidPhoneNumber: false,
            validateCodePhoneData: '',
            inputCodeForPhone: false,
            validPhoneOnEdit: null,
            doesPhoneChanged: false,
        }
    }

    vipHeaders = [
        { key: "id", value: "", toSort: false },
        { key: "name", value: "מנוי VIP", toSort: false },
        { key: "username", value: "מנוי רגיל", toSort: false }
    ];
    vipData = [
        { key: 'התראות בדוא"ל', vipValue: <FontAwesomeIcon icon={faCheck} color={'green'} />, regValue: <FontAwesomeIcon icon={faCheck} color={'green'} /> },
        { key: 'התראות בזמן אמת', vipValue: <FontAwesomeIcon icon={faCheck} color={'green'} />, regValue: <FontAwesomeIcon icon={faCheck} color={'green'} /> },
        { key: 'התראות SMS', vipValue: <FontAwesomeIcon icon={faCheck} color={'green'} />, regValue: <FontAwesomeIcon icon={faTimes} color={'red'} /> },
        { key: 'הופעה מודגשת', vipValue: <FontAwesomeIcon icon={faCheck} color={'green'} />, regValue: <FontAwesomeIcon icon={faTimes} color={'red'} /> },
        { key: 'חשיפה מהירה ללקוחות', vipValue: <FontAwesomeIcon icon={faCheck} color={'green'} />, regValue: <FontAwesomeIcon icon={faTimes} color={'red'} /> }
    ]


    Userinput = async (event) => {
        //todo to check if we want this          
        // this.setState({ username: event.target.value });
        const file = event.target.files[0];
        if (event.target.name === 'file1' && file !== undefined) {
            this.setState({ file1: file })
        }
        if (event.target.name === 'file2' && file !== undefined) {
            this.setState({ file2: file })
        }
        if (event.target.name === 'file3' && file !== undefined) {
            this.setState({ file3: file })
        }
        // if () {
        //     // this.setState({ fileTemp: file1 })
        //   this.setState({

        //   })
        // }
        if (event.target.files[0] === undefined || event.target.files[0] === null) {
            // this.setState({ fileTemp: file1 })
            // this.state.file1Obj.push(this.state.fileTemp);
            await this.setState({
                validityState: {
                    ...this.state.validityState,
                    [event.target.name]: 'form-control is-invalid',
                    // file2: 'form-control is-invalid',
                    // file3: 'form-control is-invalid',
                },
                [event.target.name]: null,

            })
        }

    }
    UserinputAdmin = (event) => {
        // const target = event.target;
        this.setState({ username: event.target.value });
        const file1 = event.target.files[0];
        if (event.target.files[0] !== undefined) {
            this.setState({ fileTemp: file1 })
        }
    }

    AddList = (input, event) => {

        if (input !== "") {
            this.state.file1Obj.push(this.state.fileTemp);
            var listArray = this.state.item;
            listArray.push(input);
            this.setState({
                item: listArray, username: "", isClickAdd: true,
                validityState: {
                    ...this.state.validityState,
                    item: '',
                }

            });

        }
    }

    deleteList(index) {
        var delArray = this.state.item;
        var delFile = this.state.file1Obj
        delArray.splice(index, 1);
        delFile.splice(index, 1)
        this.setState({ item: delArray, file1Obj: delFile });
        if (!this.state.dataUpdate) {
            if (this.state.file1Obj.length < 3) {
                this.setState({
                    validityState: {
                        ...this.state.validityState,
                        item: 'form-control is-invalid',
                    },
                    formMessages: {
                        ...this.state.formMessages,
                        item: 'אנא בחר לפחות 3 קבצים',
                    },
                })
            }
        }
    }

    addInputFiles = () => {
        this.setState((prev) => ({
            inputsFilesArray: [...prev.inputsFilesArray, ""],
        }));
    };

    onChangeHandler = async (event) => {
        console.clear()

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.signUpData, [target.name]: value };
        await this.setState({ signUpData: savedData });
        if (this.state.signUpData.type !== 'חברה') {
            this.onChangeTypeCompany()
        }
    }
    onChangeTypeCompany = () => {

        this.setState({
            formMessages: {
                ...this.state.formMessages,
                companyname: '',
                companyphone: '',
                company_t_phone: '',
                companyemail: '',
                code: '',
                companyfax: '',
                companycity: '',
                companystreet: '',
                company_postal_code: '',
            },
            validityState: {
                ...this.state.validityState,
                companyname: '',
                companyphone: '',
                company_t_phone: '',
                companyemail: '',
                code: '',
                companyfax: '',
                companycity: '',
                companystreet: '',
                company_postal_code: '',
            },
            signUpData: {
                ...this.state.signUpData,
                companyname: '',
                companyphone: '',
                company_t_phone: '',
                companyemail: '',
                code: '',
                companyfax: '',
                companycity: '',
                companystreet: '',
                company_postal_code: '',

            },
            payHasError: false,
            stateSubscription: null,
        })

    }
    onBlur = (fieldName, value) => {

        const nextState = { ...this.state.formState, [fieldName]: value };
        this.setState({ formState: nextState });

        validateFormSignUpOrEditInfo(nextState, fieldName, this.state.validateCodePhoneData)
            .done(this.handleValidationResult);
        if (fieldName === 'companyphone') {
            if (this.state.dataUpdate) {

                if (this.state.signUpData.companyphone === this.state.validPhoneOnEdit) {
                    this.setState({ doesPhoneChanged: false, inputCodeForPhone: false })
                } else {
                    this.setState({ doesPhoneChanged: true })
                }
            }
            if (!validateFormSignUpOrEditInfo(nextState, fieldName, this.state.validateCodePhoneData)
                .done(this.handleValidationResult).hasErrors('companyphone')) {
                this.setState({ isValidPhoneNumber: true, doesPhoneChanged: true })

            } else {
                this.setState({
                    isValidPhoneNumber: false, inputCodeForPhone: false,
                    // formMessages:{
                    //     ...this.state.formMessages,
                    //     validateCodePhone:'',
                    // },
                    // validityState:{
                    //     ...this.state.validityState,
                    //     validateCodePhone:'',
                    // }
                })
            }
        }
    }
    handleValidationResult = (result) => {
        const msgs = { ...this.state.formMessages };
        const validity = { ...this.state.validityState };
        result.tested.forEach((fieldName) => {


            if (result.hasErrors(fieldName)) {

                msgs[fieldName] = result.getErrors(fieldName)[0];
                validity[fieldName] = 'form-control is-invalid';

            } else if (result.hasWarnings(fieldName)) {
                msgs[fieldName] = result.getWarnings(fieldName)[0];
                validity[fieldName] = 'warning';
            } else {
                delete msgs[fieldName];
                validity[fieldName] = 'form-control is-valid';
            }
        });
        this.setState({ formMessages: msgs, validityState: validity });

    }

    smsNotification = event => {
        if (event.target.value === 'yesSmsNotification') {
            this.setState({
                signUpData: {
                    ...this.state.signUpData,
                    sms_notification: 1
                }
            })
        } else if (event.target.value === 'noSmsNotification') {
            this.setState({
                signUpData: {
                    ...this.state.signUpData,
                    sms_notification: 0
                }
            })
        }
    }
    isExistsOrVipOrNotification = event => {
        if (event.target.value === 'חברה בע"מ') {
            this.setState({ companytype: 'חברה בע"מ', showLabelCompany: true })
        } else if (event.target.value === 'עוסק מורשה') {
            this.setState({ companytype: 'עוסק מורשה', showLabelCompany: false })
        }

        if (event.target.value === 'yesNotification') {
            this.setState({
                signUpData: {
                    ...this.state.signUpData,
                    email_notification: 1
                }
            })
        } else if (event.target.value === 'noNotification') {
            this.setState({
                signUpData: {
                    ...this.state.signUpData,
                    email_notification: 0
                }
            })
        }
        if (event.target.value === 'regular') {
            if (this.state.dataUpdate) {
                if (event.target.value === this.state.stateSubscription) {
                    this.setState({ changeSubscription: false })
                } else {
                    this.setState({ changeSubscription: true })
                }
            } else {
                this.setState({ vipOrRegCreate: true })
            }
            this.setState({
                signUpData: {
                    ...this.state.signUpData,
                    subscription: 'regular',
                    sms_notification: 0,
                }
            })
            this.setState({ checkIfReg: true })
        } else if (event.target.value === 'vip') {
            if (event.target.value === this.state.stateSubscription) {

                this.setState({ changeSubscription: false })
            } else {
                this.setState({ changeSubscription: true, isUpdateRegular: true })
            }
            this.setState({
                signUpData: {
                    ...this.state.signUpData,
                    subscription: 'vip',
                    sms_notification: 1,
                }
            })
            this.setState({ checkIfReg: false })
        }
    }

    isCompanyOrNo = event => {

        if (event.target.name === 'type' && event.target.value === 'חברה') {
            this.setState({ isCompany: true })
        } else {
            this.setState({ isCompany: false })
        }
    }
    addFileArray = () => {
        this.setState(prev => ({ inputFiles: [...prev.inputFiles, ''] }))
    }
    onSaveData = async () => {
        const { file1Obj } = this.state;
        const createNewUser = {
            first_name: this.state.signUpData.first_name,
            last_name: this.state.signUpData.last_name,
            phone: this.state.signUpData.phone,
            fax: this.state.signUpData.fax,
            email: this.state.signUpData.email,
            password: this.state.signUpData.password,
            city: this.state.signUpData.city,
            street: this.state.signUpData.street,
            postal_code: this.state.signUpData.postal_code,
            type: this.state.signUpData.type,
            companytype: this.state.signUpData.companytype,
            companyname: this.state.signUpData.companyname,
            companyphone: this.state.signUpData.companyphone,
            company_t_phone: this.state.signUpData.company_t_phone,
            companyemail: this.state.signUpData.companyemail,
            code: this.state.signUpData.code,
            companyfax: this.state.signUpData.companyfax,
            companycity: this.state.signUpData.companycity,
            companystreet: this.state.signUpData.companystreet,
            company_postal_code: this.state.signUpData.company_postal_code,
            email_notification: this.state.signUpData.email_notification,
            subscription: this.state.signUpData.subscription,
            sms_notification: this.state.signUpData.sms_notification,
        }

        try {


            if (this.state.signUpData.type === 'חברה') {
                if (getUser()) {
                    var person = JSON.parse(getUser());
                    if ((person.role.name === 'sale' || person.role.name === 'admin' || person.role.name === 'subAdmin') && !validateFormSignUpOrEditInfo(this.state.formState, '', this.state.validateCodePhoneData).done(this.handleValidationResult).hasErrors()) {
                        var dataSale = await fetcher.post('/signup', this.state.signUpData);
                        if (dataSale.status === 200) {
                            Swal.fire({
                                title: 'נוצר בהצלחה',
                                icon: 'success',
                                confirmButtonText: 'סיום',
                                allowOutsideClick: false,
                            }).then(async () => {
                                let formData = new FormData();
                                file1Obj.forEach((element) => {
                                    formData.append("files", element);
                                })
                                await fetcher.post(`companies/direct_upload_files/${dataSale.data}`, formData);

                                if (person.role.name === 'sale') {
                                    this.props.history.push('/salesman');
                                    
                                } else if (person.role.name === 'admin' || person.role.name === 'subAdmin') {
                                    this.props.history.push('/admin');
                                }
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'שגיאה!!',
                                text: dataSale.data
                            })
                        }
                    }

                }

                else if (!validateFormSignUpOrEditInfo(this.state.formState, '', this.state.validateCodePhoneData).done(this.handleValidationResult).hasErrors()) {

                    var arr = []
                    arr.push(this.state.file1, this.state.file2, this.state.file3)
                    let formData = new FormData();
                    arr.forEach((element) => {
                        formData.append("files", element);
                    })
                    var dataCompany = await fetcher.post('/signup/wait', createNewUser);

                    //////////////////////////////

                    if (dataCompany.status === 200) {
                        Swal.fire({
                            title: 'נוצר בהצלחה',
                            icon: 'success',
                            confirmButtonText: 'סיום',
                            allowOutsideClick: false,
                        }).then(async () => {
                            let formData = new FormData();
                            file1Obj.forEach((element) => {
                                formData.append("files", element);
                            })
                            this.setState({ isCompany: true, isCreate: true, addModalShow: true, message: 'הפרטים שלך נקלטו בהצלחה, אנא חכה לאישור' });

                            await fetcher.post(`/companies/upload_files/${parseInt(dataCompany.data)}`, formData);
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'שגיאה!!',
                            text: dataCompany.data
                        })
                    }

                    // this.setState({ isCompany: true, isCreate: true, addModalShow: true, message: 'הפרטים שלך נקלטו בהצלחה, אנא חכה לאישור' });
                    // await fetcher.post(`/companies/upload_files/${parseInt(dataCompany.data)}`, formData);
                } else {
                    this.setState({ payHasError: true })
                }
            } else {
                if (!validateFormSignUpOrEditInfo(this.state.formState).done(this.handleValidationResult).hasErrors()) {
                    this.setState({ showEmailValidate: true })
                }
            }
        } catch (error) {
        }
    }

    onUpdateDetails = async (stateName) => {
        try {
            const editInfo = window.location.pathname.split('/')[1];
            this.setState({ editInfoShow: editInfo })
            if (editInfo === 'editInfo') {
                var editErrorPass = validateFormSignUpOrEditInfo(this.state.formState, '', this.state.validateCodePhoneData).done(this.handleValidationResult)
                if (this.state.formState.password === '') {
                    editErrorPass.tests.password.errorCount = 0
                    editErrorPass.tests.confirmPassword.errorCount = 0
                    await delete editErrorPass.tests.password['errors'];
                    await delete editErrorPass.tests.confirmPassword['errors'];
                    if (this.state.signUpData.type === 'חברה') {
                        await delete editErrorPass.tests.file1['errors'];
                        await delete editErrorPass.tests.file2['errors'];
                        await delete editErrorPass.tests.file3['errors'];
                        if (this.state.signUpData.companyphone === this.state.validPhoneOnEdit) {
                            await delete editErrorPass.tests.validateCodePhone['errors'];
                        } else {
                            this.setState({ inputCodeForPhone: true })
                        }
                    }

                }
                if ((Object.keys(editErrorPass.getErrors()).length === 0)) {

                    let formData = new FormData();
                    this.state.file1Obj.forEach((element) => {
                        formData.append("files", element);
                    })
                    if (this.state.signUpData.type === 'חברה') {
                        await fetcher.post(`companies/direct_upload_files/${this.state.idCompanyFile}`, formData);
                    }
                    if (this.state.signUpData.email === this.state.emailValidateChange && this.state.signUpData.type !== 'חברה') {
                        await this.setState({ changeEmailValidate: false, addModalShowEmailValidate: false })
                        const { data } = await fetcher.put('/customers/myDetails', this.state.signUpData);
                        if (stateName === 'updateInfo') {
                            this.setState({ updatePopup: true, addModalShow: true, message: data })
                        }
                        // this.setState({ updatePopup: true, addModalShow: true, message: data })
                    } else if (this.state.signUpData.type !== 'חברה') {
                        await this.setState({ changeEmailValidate: true, addModalShowEmailValidate: true, })

                    } else {
                        const { data } = await fetcher.put('/customers/myDetails', this.state.signUpData);
                        if (stateName === 'updateInfo') {
                            this.setState({ updatePopup: true, addModalShow: true, message: data })
                        }
                    }

                }
            } else {
                var editErrorPass2 = validateFormSignUpOrEditInfo(this.state.formState, '', this.state.validateCodePhoneData).done(this.handleValidationResult)
                await delete editErrorPass2.tests.password['errors'];
                await delete editErrorPass2.tests.confirmPassword['errors'];
                await delete editErrorPass2.tests.file1['errors'];
                await delete editErrorPass2.tests.file2['errors'];
                await delete editErrorPass2.tests.file3['errors'];
                if (this.state.signUpData.companyphone === this.state.validPhoneOnEdit) {
                    await delete editErrorPass2.tests.validateCodePhone['errors'];
                } else {
                    this.setState({ inputCodeForPhone: true })
                }
                if ((Object.keys(editErrorPass2.getErrors()).length === 0)) {
                    if (this.state.signUpData.type === 'חברה') {
                        let formData = new FormData();
                        this.state.file1Obj.forEach((element) => {
                            formData.append("files", element);
                        })
                        await fetcher.post(`companies/direct_upload_files/${this.state.idCompanyFile}`, formData);
                        // await fetcher.post(`companies/upload_files/${this.state.idCompanyFile}`, formData);

                    }
                    const { data } = await fetcher.put(`/customers/${this.state.id}`, this.state.signUpData);
                    if (stateName === 'updateInfo') {
                        this.setState({ updatePopup: true, addModalShow: true, message: data })
                    }

                }
            }


        } catch (error) {

        }
    }
    onResetPassword() {
    }
    componentDidMount = async () => {
        try {
            console.clear()
            const editInfo = window.location.pathname.split('/')[1];
            const id = window.location.pathname.split('/')[4];
            var person = JSON.parse(getUser());
            if (person === null || person.role.name === 'adminCompany' || person.role.name === 'userCompany' || person.role.name === 'sale') {
                this.setState({ homePageRegister: true })
            }
            if (editInfo === 'editInfo' && person.role.name !== 'subAdmin') {

                const { data } = await fetcher.get('/customers/myDetails')
                if (data.type === 'חברה') {
                    const fileArrayCompanyMyDetails = await fetcher.get(`companies/load_files/${data.companies[0].id}`);
                    // const fileArrayCompanyMyDetails = await fetcher.get(`companies/load_files/40`);
                    await this.setState({
                        stateSubscription: data.companies[0].subscription, fileCompany: fileArrayCompanyMyDetails.data, idCompanyFile: data.companies[0].id,
                        formState: {
                            item: fileArrayCompanyMyDetails.data

                        }
                    })
                }
                const mappedInfo = this.mapApiResultToState(data);
                await this.setState({
                    dataUpdate: true,
                    dataUpdateTemp: true,
                    emailValidateChange: mappedInfo.email,
                    validPhoneOnEdit: mappedInfo.companyphone,
                    signUpData: mappedInfo,
                    formState: {
                        ...mappedInfo,
                    },
                    checkIfChangeSub: mappedInfo.subscription,
                }, () => {
                    const { cities } = this.context
                    const selectedCity = cities.find(city => city.name === mappedInfo.city);
                    if (mappedInfo.companycity) {
                        var selectedCityCompany = cities.find(city => city.name === mappedInfo.companycity)
                    }
                    this.setState({ selectedCity, selectedCityCompany })
                })
            }
            this.setState({ id: id });
            if (id) {
                if (getUser()) {
                    if (getUser().name !== 'admin' || getUser().name !== 'subAdmin' || getUser().name !== 'support') {
                        await this.setState({ showSms: true })
                    }
                }
                const { data } = await fetcher.get(`/customers/${id}`);
                if (data.type === 'חברה') {
                    const fileArrayCompanyMyDetails = await fetcher.get(`companies/load_files/${data.companies[0].id}`);
                    await this.setState({
                        stateSubscription: data.companies[0].subscription, fileCompany: fileArrayCompanyMyDetails.data, idCompanyFile: data.companies[0].id,
                        formState: {
                            file1: fileArrayCompanyMyDetails.data[0],
                            file2: fileArrayCompanyMyDetails.data[1],
                            file3: fileArrayCompanyMyDetails.data[2],

                        }
                    })
                }

                const mappedCustomer = this.mapApiResultToState(data);
                this.setState({
                    dataUpdate: true,
                    signUpData: mappedCustomer,
                    validPhoneOnEdit: mappedCustomer.companyphone,
                    formState: {
                        ...mappedCustomer,
                    },
                    checkIfChangeSub: mappedCustomer.subscription,

                }, () => {

                    const { cities } = this.context
                    const selectedCity = cities.find(city => city.name === mappedCustomer.city)
                    if (mappedCustomer.companycity) {
                        var selectedCityCompany = cities.find(city => city.name === mappedCustomer.companycity)

                    }
                    this.setState({ selectedCity, selectedCityCompany })
                })
            }
            if (!id && !(editInfo === 'editInfo')) {
                await this.setState({ stateSubscription: 'regular' })
            }
        }

        catch (error) {

        }
    }
    backButton = () => {
        this.props.history.goBack();
    }

    onPupUpClicked = () => {
        this.setState({ isCreate: true, addModalShow: true })
    }

    mapApiResultToState = employee => {
        const mappedCustomer = {
            first_name: employee.first_name,
            last_name: employee.last_name,
            phone: employee.phone,
            fax: employee.fax,
            email: employee.email,
            password: employee.password || '',
            city: employee.city,
            street: employee.street,
            postal_code: employee.postal_code,
            type: employee.type,
            email_notification: employee.email_notification,
            sms_notification: employee.sms_notification
        }


        if (employee.type === 'חברה') {
            const mappedCompany = {
                email_notification: employee.email_notification,
                companyname: employee.companies[0].name,
                companyphone: employee.companies[0].phone,
                company_t_phone: employee.companies[0].t_phone,
                companyemail: employee.companies[0].email,
                code: employee.companies[0].code,
                companyfax: employee.companies[0].fax,
                companycity: employee.companies[0].city,
                companystreet: employee.companies[0].street,
                company_postal_code: employee.companies[0].postal_code,
                subscription: employee.companies[0].subscription,

            }
            const returned = Object.assign(mappedCustomer, mappedCompany);
            return returned;
        }
        return mappedCustomer
    }

    onSelectFile = event => {
        let reader = new FileReader();
        if (event.target.name === 'file1') {
            reader.onloadend = () => {
                this.setState({
                    imagePreviewUrl: reader.result,
                });
            }

        } else if (event.target.name === 'file2') {
            reader.onloadend = () => {
                this.setState({
                    imagePreviewUrl2: reader.result,
                });
            }
        }
        reader.readAsDataURL(event.target.files[0])
        const file1 = event.target.files[0];
        this.state.file1Obj.push(file1);
        this.setState({
            selectedFileValidate: file1,
        })
    }



    handleKeyPress = (e) => {

        var value = e.currentTarget.value.split(' ');
        if (value) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    disablePopAfter = () => {
        this.setState({
            showEmailValidate: false,
            changeEmailValidate: false,
        })
    }
    redirectPage = () => {
        if (getUser()) {
            var roleRedirect = JSON.parse(getUser());
            if (roleRedirect) {
                if (roleRedirect.role.name === 'admin' || roleRedirect.role.name === 'subAdmin') {
                    this.setState({ adminRedirect: true })
                } else if (roleRedirect.role.name === 'sale') {
                    this.setState({ saleRedirect: true })
                } else if (roleRedirect.role.name === 'customer') {
                    this.props.history.push('/customer')
                }
            }
        } else {
            this.setState({ backAfterSignUp: true })

        }
    }
    onClickValidatePhone = async () => {
        try {
            const phoneValidateObj = { 'companyphone': this.state.signUpData.companyphone }
            const { data } = await fetcher.post('/signup/confirmPhone', phoneValidateObj);
            this.setState({ validateCodePhoneData: data, inputCodeForPhone: true })
        } catch (error) {

        }
    }
    addModalClosed = () => {
        this.setState({ showEmailValidate: false })
    }
    render() {
        // let addModalClosed = () => this.setState({ showEmailValidate: faBatteryThreeQuarters ,changeEmailValidate:false})
        const { cities } = this.context;
        return (
            <div id="details">
                <div className="container-fluid">
                    {this.state.updatePopup && <AddDepModal show={this.state.addModalShow}
                        onHide={() => false}
                        msg={this.state.message}
                        updatePopup={this.state.updatePopup}
                        backSupportFromInfo={this.state.backSupportFromInfo}
                        backCustomerAdmin={this.state.backCustomerAdmin}
                        editInfoShow={this.state.editInfoShow} />}

                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-8">
                            <div className="form-group row">
                                <div className="col-md-4">
                                    <div className="input-group"></div>
                                    {this.state.dataUpdate ? <h4 className="text-right mt-2">ערכית נתונים אישיים</h4> : null}
                                    <h5 className="d-flex align-items-right mt-3 text-primary"><u>פרטים אישיים</u></h5>


                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-group row">
                                    <label htmlFor="inputFirstName" className="d-flex align-items-right col-sm-3 col-form-label">שם פרטי</label>
                                    <div className="col-sm-10">
                                        <input type="text" className={this.state.validityState.first_name || "form-control"} id="inputFirstName" name="first_name" value={this.state.signUpData.first_name || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('first_name', this.state.signUpData.first_name)} />
                                        <label className="float-right text-danger">{this.state.formMessages.first_name}</label>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputLastName" className="d-flex align-items-right col-sm-3 col-form-label">שם משפחה</label>
                                    <div className="col-sm-10">
                                        <input type="text" className={this.state.validityState.last_name || "form-control"} id="inputLastName" name="last_name" value={this.state.signUpData.last_name || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('last_name', this.state.signUpData.last_name)} />
                                        <label className="float-right text-danger">{this.state.formMessages.last_name}</label>

                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputPhone2" className="d-flex align-items-right col-sm-3 col-form-label"> נייד</label>
                                    <div className="col-sm-10">
                                        <input type="text" className={this.state.validityState.phone || "form-control"} id="inputPhone2" name="phone" value={this.state.signUpData.phone || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('phone', this.state.signUpData.phone)} />
                                        <label className="float-right text-danger">{this.state.formMessages.phone}</label>

                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputPhoneFax" className="d-flex align-items-right col-sm-3 col-form-label"> פקס</label>
                                    <div className="col-sm-10">
                                        <input type="text" className={this.state.validityState.fax || "form-control"} id="inputPhoneFax" name="fax" value={this.state.signUpData.fax || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('fax', this.state.signUpData.fax)} />
                                        <label className="float-right text-danger">{this.state.formMessages.fax}</label>
                                    </div>

                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputEmail" className="d-flex align-items-right col-sm-3 col-form-label">דוא"ל</label>
                                    <div className="col-sm-10">
                                        <input type="text" className={this.state.validityState.email || "form-control"} id="inputEmail" name="email" value={this.state.signUpData.email || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('email', this.state.signUpData.email)} />
                                        <label className="float-right text-danger">{this.state.formMessages.email}</label>

                                    </div>
                                </div>
                                {!this.state.dataUpdate && !this.state.checkIfChangeSub ?
                                    <div>
                                        <div className="form-group row">
                                            <label htmlFor="inputPassOne" className="d-flex align-items-right col-sm-3 col-form-label">סיסמה</label>
                                            <div className="col-sm-10">
                                                <input type="password" className={this.state.validityState.password || "form-control"} id="inputPassOne" name="password" value={this.state.signUpData.password || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('password', this.state.signUpData.password)} />
                                                <label className="text-right float-right text-danger">{this.state.formMessages.password}</label>

                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputPassTwo" className="d-flex align-items-right col-sm-3 col-form-label">אשר סיסמה</label>
                                            <div className="col-sm-10">
                                                <input type="password" name="confirmPassword" className={this.state.validityState.confirmPassword || "form-control"} id="inputPassTwo" onChange={this.onChangeHandler} onBlur={() => this.onBlur('confirmPassword', this.state.signUpData.confirmPassword)} />
                                                <label className="float-right text-danger">{this.state.formMessages.confirmPassword}</label>

                                            </div>
                                        </div>
                                    </div> : null

                                }
                                < div className="form-group row">
                                    <div className="col-md-4 col-sm-10">
                                        <label htmlFor="inputCity" className="d-flex align-items-right mt-3">יישוב</label>

                                        <Autocomplete
                                            id="combo-box-demo"
                                            options={cities}
                                            getOptionLabel={(option) => option.name}
                                            onChange={((evt, city) => {
                                                if (city) {
                                                    let { signUpData } = this.state
                                                    signUpData.city = city.name

                                                    const { cities } = this.context
                                                    const selectedCity = cities.find(city => city && city.name === signUpData.city)

                                                    this.setState({ signUpData, selectedCity })
                                                }
                                            })}
                                            noOptionsText={'ישוב לא קיים'}
                                            style={{ direction: 'rtl' }}
                                            disableClearable={true}
                                            wrapperStyle={{ position: 'relative', display: 'inline-block', color: 'red' }}
                                            defaultValue={this.state.selectedCity}
                                            value={this.state.selectedCity || ''}
                                            className={this.state.validityState.city || "form-control"}
                                            onBlur={() => this.onBlur('city', this.state.signUpData.city)}
                                            renderInput={(params) => <TextField {...params} placeholder="מוצא" size='small' InputProps={{ ...params.InputProps, disableUnderline: true }} />}
                                        />
                                        <label className="float-right text-danger">{this.state.formMessages.city}</label>

                                    </div>

                                    <div className="col-md-4 col-sm-10">
                                        <label htmlFor="inputStreet" className="d-flex align-items-right mt-3">רחוב</label>
                                        <input type="text" className={this.state.validityState.street || "form-control"} id="inputStreet" placeholder="רחוב" name="street" value={this.state.signUpData.street || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('street', this.state.signUpData.street)} />
                                        <label className="float-right text-danger">{this.state.formMessages.street}</label>

                                    </div>
                                    <div className="col-md-2  col-sm-10">
                                        <label htmlFor="inputZip" className="d-flex align-items-right mt-3">מיקוד</label>
                                        <input id="inputZip" size='small' className={this.state.validityState.postal_code || "form-control"} name="postal_code" placeholder="מיקוד" value={this.state.signUpData.postal_code || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('postal_code', this.state.signUpData.postal_code)} />
                                        <label className="float-right text-danger">{this.state.formMessages.postal_code}</label>
                                    </div>
                                </div>
                                {this.state.signUpData.type === 'עובד חברה' ? null :

                                    <div className="form-group row">
                                        <div className="col-md-4  col-sm-10">
                                            <label htmlFor="inputCustomer" className="d-flex align-items-right mt-3">סוג לקוח</label>
                                            <select className={this.state.validityState.type || "form-control"} id="inputCustomer" name="type" value={this.state.signUpData.type || ''} onChange={this.state.dataUpdate ? this.handleKeyPress : this.onChangeHandler} onClick={this.isCompanyOrNo} disabled={this.state.dataUpdate === true} onBlur={() => this.onBlur('type', this.state.signUpData.type)}>
                                                <option selected value="">סוג לקוח</option>
                                                <option value="חברה">חברה</option>
                                                <option value="לקוח רגיל">לקוח רגיל</option>
                                                <option value="רשות">רשות</option>
                                                <option value="מוסד חינוכי">מוסד חינוכי</option>

                                            </select>
                                            <div>
                                                <label className="float-right text-danger">{this.state.formMessages.type}</label>
                                            </div>
                                        </div>

                                    </div>


                                }

                                {(this.state.isCompany || this.state.signUpData.type === 'חברה') ?

                                    <div>
                                        <div className="form-group row">
                                            <div className="col-md-4">
                                                <h5 className="d-flex align-items-right mt-3 text-primary"><u>פרטי החברה</u></h5>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="d-flex align-items-right col-sm-3 col-form-label">סוג לקוח </label>
                                        </div>
                                        <div className="form-group row">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input ml-2" type="radio" id="company" value='חברה בע"מ' name="companytype" checked={this.state.showLabelCompany} onChange={this.onChangeHandler} onClick={this.state.dataUpdate ? this.handleKeyPress : this.isExistsOrVipOrNotification} />
                                                <label className="form-check-label" htmlFor="company">חברה בע"מ</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input ml-2" type="radio" id="Oseek" value='עוסק מורשה' name="companytype" onChange={this.onChangeHandler} onClick={this.state.dataUpdate ? this.handleKeyPress : this.isExistsOrVipOrNotification} />
                                                <label className="form-check-label" htmlFor="Oseek">עוסק מורשה</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            {this.state.showLabelCompany ? <label htmlFor="inputCompany" className="d-flex align-items-right col-sm-12 col-form-label">שם חברה</label> :
                                                <label htmlFor="inputCompany" className="d-flex align-items-right col-sm-12 col-form-label">שם עסק</label>}

                                            <div className="col-sm-10">
                                                <input type="text" className={this.state.validityState.companyname || "form-control"} id="inputCompany" name="companyname" value={this.state.signUpData.companyname || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('companyname', this.state.signUpData.companyname)} />
                                                <label className="float-right text-danger">{this.state.formMessages.companyname}</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            {!this.state.doesPhoneChanged ?
                                                <label htmlFor="inputPhone" className="d-flex align-items-right col-sm-12 col-form-label"> נייד </label>
                                                : <label htmlFor="inputPhone" className="d-flex align-items-right col-sm-12 col-form-label"> נייד ( * לחץ על <b>&nbsp;שלח קוד&nbsp;</b> לקבלת קוד אימות לטלפון  )</label>
                                            }
                                            <div className={this.state.doesPhoneChanged ? "col-sm-8" : "col-sm-10"}>
                                                <input type="text" className={this.state.validityState.companyphone || "form-control"} id="inputPhone" name="companyphone" value={this.state.signUpData.companyphone || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('companyphone', this.state.signUpData.companyphone)} />
                                                <label className="float-right text-danger">{this.state.formMessages.companyphone}</label>
                                            </div>
                                            <div className="col-md-2 col-sm-4">
                                                {this.state.doesPhoneChanged ?
                                                    <button className="btn btn-warning btn-block" type="button" onClick={this.onClickValidatePhone} disabled={!this.state.isValidPhoneNumber === true}>שלח קוד</button>
                                                    : null
                                                }

                                            </div>
                                        </div>
                                        {/* <div class="form-group row">

                                            <label htmlFor="inputPhone2Company" className="d-flex align-items-right col-form-label">* לחץ על שלח קוד לקבלת קוד אימות לטלפון</label>
                                        </div> */}
                                        <div className="row">
                                            {/* <div className="col-md-1"></div> */}
                                            <div className="col-md-4">
                                                {this.state.inputCodeForPhone ?
                                                    <div class="form-inline">
                                                        <input type="text" className={this.state.validityState.validateCodePhone || 'form-control '} placeholder="קוד אימות" name="validateCodePhone" value={this.state.signUpData.validateCodePhone || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('validateCodePhone', this.state.signUpData.validateCodePhone)} />
                                                        {/* <div className="ml-3"></div> */}
                                                        {/* <div class="input-group-append">
                                                        <button className="btn btn-secondary" type="button" onClick={this.onClickStation}>שלח קוד</button>
                                                    </div> */}
                                                    </div> : null}

                                                <label className="float-right text-danger">{this.state.formMessages.validateCodePhone}</label>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="inputPhone2Company" className="d-flex align-items-right col-sm-3 col-form-label">טלפון</label>
                                            <div className="col-sm-10">
                                                <input type="text" className={this.state.validityState.company_t_phone || "form-control"} id="inputPhone2Company" name="company_t_phone" value={this.state.signUpData.company_t_phone || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('company_t_phone', this.state.signUpData.company_t_phone)} />
                                                <label className="float-right text-danger">{this.state.formMessages.company_t_phone}</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputEmail2" className="d-flex align-items-right col-sm-3 col-form-label">דוא"ל</label>
                                            <div className="col-sm-10">
                                                <input type="text" className={this.state.validityState.companyemail || "form-control"} id="inputEmail2" name="companyemail" value={this.state.signUpData.companyemail || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('companyemail', this.state.signUpData.companyemail)} />
                                                <label className="float-right text-danger">{this.state.formMessages.companyemail}</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="inputPhoneFaxCompany" className="d-flex align-items-right col-sm-3 col-form-label"> פקס</label>
                                            <div className="col-sm-10">
                                                <input type="text" className={this.state.validityState.companyfax || "form-control"} id="inputPhoneFaxCompany" name="companyfax" value={this.state.signUpData.companyfax || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('companyfax', this.state.signUpData.companyfax)} />
                                                <label className="float-right text-danger">{this.state.formMessages.companyfax}</label>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            {this.state.showLabelCompany ? <label htmlFor="inputOseek" className="d-flex align-items-right col-sm-12 col-form-label">ח.פ</label> :
                                                <label htmlFor="inputOseek" className="d-flex align-items-right col-sm-12 col-form-label">עוסק מורשה</label>}


                                            <div className="col-sm-10">
                                                <input type="text" className={this.state.validityState.code || "form-control"} id="inputOseek" name="code" value={this.state.signUpData.code || ''} onKeyPress={this.state.dataUpdate ? this.handleKeyPress : null} onChange={this.onChangeHandler} onBlur={() => this.onBlur('code', this.state.signUpData.code)} disabled={this.state.dataUpdate === true} />
                                                <label className="float-right text-danger">{this.state.formMessages.code}</label>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="col-md-4  col-sm-10">
                                                <label htmlFor="comapnyCity" className="d-flex align-items-right mt-3">עיר</label>
                                                <Autocomplete

                                                    id="comapnyCity"
                                                    className={this.state.validityState.companycity || "form-control"}
                                                    onBlur={() => this.onBlur('companycity', this.state.signUpData.companycity)}
                                                    options={cities}
                                                    getOptionLabel={(option) => option.name}
                                                    onChange={((evt, city) => {
                                                        if (city) {
                                                            let { signUpData } = this.state
                                                            signUpData.companycity = city.name

                                                            const { cities } = this.context
                                                            const selectedCityCompany = cities.find(city => city && city.name === signUpData.companycity)

                                                            this.setState({ signUpData, selectedCityCompany })
                                                        }
                                                    })}
                                                    defaultValue={this.state.selectedCityCompany}
                                                    value={this.state.selectedCityCompany || ''}
                                                    disableClearable={true}
                                                    wrapperStyle={{ position: 'relative', display: 'inline-block', color: 'red' }}
                                                    style={{ direction: 'rtl' }}
                                                    noOptionsText={'ישוב לא קיים'}
                                                    renderInput={(params) => <TextField {...params} placeholder="יישוב" size="small" id="comapnyCity" InputProps={{ ...params.InputProps, disableUnderline: true }} />}
                                                />
                                                <label className="float-right text-danger">{this.state.formMessages.companycity}</label>
                                            </div>

                                            <div className="col-md-4  col-sm-10">
                                                <label htmlFor="inputStreetCompany" className="d-flex align-items-right mt-3">רחוב</label>
                                                <input type="text" className={this.state.validityState.companystreet || "form-control"} id="inputStreetCompany" placeholder="רחוב" name="companystreet" value={this.state.signUpData.companystreet || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('companystreet', this.state.signUpData.companystreet)} />
                                                <label className="float-right text-danger">{this.state.formMessages.companystreet}</label>
                                            </div>
                                            <div className="col-md-2 col-sm-10">
                                                <label htmlFor="inputZipCompany" className="d-flex align-items-right mt-3" >מיקוד</label>
                                                <input type="text" className={this.state.validityState.company_postal_code || "form-control"} id="inputZipCompany" placeholder="3007500" name="company_postal_code" value={this.state.signUpData.company_postal_code || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('company_postal_code', this.state.signUpData.company_postal_code)} />
                                                <label className="float-right text-danger">{this.state.formMessages.company_postal_code}</label>
                                            </div>
                                        </div>
                                    </div> : null}
                                {this.state.signUpData.type === 'חברה' || this.state.signUpData.type === 'עובד חברה' ?
                                    <div>
                                        <div className="row">
                                            <label className="d-flex align-items-right col-sm-6 col-form-label">מעוניין בהתראות בדוא"ל?</label>
                                        </div>
                                        <div className="row">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input ml-2" type="radio" name="email_notification" id="inlineYes" value="yesNotification" checked={this.state.signUpData.email_notification === 1} onClick={this.isExistsOrVipOrNotification} />
                                                <label className="form-check-label" htmlFor="inlineYes">כן</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input ml-2" type="radio" name="email_notification" id="inlineNo" value="noNotification" onClick={this.isExistsOrVipOrNotification} checked={this.state.signUpData.email_notification === 0} />
                                                <label className="form-check-label" htmlFor="inlineNo">לא</label>
                                            </div>

                                            <div>

                                            </div>

                                        </div>
                                        {!this.state.showSms ? <div className="mb-3"> </div> :
                                            <div>
                                                <div className="row mt-3">
                                                    <label className="d-flex align-items-right col-sm-6 col-form-label">מעוניין התראות סמס ?</label>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input ml-2" type="radio" name="sms_notification" id="inlineYes1" value="yesSmsNotification" checked={this.state.signUpData.sms_notification === 1} onClick={this.smsNotification} disabled={this.state.signUpData.subscription === 'regular'} />
                                                        <label className="form-check-label" htmlFor="inlineYes1">כן</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input ml-2" type="radio" name="sms_notification" id="inlineNo2" value="noSmsNotification" onClick={this.smsNotification} checked={this.state.signUpData.sms_notification === 0} disabled={this.state.signUpData.subscription === 'regular'} />
                                                        <label className="form-check-label" htmlFor="inlineNo2">לא</label>
                                                    </div>

                                                    <div>

                                                    </div>

                                                </div>
                                            </div>

                                        }




                                    </div> : null
                                }
                                {
                                    (this.state.isCompany || this.state.signUpData.type === 'חברה') ?
                                        <div>
                                            <div className="row">
                                                <div className="col-md-10 text-center">
                                                    <Table
                                                        header={this.vipHeaders}
                                                        data={this.vipData}
                                                        sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                                                    </Table>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="d-flex align-items-right col-sm-3 col-form-label">סוג מנוי</label>
                                            </div>
                                            <div className="form-group row">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input ml-2" type="radio" name="subscription" id="regular" value="regular" onClick={this.isExistsOrVipOrNotification} checked={this.state.checkIfReg} />
                                                    <label className="form-check-label" htmlFor="regular">מנוי רגיל</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input ml-2" type="radio" name="subscription" id="vip" value="vip" onClick={this.isExistsOrVipOrNotification} checked={this.state.signUpData.subscription === 'vip'} />
                                                    <label className="form-check-label" htmlFor="vip">מנוי VIP</label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-4">
                                                    <h5 className="row d-flex align-items-right mt-4 text-primary"><u>מסמכים</u></h5>
                                                </div>
                                                {
                                                    this.state.dataUpdate ? null :
                                                        <div>
                                                            <div className="form-group">
                                                                <label className="form-check-label d-flex align-items-right" htmlFor="vip">תעודת התאגדות</label>

                                                                <Form className="col-sm-10">
                                                                    <Form.File id="formcheck-api-regular">
                                                                        <Form.File.Label></Form.File.Label>
                                                                        <Form.File.Input
                                                                            type="file"
                                                                            name="file1"
                                                                            onChange={this.Userinput}

                                                                            onBlur={this.state.dataUpdate ? null : () => this.onBlur('file1', this.state.file1)}
                                                                            className={this.state.validityState.file1 || ''}
                                                                        />
                                                                    </Form.File>

                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <label className="float-right text-danger">{this.state.formMessages.file1}</label>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            </div>
                                                            <div className="form-group">

                                                                <label className="form-check-label d-flex align-items-right" htmlFor="vip">פרוטוקול מורשה חתימה</label>

                                                                <Form className="col-sm-10">
                                                                    <Form.File id="formcheck-api-regular">
                                                                        <Form.File.Label></Form.File.Label>
                                                                        <Form.File.Input
                                                                            type="file"
                                                                            name="file2"
                                                                            onChange={this.Userinput}

                                                                            onBlur={this.state.dataUpdate ? null : () => this.onBlur('file2', this.state.file2)}
                                                                            className={this.state.validityState.file2 || ''}
                                                                        />
                                                                    </Form.File>
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <label className="float-right text-danger ml-2">{this.state.formMessages.file2}</label>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            </div>
                                                            <label className="form-check-label d-flex align-items-right" htmlFor="vip">ת.ז מנכ''ל</label>
                                                            <Form className="col-sm-10">
                                                                <Form.File id="formcheck-api-regular">
                                                                    <Form.File.Label></Form.File.Label>

                                                                    <Form.File.Input
                                                                        type="file"
                                                                        name="file3"
                                                                        onChange={this.Userinput}

                                                                        onBlur={this.state.dataUpdate ? null : () => this.onBlur('file3', this.state.file3)}
                                                                        className={this.state.validityState.file3 || ''}
                                                                    />
                                                                </Form.File>
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                        <label className="float-right text-danger">{this.state.formMessages.file3}</label>
                                                                    </div>
                                                                </div>
                                                            </Form>
                                                        </div>
                                                }
                                            </div>

                                            <div className="form-group">
                                                {this.state.dataUpdate ?
                                                    <ol>
                                                        {this.state.fileCompany.map((val, index) => (
                                                            <li className="text-right">
                                                                <a href={val.path}>{index === 0 ? 'תעודת התאגדות' :
                                                                    index === 1 ? 'פרוטוקול מרושה חתימה' : index === 2 ? "ת.ז מנכ''ל": ` קובץ נוסף ${index-2}`}</a>
                                                            </li>
                                                        ))}
                                                    </ol> : null

                                                }
                                                <div>
                                                    <ol start={(this.state.fileCompany.length + 1)}>
                                                        {this.state.item.map((val, index) => (
                                                            <li>
                                                                <div id="output" className="text-right">
                                                                    {/* {val.split('\\')[2]} */}
                                                                    {this.state.signUpData.first_name + ' ' + this.state.signUpData.last_name + '-' + this.state.signUpData.code}
                                                                    <button type="button" title="Delete" className="btn btn-outline" onClick={() => this.deleteList(index)} ><FontAwesomeIcon className="fa-lg " icon={faTimesCircle} color='red'> </FontAwesomeIcon></button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                                <div className="text-danger text-right">{this.state.formMessages.item}</div>

                                            </div>
                                            {this.state.homePageRegister ? null :
                                                <div>
                                                    <div className="float-right">
                                                        <button
                                                            className="btn btn-success btn-round mb-2"
                                                            id="add"
                                                            onClick={(e) => this.AddList(this.state.username, e)}
                                                        >
                                                            הוסף קובץ
                                                    </button>
                                                    </div>


                                                    <Form>
                                                        <Form.File id="fileInput">
                                                            <Form.File.Label></Form.File.Label>
                                                            <Form.File.Input
                                                                type="file"
                                                                name="file1"
                                                                onChange={this.UserinputAdmin}
                                                                value={this.state.username}
                                                                className="mb-3"
                                                            />
                                                        </Form.File>
                                                    </Form>
                                                </div>
                                            }




                                        </div> : null
                                }

                                <div className="form-group row">
                                    <div className="col-md-2 col-sm-10 mb-3">
                                        <button type="button" className="btn btn-danger btn-block" onClick={this.backButton} > חזרה</button>
                                    </div>

                                    <div className="col-md-5"></div>
                                    <div className="col-md-3 col-sm-10">
                                        <div className="form-group">
                                            {this.state.dataUpdate || this.state.dataUpdateTemp ?
                                                this.state.changeSubscription ? <a type="button" className="btn btn-outline-primary  btn-block" onClick={() => this.onUpdateDetails('payment')} href={this.state.signUpData.subscription === 'vip' ? "https://app.icount.co.il/m/cc94e/c45461p4u5f1c68e67e" : "https://app.icount.co.il/m/70e63/c45461p3u5f1c67f34e"}>לתשלום</a>
                                                    : <button type="button" className="btn btn-outline-primary btn-block" onClick={() => this.onUpdateDetails('updateInfo')}>עדכן פרטים</button>
                                                : null
                                            }

                                            {
                                                ((!this.state.dataUpdate && this.state.isCompany)) ?
                                                    this.state.signUpData.subscription === 'regular' ?
                                                        <button className="btn btn-primary btn-block" onClick={this.onSaveData}> סיום הרשמה</button>
                                                        : <button className="btn btn-primary btn-block" onClick={this.onSaveData} >סיום הרשמה</button>
                                                    : null
                                            }

                                            {!this.state.dataUpdate && !this.state.isCompany && !this.state.changeSubscription ?
                                                <div>

                                                    <button type="button" className="btn btn-primary btn-block" onClick={this.onSaveData}> סיום הרשמה</button>
                                                </div> : null
                                            }

                                            {this.state.isCreate ? <PopUp show={this.state.addModalShow}
                                                onHide={() => false}
                                                isCreate={this.state.isCreate}
                                                typeSubscription={this.state.signUpData.subscription}
                                                msg={this.state.message}

                                                updatePopup={this.state.updatePopup} />
                                                :
                                                <AddDepModal show={this.state.addModalShow}
                                                    onHide={() => false}
                                                    msg={this.state.message}
                                                    updatePopup={this.state.updatePopup}
                                                    backSupportFromInfo={this.state.backSupportFromInfo}
                                                    backCustomerAdmin={this.state.backCustomerAdmin}
                                                    editInfoShow={this.state.editInfoShow} />
                                            }


                                        </div>
                                    </div>



                                </div>
                                {this.state.isUsersFromAdmin && <Redirect to="/admin/users" />}
                                {this.state.isAdmin && <Redirect to="/admin" />}
                                {this.state.isSupport && <Redirect to="/support" />}
                                {this.state.isCustomer && <Redirect to="/customer" />}
                                {this.state.isCompanyEditInfo && <Redirect to="/company" />}
                                {this.state.isSignUp && <Redirect to="/login" />}
                                {this.state.backAfterSignUp && <Redirect to="/login" />}
                                {this.state.adminRedirect && <Redirect to="/admin/users" />}
                                {this.state.saleRedirect && <Redirect to="/salesman" />}
                                {this.state.showEmailValidate &&
                                    <ValidateEmail
                                        show={this.state.showEmailValidate}
                                        addModalClosed={this.addModalClosed}
                                        signUpData={this.state.signUpData}
                                        disablePopAfter={this.disablePopAfter}
                                        redirectPage={this.redirectPage}
                                    />
                                }
                                {this.state.changeEmailValidate &&
                                    <ValidateEmail
                                        show={this.state.addModalShowEmailValidate}
                                        addModalClosed={this.addModalClosed}
                                        signUpData={this.state.signUpData}
                                        disablePopAfter={this.disablePopAfter}
                                        redirectPage={this.redirectPage}
                                        changeEmailValidate={this.state.changeEmailValidate}
                                    />

                                }
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

SignUpDetails.contextType = CompanyContext;

export default SignUpDetails;