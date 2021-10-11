const OperationDropdown = ({ name, className, value, onChange, fieldType }) => {

    var types = [];

    switch (fieldType) {
        case "STRING":
            types = [
                { value: 'EQUALS', label: '=' },
                { value: 'NOT_EQUALS', label: '≠' },
                { value: 'STARTS_WITH', label: 'Inizia con' },
                { value: 'ENDS_WITH', label: 'Finisce con' },
                { value: 'CONTAINS', label: 'Contiene' },
                { value: 'IS_NOT_NULL', label: 'Contiene un valore' },
                { value: 'IS_NULL', label: 'Non contiene un valore' }
            ];
            break;
        case "NUMBER":
            types = [
                { value: 'EQUALS', label: '=' },
                { value: 'NOT_EQUALS', label: '≠' },
                { value: 'STARTS_WITH', label: 'Inizia con' },
                { value: 'ENDS_WITH', label: 'Finisce con' },
                { value: 'CONTAINS', label: 'Contiene' },
                { value: 'IS_NOT_NULL', label: 'Contiene un valore' },
                { value: 'IS_NULL', label: 'Non contiene un valore' }
            ];
            break;
        case "DATE":
            types = [
                { value: 'EQUALS', label: '=' },
                { value: 'NOT_EQUALS', label: '≠' },
                { value: 'IS_NOT_NULL', label: 'Contiene un valore' },
                { value: 'IS_NULL', label: 'Non contiene un valore' },
                { value: 'BETWEEN', label: 'Fra' }
            ];
            break;
        default:
            types = [{ value: 'UNKNOWN', label: 'UNKNOWN' }];
            break;
    }

    const typeOptions = types.map(t => {
        return <option value={t.value} key={t.value}>{t.label}</option>;
    });

    return (
        <select className={className} value={value} onChange={onChange} name={name}>
            {typeOptions}
        </select>
    )

}

export default OperationDropdown;