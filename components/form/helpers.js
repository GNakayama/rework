export function validate(item, validation, items) {
    return Object.keys(validation).reduce((acc, el) => {
        if (validation[el].nested) {
            const result = validate(item[el] || {}, validation[el]);
            return { 'valid': result.valid && acc.valid, 'error': { ...acc.error, [el]: result.error } };
        }

        if (validation[el].required) {
            if (item[el] === undefined || item[el] === '' || item[el].length === 0) {
                return { 'valid': false, 'error': { ...acc.error, [el]: { 'validateStatus': 'error', 'msg': 'Este campo é obrigatório!' } } };
            }
        }

        if (validation[el].equalTo) {
            if (item[el] !== item[validation[el].equalTo]) {
                return { 'valid': false, 'error': { ...acc.error, [el]: { 'validateStatus': 'error', 'msg': 'Valores não são iguais!' } } };
            }
        }

        if (validation[el].unique) {
            if (items.find(e => e[el] === item[el])) {
                return {
                    'valid': false,
                    'error': {
                        ...acc.error,
                        [el]: { 'validateStatus': 'error', 'msg': 'Ja existem outros itens com este mesmo valor!'
                        }
                    }
                };
            }
        }

        return { 'valid': acc.valid, 'error': { ...acc.error, [el]: {} } };
    }, { 'valid': true, 'error': {} });
}

