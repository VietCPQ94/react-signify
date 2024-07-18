import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  render(<App />);

  const elm = await screen.findByText("0");
  expect(elm.innerHTML).toEqual("0");
  const btn = await screen.findByText("UP")
  fireEvent.click(btn);
  expect(elm.innerHTML).toEqual("1");

});
