import { Pactl } from './pactl'

test('is instance of', () => {
  expect(new Pactl()).toBeInstanceOf(Pactl)
})
