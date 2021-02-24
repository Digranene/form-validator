import React, {useState, useEffect} from 'react';

const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true)
    const [minLengthError, setMinLengthError] = useState(true)
    const [maxLengthError, setMaxLengthError] = useState(true)
    const [emailError, setEmailError] = useState(true)
    const [inputValid, setInputValid] = useState(false)

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'minLength':
// если длина текушего значения в инпуте меньше чем значение хранящееся в обьэкте validations[validation] тогда ошибка true иначе false
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false)
                    break
                case 'maxLength':
                    value.length > validations[validation] ? setMaxLengthError(true) : setMaxLengthError(false)
                case 'isEmpty':
                    value ? setEmpty(false) : setEmpty(true)
                    break
                case 'isEmail':
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    re.test(String(value).toLowerCase()) ? setEmailError(true) : setEmailError(false)
                    break
            }
        }
    }, [value])
    useEffect(() => {
        if (isEmpty || maxLengthError || minLengthError || emailError) {
            setInputValid(false)
        } else {
            setInputValid(true)
        }
    }, [isEmpty, maxLengthError, minLengthError, emailError])

    return {
        isEmpty,
        minLengthError,
        emailError,
        maxLengthError,
        inputValid
    }
}

const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue)
    const [isDirty, setDirty] = useState(false)
    const valid = useValidation(value, validations)

    const onChange = (e) => {
        setValue(e.target.value)
    }
    const onBlur = () => {
        setDirty(true)
    }
    return {
        value,
        onChange,
        onBlur,
        isDirty,
        ...valid
    }
}

const CustomFormValidation = () => {
    const email = useInput('', {isEmpty: true, minLength: 3, isEmail: true})
    const password = useInput('', {isEmpty: true, minLength: 5, maxLength: 12})


    return (
        <div>
            <form>
                <h1>Registration</h1>
                {(email.isDirty && email.isEmpty) && <div style={{color: "red"}}>the field cannot be empty</div>}
                {(email.isDirty && email.minLengthError) && <div style={{color: "red"}}>incorrect length</div>}
                {(email.isDirty && email.maxLengthError) && <div style={{color: "red"}}>incorrect length</div>}
                <input onBlur={e => email.onBlur(e)} onChange={e => email.onChange(e)} value={email.value} type="text"
                       name="email" placeholder="enter your email..."/>

                {(password.isDirty && password.isEmpty) && <div style={{color: "red"}}>the field cannot be empty</div>}
                {(password.isDirty && password.minLengthError) && <div style={{color: "red"}}>incorrect length</div>}
                {(password.isDirty && password.maxLengthError) && <div style={{color: "red"}}>incorrect length</div>}
                <input onBlur={e => password.onBlur(e)} onChange={e => password.onChange(e)} value={password.value}
                       type="password" name="password" placeholder="password your email..."/>

                <button disabled={!email.inputValid || !email.password} type="submit">Registration</button>
            </form>
        </div>
    );
};

export default CustomFormValidation;