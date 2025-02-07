let nome;
let dateString;
let mes;
let mesSelecionado;
let pcd;
let pcdPerm;
let date;
let dtStart;
let dtEnd;

function getAge() {
    dateString = $('#dataNascimento').val() + 'T00:00:00';
    const today = new Date();
    const birthDate = new Date(dateString);
    let ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        ageInYears--;
    }

    let ageInMonths = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
        ageInMonths--;
    }

    if (ageInMonths < 0) {
        ageInMonths += 12;
    }

    return parseFloat((ageInYears + ageInMonths / 12).toFixed(1));
}

function calculodtStart(dateString, mesSelecionado) {
    date = new Date(dateString);
    const today = new Date();
    let age = getAge(dateString);

    if (age > 0.5) {
        date = today;
    }

    if (age > 0.3 && age <= 0.5) {
        if (mesSelecionado === 4) {
            date.setMonth(date.getMonth() + (Math.round(age * 10) + 1));
        } else {
            date.setMonth(date.getMonth() + 6);
        }
    }

    if (age <= 0.3 && (mesSelecionado === 4 || mesSelecionado === 6)) {
        date.setMonth(date.getMonth() + mesSelecionado);
    }

    if (date <= today) {
        date = today;
    }

    return date;
}

function calculodtFim(date, years) {
    const today = new Date();
    date = new Date(dateString);

    let dtEnd = new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
    dtEnd.setDate(dtEnd.getDate() - 1);

    if (dtEnd <= today) {
        dtEnd = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        dtEnd.setDate(dtEnd.getDate() - 1);
    }

    return dtEnd;
}

$('#meses').on('change', function () {
    mes = $('#meses').val();
    if (mes === 'quatroChecked') {
        mesSelecionado = 4;
    } else {
        mesSelecionado = 6;
    }
});

$('#pcd').on('change', function () {
    dateString = $('#dataNascimento').val() + 'T00:00:00';
    mes = $('#meses').val();

    if ($(this).val() == 'Checked') {
        // makeAttachmentMandatory('ActivityDialog-cff35d72c2f1e19aabe0740d7adba1ed');
        $('#pcd-perm').val('');
        $('.outline-pcd-perm').show();
        $('button[type="submit"]').text('Enviar para GESAU');
    } else {
        // setAttachmentFieldExplanation("");
        // makeAttachmentOptionalAndHide('ActivityDialog-cff35d72c2f1e19aabe0740d7adba1ed');
        $('#pcd-perm').val('Unchecked');
        $('.outline-pcd-perm').hide();
        $('button[type="submit"]').text('Enviar para GELPE');
        dtStart = calculodtStart(dateString, mesSelecionado);
        dtEnd = calculodtFim(date, 6);
    }

    // Formata as datas de início e fim para o formato 'dd/mm/yyyy'
    dtStartFormatted = dtStart.toLocaleDateString("pt-BR");
    if (dtEnd instanceof Date) {
        dtEndFormatted = dtEnd.toLocaleDateString("pt-BR");
    } else {
        dtEndFormatted = dtEnd;
    }

    // Define os valores dos campos 'AUXCRECHEDataInicio' e 'AUXCRECHEDataFim' para as datas de início e fim calculadas
    $('#dtInicio').val(dtStartFormatted);
    $('#dtFim').val(dtEndFormatted);

});

$('#pcd-perm').on('change', function () {
    nome = $('#nomeDependente').val();
    dateString = $('#dataNascimento').val() + 'T00:00:00';
    date = new Date(dateString).toLocaleDateString();
    mes = $('#meses').val();
    pcd = $('#pcd').val();
    pcdPerm = $('#pcd-perm').val();
    date = new Date(dateString).toLocaleDateString();
    age = getAge(dateString);

    /**
           * Cálculo das datas de início e fim com base na data de nascimento, idade, status de PNE (Pessoa com Necessidade Especial) e PNE Permanente.
           * As datas calculadas são então definidas nos campos 'AUXCRECHEDataInicio' e 'AUXCRECHEDataFim'.
       */

    // Calcula as datas de início e fim com base na idade e nos valores dos campos PNE
    if (pcd === 'Unchecked') {
        $('#pcd-perm').val('Unchecked');
        dtStart = calculodtStart(dateString, mesSelecionado);
        dtEnd = calculodtFim(date, 6);
    } else if (pcd === 'Checked' && pcdPerm === 'Unchecked') {
        dtStart = calculodtStart(dateString, mesSelecionado);
        if (age >= 6) {
            dtEnd = calculodtFim(dtStart, 1);
        } else {
            dtEnd = calculodtFim(date, 6);
        }
    } else {
        dtStart = calculodtStart(dateString, mesSelecionado);
        dtEnd = 'Indeterminada';
    }

    // Formata as datas de início e fim para o formato 'dd/mm/yyyy'
    dtStartFormatted = dtStart.toLocaleDateString("pt-BR");
    if (dtEnd instanceof Date) {
        dtEndFormatted = dtEnd.toLocaleDateString("pt-BR");
    } else {
        dtEndFormatted = dtEnd;
    }

    // Define os valores dos campos 'AUXCRECHEDataInicio' e 'AUXCRECHEDataFim' para as datas de início e fim calculadas
    $('#dtInicio').val(dtStartFormatted);
    $('#dtFim').val(dtEndFormatted);
});