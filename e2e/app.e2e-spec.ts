import { HelloEditorPage } from './app.po';

describe('hello-editor App', () => {
  let page: HelloEditorPage;

  beforeEach(() => {
    page = new HelloEditorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
