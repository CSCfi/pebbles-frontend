import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Utilities } from './utilities';

describe('Utilities', () => {
  it('should create an instance', () => {
    expect(new Utilities()).toBeTruthy();
  });
  it('should convert lifetimes to strings', () => {
    expect(Utilities.lifetimeToString(3600)).toBe('01:00');
    expect(Utilities.lifetimeToString(3599)).toBe('00:59');
    expect(Utilities.lifetimeToString(0)).toBe('00:00');
  });
  it('should detect responses that did not come from the API', () => {
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({status: 0}))).toBeTrue();
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({status: 503}))).toBeTrue();
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({
      status: 404,
      headers: new HttpHeaders({'content-type': 'text/html'})
    }))).toBeTrue();
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({
      status: 500,
      error: {error: new SyntaxError('Unexpected token <'), text: '<html><body>Bad gateway</body></html>'}
    }))).toBeTrue();
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({
      status: 500,
      error: '<html><body>Bad gateway</body></html>'
    }))).toBeTrue();
    expect(Utilities.isApiUnreachable({error: {message: 'nope'}} as HttpErrorResponse)).toBeFalse();
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({status: 401}))).toBeFalse();
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({
      status: 403,
      error: 'Not enough privileges'
    }))).toBeFalse();
    expect(Utilities.isApiUnreachable(new HttpErrorResponse({
      status: 422,
      headers: new HttpHeaders({'content-type': 'application/json'})
    }))).toBeFalse();
  });
});
