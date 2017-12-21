import { TestStrictLogicPage } from './app.po';

describe('test-strict-logic App', () => {
  let page: TestStrictLogicPage;

  beforeEach(() => {
    page = new TestStrictLogicPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
