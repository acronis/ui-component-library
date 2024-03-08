import HighlightDirective from './src/directive';

HighlightDirective.install = function (app) {
  app.directive('highlight', HighlightDirective);
};
export default HighlightDirective;
