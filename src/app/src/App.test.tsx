import { cleanup, findByTestId, fireEvent, getByTestId, render, screen } from '@testing-library/react';
import App from './App';

const keys = [
    'btn-set',
    'btn-stop',
    'btn-resume',
    'btn-reset',
    'p-html',
    'p-value',
    'p-use',
    'p-wrap',
    'p-hardwrap',
    'btn-setAge',
    'btn-resetUser',
    'btn-stopAge',
    'btn-resumeAge',
    'ps-html',
    'ps-value',
    'ps-use',
    'ps-wrap',
    'ps-hardwrap'
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

const checkWatch = (id: 'psw-watch' | 'pw-watch') => {
    expect(screen.getByTestId(id).innerHTML).toEqual('OK');
};

const click = (id: (typeof keys)[number]) => {
    fireEvent.click(screen.getByTestId(id));
};

beforeEach(() => {
    render(<App />);
    click('btn-reset');
    click('btn-resetUser');
});

test('[sCount] Test Signify and all element init successfull', () => {
    checkCount();
    checkAge();
});

test('[sCount] Test FireEvent set count', () => {
    checkCount('0');
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
    checkCount('0');
});

test('[sCount] Test watch', () => {
    click('btn-set');
    checkWatch('pw-watch');
});

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
