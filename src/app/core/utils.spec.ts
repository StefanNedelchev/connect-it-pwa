import { getErrorMessage } from './utils';

describe('#getErrorMessage', () => {
  it('should return empty string', () => {
    expect(getErrorMessage(null)).toEqual('');
    expect(getErrorMessage(undefined)).toEqual('');
  });

  it('should return a string as it is', () => {
    expect(getErrorMessage('test')).toEqual('test');
    expect(getErrorMessage('test2')).toEqual('test2');
  });

  it('should return the message from an error object', () => {
    expect(getErrorMessage(new Error('test1'))).toEqual('test1');
    expect(getErrorMessage(new Error('test2'))).toEqual('test2');
  });

  it('should return message property if the object has it', () => {
    expect(getErrorMessage({ message: 'test1' })).toEqual('test1');
    expect(getErrorMessage({ message: 'test2' })).toEqual('test2');
  });

  it('should return string representation of objects in other cases', () => {
    expect(getErrorMessage(12.5)).toEqual('12.5');
    const date = new Date(2023, 4, 17);
    expect(getErrorMessage(date)).toEqual(date.toString());
  });
});
