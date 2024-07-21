import { cleanup, findByTestId, fireEvent, getByTestId, render, screen } from '@testing-library/react';
import App from './App';

const keys = [
    'btn-set',
    'btn-stop',
    'btn-resume',
    'btn-reset',
    'btn-countEnableConditionRender',
    'btn-countDisableConditionRender',
    'btn-countEnableConditionUpdate',
    'btn-countDisableConditionUpdate',
    'p-html',
    'p-value',
    'p-use',
    'p-wrap',
    'p-hardwrap',
    'btn-setAge',
    'btn-resetUser',
    'btn-stopAge',
    'btn-resumeAge',
    'btn-ageEnableConditionRender',
    'btn-ageDisableConditionRender',
    'ps-html',
    'ps-value',
    'ps-use',
    'ps-wrap',
    'ps-hardwrap',
    'pu-wrap',
    'pu-hardwrap',
    'btnu-set',
    'btnu-stop',
    'btnu-resume',
    'btnu-reset',
    'btnu-countEnableConditionRender',
    'btnu-countDisableConditionRender',
    'btnu-countEnableConditionUpdate',
    'btnu-countDisableConditionUpdate',
    'pu-value',
    'pu-use',
    'pu-wrap',
    'pu-hardwrap',
    'puw-watch'
] as const;

const checkCount = (value = '0') => {
    Object.values(keys)
        .filter(n => n.includes('p-'))
        .forEach(n => {
            expect(screen.getByTestId(n).innerHTML).toEqual(value);
        });
};

const checkAge = (value = '27') => {
    Object.values(keys)
        .filter(n => n.includes('ps-'))
        .forEach(n => {
            expect(screen.getByTestId(n).innerHTML).toEqual(value);
        });
};

const checkUser = (value = '27') => {
    Object.values(keys)
        .filter(n => n.includes('pu-'))
        .forEach(n => {
            expect(screen.getByTestId(n).innerHTML).toEqual(value);
        });
};

const checkWatch = (id: 'psw-watch' | 'pw-watch') => {
    expect(screen.getByTestId(id).innerHTML).toEqual('OK');
};

const click = (id: (typeof keys)[number]) => {
    fireEvent.click(screen.getByTestId(id));
};

beforeEach(() => {
    cleanup();
    render(<App />);
    click('btn-reset');
    click('btn-resetUser');
    click('btnu-reset');
});

describe('Normal Value Testing', () => {
    test('[sCount] Test Signify and all element init successfull', () => {
        checkCount();
    });

    test('[sCount] Test FireEvent set count', () => {
        checkCount();
        click('btn-set');
        checkCount('1');
    });

    test('[sCount] Test FireEvent stop/resume count', () => {
        checkCount();
        click('btn-stop');
        click('btn-set');
        checkCount();
        click('btn-resume');
        checkCount('1');
    });

    test('[sCount] Test reset', () => {
        checkCount();
        click('btn-set');
        checkCount('1');
        click('btn-reset');
        checkCount();
    });

    test('[sCount] Test watch', () => {
        click('btn-set');
        checkWatch('pw-watch');
    });

    test('[sCount] Test condition render', () => {
        click('btn-countEnableConditionRender');
        click('btn-set');
        checkCount();
        click('btn-set');
        checkCount();
        click('btn-countDisableConditionRender');
        click('btn-set');
        checkCount('3');
    });

    test('[sCount] Test condition update', () => {
        click('btn-countEnableConditionUpdate');
        click('btn-set');
        checkCount('1');
        click('btn-set');
        checkCount('1');
        click('btn-countDisableConditionUpdate');
        click('btn-set');
        checkCount('2');
    });
});

describe('Object Value Testing', () => {
    test('[sUser] Test Signify and all element init successfull', () => {
        checkUser();
    });

    test('[sUser] Test FireEvent set count', () => {
        checkUser();
        click('btnu-set');
        checkUser('28');
    });

    test('[sUser] Test FireEvent stop/resume count', () => {
        checkUser();
        click('btnu-stop');
        click('btnu-set');
        checkUser();
        click('btnu-resume');
        checkUser('28');
    });

    test('[sUser] Test reset', () => {
        checkUser();
        click('btnu-set');
        checkUser('28');
        click('btnu-reset');
        checkUser();
    });

    test('[sUser] Test watch', () => {
        click('btnu-set');
        checkWatch('pw-watch');
    });

    test('[sUser] Test condition render', () => {
        checkUser();
        click('btnu-countEnableConditionRender');
        click('btnu-set');
        checkUser('28');
        click('btnu-set');
        checkUser('28');
        click('btnu-countDisableConditionRender');
        click('btnu-set');
        checkUser('30');
    });

    test('[sUser] Test condition update', () => {
        click('btnu-countEnableConditionUpdate');
        click('btnu-set');
        checkUser('27');
        click('btnu-set');
        checkUser('27');
        click('btnu-countDisableConditionUpdate');
        click('btnu-set');
        checkUser('30');
    });
});

describe('Slice Testing', () => {
    test('[ssAge] Test Signify and all element init successfull', () => {
        checkAge();
    });

    test('[ssAge] Test FireEvent stop/resume count', () => {
        checkAge();
        click('btn-stopAge');
        click('btn-setAge');
        checkAge();
        click('btn-resumeAge');
        checkAge('28');
    });

    test('[ssAge] Test watch', () => {
        click('btn-setAge');
        checkWatch('psw-watch');
    });

    test('[ssAge] Test condition render', () => {
        click('btn-ageEnableConditionRender');
        checkAge('27');
        click('btn-setAge');
        checkAge('28');
        click('btn-setAge');
        checkAge('28');
        click('btn-ageDisableConditionRender');
        click('btn-setAge');
        checkAge('30');
    });
});
